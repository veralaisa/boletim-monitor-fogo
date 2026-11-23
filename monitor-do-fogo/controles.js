const persist=(k,v)=>{try{localStorage.setItem('monitor-'+k,v)}catch{}};
const pref=k=>{try{return localStorage.getItem('monitor-'+k)}catch{return null}};
const params=new URLSearchParams(location.search);
const valido=(key,n,max)=>{const v=params.get(key);return v!==null&&/^\d+$/.test(v)&&+v<=max?+v:n};
function abrirSecao(k){stopAnim();stopPlay();const dest={origem:1,trajeto:2,combustivel:3}[k];if(dest!==undefined){$('produto').value=dest;step=1;legendOff.clear()}secao=k;render();$('secoes').querySelector('[aria-current]')?.focus({preventScroll:true})}
$('secoes').onclick=e=>{if(e.target.dataset.sec)abrirSecao(e.target.dataset.sec)};
$('relatorio').addEventListener('click',e=>{if(e.target.dataset.recorte){$('uf').value=e.target.dataset.recorte;secao='geral';render()}if(e.target.id==='abrirMapa')view(false)});
function setup(){m=valido('mes',9,11);$('produto').value=valido('produto',0,5);$('bioma').value=valido('bioma',0,6);$('classe').value=valido('classe',0,3);$('uf').value=estados.some(s=>s.id===params.get('uf'))?params.get('uf'):'';rel=params.get('vista')==='relatorio';secao=params.get('secao')||'geral';if(!secoesRel.some(([k])=>k===secao))secao='geral';render()}
function shareURL(){const u=new URL(location.href);u.search='';u.hash='';for(const [k,v] of Object.entries({vista:rel?'relatorio':'mapa',produto:p,mes:m,uf,classe:cl,bioma:bio,secao}))if(v!=='')u.searchParams.set(k,v);return u.href}
function compartilhar(){const u=shareURL();modal('Compartilhar visualização','<p>O link abre o produto, o recorte e o período selecionados.</p><label class="sharelabel">Link da visualização<input id="shareurl" readonly></label><button id="copiar" class="botao">Copiar link</button><p id="copiado" aria-live="polite"></p>');$('shareurl').value=u;$('copiar').onclick=async()=>{try{await navigator.clipboard.writeText(u);$('copiado').textContent='Link copiado.'}catch{$('shareurl').focus();$('shareurl').select();$('copiado').textContent='Link selecionado para copiar.'}}}
$('share').onclick=compartilhar;
function toggle(k,on){document.documentElement.classList.toggle(k,on);persist(k,on?'1':'0')}
['escuro','texto-maior','movimento-reduzido'].forEach(k=>toggle(k,pref(k)==='1'));
$('tema').onclick=()=>{toggle('escuro',!document.documentElement.classList.contains('escuro'));$('tema').setAttribute('aria-pressed',document.documentElement.classList.contains('escuro'))};$('tema').setAttribute('aria-pressed',document.documentElement.classList.contains('escuro'));
$('acess').onclick=()=>{modal('Acessibilidade','<label class="check"><input type="checkbox" id="tam"> Ampliar texto e controles</label><label class="check"><input type="checkbox" id="mov"> Reduzir movimento</label>');for(const [id,k] of [['tam','texto-maior'],['mov','movimento-reduzido']]){const input=$(id);input.checked=document.documentElement.classList.contains(k);input.onchange=()=>{toggle(k,input.checked);if(k==='mov'&&input.checked){stopPlay();stopAnim();render()}}}};
$('menu').onclick=()=>{modal('Menu','<div class="menuitems"><button data-go="map">Mapa</button><button data-go="report">Relatório</button><button data-go="share">Compartilhar visualização</button><button data-go="spec">Ficha do produto</button></div>');$('modalBody').onclick=e=>{const a=e.target.dataset.go;if(!a)return;$('modalBody').onclick=null;$('modal').close();if(a==='spec')spec();else if(a==='share')compartilhar();else view(a==='report')}};
setup();
iniciarFogo();
const termos={
'Mapa':'Map','Relatório':'Report','Baixar dados':'Download data','Recorte':'Region','Período':'Period','Brasil':'Brazil','Compartilhar':'Share','Imprimir ou salvar PDF':'Print or save PDF','Série demonstrativa até setembro de 2026':'Demo series through September 2026','Visão geral':'Overview','Mês a mês':'Month by month','Dentro do normal?':'Within the expected range?','O que queimou':'What burned','Destaques':'Highlights','Onde queima':'Where fires occur','Origem':'Origin','Trajetória':'Trajectory','Combustível':'Fuel','Método e citação':'Method and citation','Todas as classes':'All classes','Vegetação nativa':'Native vegetation','Pastagem':'Pasture','Agricultura':'Agriculture','Todos os biomas':'All biomes','Área queimada':'Burned area','Origem do fogo':'Fire origin','Trajetória espacial e temporal':'Fire progression over time','Material combustível':'Fuel material','Fumaça':'Smoke','Emissões':'Emissions','Sobre os produtos':'About the products','Idioma da navegação':'Navigation language','Acessibilidade':'Accessibility','Alternar tema':'Toggle theme','Menu':'Menu','Recorte territorial':'Territory','Classe de cobertura':'Land cover class','Bioma':'Biome','Produto':'Product','Visualização':'View','Seções do relatório':'Report sections'};
const englishMonths='January February March April May June July August September October November December'.split(' ');
meses.forEach((s,i)=>termos[cap(s)+' de 2026']=englishMonths[i]+' 2026');
function navLanguage(lang){
 persist('idioma',lang);
 const invert=Object.fromEntries(Object.entries(termos).map(([k,v])=>[v,k]));
 const dict=lang==='en'?termos:invert;
 document.querySelectorAll('header,.filtros,.relbar,#secoes').forEach(root=>{
 root.lang=lang==='en'?'en':'pt-BR';
 const walk=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);let n;
 while(n=walk.nextNode()){const key=n.nodeValue.trim();if(dict[key])n.nodeValue=n.nodeValue.replace(key,dict[key])}
 root.querySelectorAll('[aria-label],[title]').forEach(el=>{for(const a of ['aria-label','title']){const v=el.getAttribute(a);if(dict[v])el.setAttribute(a,dict[v])}});
 });
}
$('idioma').onclick=()=>{modal('Idioma da navegação / Navigation language','<p>Idioma dos menus e filtros. O conteúdo técnico está em português.</p><label class="sharelabel">Idioma / Language <select id="idiomaEscolha"><option value="pt">Português</option><option value="en">English</option></select></label>');$('idiomaEscolha').value=pref('idioma')||'pt';$('idiomaEscolha').onchange=e=>{navLanguage(e.target.value);$('modal').close()}};
new MutationObserver(()=>{if(pref('idioma')==='en')navLanguage('en')}).observe($('secoes'),{childList:true});
navLanguage(pref('idioma')||'pt');
carregarMapaApi();
