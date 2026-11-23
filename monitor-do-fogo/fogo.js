const anosFogo=[2019,2020,2021,2022,2023,2024,2025,2026];
let totalAnualFogo=[15.9,18.1,13.3,14.8,12.4,26.3,9.8,10.7].map(v=>v*1e6);
const distribuicaoMesFogo=[.055,.052,.055,.060,.065,.075,.095,.135,.165,.145,.105,.093];
const API_FOGO=API_BASE; let apiFogo={monthly:[],classes:[],classesByLevel:{},ranking:[]}; let modoFogo='mensal', anoFogo=ANO, mesFogo=9, agrupamentoFogo='Estados', buscaTerritorioFogo='', menuFogo='', nivelFogo=1, periodoFogo={tipo:'periodo',inicio:0,fim:9};
const coresNivel1={'floresta':'#1f8d49','vegetação herbácea e arbustiva':'#d6bc74','agropecuária':'#ffefc3','área não vegetada':'#d4271e','corpo d’água':'#2532e4',"corpo d'água":'#2532e4'};
const coresMapbiomas={floresta:'#1f8d49','formação florestal':'#1f8d49','formação savânica':'#7dc975','vegetação savânica':'#7dc975',mangue:'#04381d','campo alagado':'#519799','área pantanosa':'#519799',campestre:'#d6bc74',pastagem:'#edde8e',agricultura:'#e974ed',silvicultura:'#7a5900','área não vegetada':'#d4271e','corpo d’água':'#2532e4'};
function corUso(nome,i,nivel){const n=(nome||'').toLowerCase();if(nivel===1){const keyNivel1=Object.keys(coresNivel1).find(k=>n.includes(k));if(keyNivel1)return coresNivel1[keyNivel1]}const key=Object.keys(coresMapbiomas).find(k=>n.includes(k));return key?coresMapbiomas[key]:['#1f8d49','#7dc975','#519799','#d6bc74','#edde8e','#e974ed','#7a5900'][i%7]}
function periodoLabelFogo(){return periodoFogo.tipo==='periodo'?cap(meses[periodoFogo.inicio])+' a '+cap(meses[periodoFogo.fim])+' de '+anoFogo:cap(meses[periodoFogo.fim])+' de '+anoFogo}
function periodoCurtoFogo(){return periodoFogo.tipo==='periodo'?meses[periodoFogo.inicio].slice(0,3)+' – '+meses[periodoFogo.fim].slice(0,3):meses[periodoFogo.fim].slice(0,3)}
function totalPeriodoFogo(year){let inicio=periodoFogo.tipo==='periodo'?periodoFogo.inicio:periodoFogo.fim;return Array.from({length:periodoFogo.fim-inicio+1},(_,i)=>totalMesFogo(year,inicio+i)).reduce((a,b)=>a+b,0)}
function fmtMi(v){return (v/1e6).toLocaleString('pt-BR',{minimumFractionDigits:1,maximumFractionDigits:1})}
function fmtMi2(v){return (v/1e6).toLocaleString('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2})}
function totalMesFogo(year,month){
 const base=totalAnualFogo[year-2019]; if(apiFogo.monthly.length){const live=apiFogo.monthly.find(x=>x.year===year&&x.month===month+1);if(live)return live.areaHa;}
 if(year===2026)return base*distribuicaoMesFogo.slice(0,9).reduce((a,b)=>a+b,0)>0?base*distribuicaoMesFogo[month]/distribuicaoMesFogo.slice(0,9).reduce((a,b)=>a+b,0):0;
 return base*distribuicaoMesFogo[month]
}
function totalAnualVisivel(year){
 const i=year-2019;
 if(!uf&&!cl)return totalAnualFogo[i];
 const all=rows(8),scope=all.filter(r=>(!uf||r.uf===uf)&&(!cl||r.c===cl));
 const base=sum(all,'ha'),ratio=base?sum(scope,'ha')/base:1;
 return totalAnualFogo[i]*ratio
}
function abreMenuFogo(tipo){
 menuFogo=menuFogo===tipo?'':tipo;
 desenhaMenuFogo()
}
function desenhaMenuFogo(){
 const box=$('menusFogo');
 if(!menuFogo){box.hidden=true;box.innerHTML='';return}
 box.hidden=false;
 if(menuFogo==='territorio'){
  box.innerHTML='<div class="menu-fogo"><div class="menu-title">Selecionar território <button data-close>×</button></div><input id="buscaTerr" type="search" placeholder="Pesquisar território" value="'+buscaTerritorioFogo+'"><div class="territorios">'+[['','Brasil'],...estados.map(s=>[s.id,s.name])].filter(x=>x[1].toLowerCase().includes(buscaTerritorioFogo.toLowerCase())).map(([v,n])=>'<button data-uf-fogo="'+v+'" class="'+(uf===v?'selected':'')+'">'+n+(uf===v?' ✓':'')+'</button>').join('')+'</div></div>';
  $('buscaTerr').oninput=e=>{buscaTerritorioFogo=e.target.value;desenhaMenuFogo();$('buscaTerr').focus();$('buscaTerr').setSelectionRange(buscaTerritorioFogo.length,buscaTerritorioFogo.length)}
 }else if(menuFogo==='agrupar'){
  box.innerHTML='<div class="menu-fogo"><div class="menu-title">Agrupar por <button data-close>×</button></div>'+[['Brasil','Brasil'],['Regiões','Regiões'],['Estados','Estados'],['Biomas','Biomas']].map(([v,n])=>'<button data-grupo="'+v+'" class="'+(agrupamentoFogo===v?'selected':'')+'">'+n+(agrupamentoFogo===v?' ✓':'')+'</button>').join('')+'</div>'
 }else if(menuFogo==='cobertura'){
  const nomes=['Todas as classes','Vegetação nativa','Pastagem','Agricultura'];
  box.innerHTML='<div class="menu-fogo"><div class="menu-title">Cobertura do solo <button data-close>×</button></div>'+nomes.map((n,i)=>'<label class="classe-op"><input type="checkbox" data-classe-fogo="'+i+'" '+(!cl||cl===i?'checked':'')+'><i class="swatch" style="background:'+['#bec6c1','#329564','#d9b750','#bf54a0'][i]+'"></i>'+n+'</label>').join('')+'<p>Selecione uma classe para filtrar o mapa e os gráficos.</p></div>'
 }else{
  box.innerHTML='<div class="menu-fogo ano-menu"><div class="menu-title">Selecione o ano <button data-close>×</button></div><div class="anos-fogo">'+anosFogo.map(y=>'<button data-ano="'+y+'" class="'+(y===anoFogo?'selected':'')+'">'+y+'</button>').join('')+'</div><div class="menu-actions"><button data-close>Cancelar</button><button class="apply-year" data-apply-year>Aplicar</button></div></div>'
 }
 box.querySelectorAll('[data-close]').forEach(b=>b.onclick=()=>abreMenuFogo(''));
 box.querySelectorAll('[data-uf-fogo]').forEach(b=>b.onclick=()=>{uf=b.dataset.ufFogo;$('uf').value=uf;zoom=uf?1.65:1;abreMenuFogo('');render()});
 box.querySelectorAll('[data-grupo]').forEach(b=>b.onclick=()=>{agrupamentoFogo=b.dataset.grupo;$('agruparBtn').innerHTML='Agrupar por <strong>'+agrupamentoFogo+'</strong><span>⌄</span>';abreMenuFogo('');render()});
 box.querySelectorAll('[data-classe-fogo]').forEach(b=>b.onchange=()=>{cl=+b.dataset.classeFogo;$('classe').value=cl;render();desenhaMenuFogo()});
 box.querySelectorAll('[data-ano]').forEach(b=>b.onclick=()=>{box.querySelectorAll('[data-ano]').forEach(x=>x.classList.toggle('selected',x===b))});
 const apply=box.querySelector('[data-apply-year]');if(apply)apply.onclick=()=>{const selected=box.querySelector('[data-ano].selected');if(selected)anoFogo=+selected.dataset.ano;modoFogo='mensal';mesFogo=periodoFogo.fim;m=mesFogo;abreMenuFogo('');render()}
}
function graficoFogo(){
 const annual=modoFogo==='anual';
 const vals=annual?anosFogo.map(y=>totalAnualVisivel(y)):anosFogo.map(y=>totalMesFogo(y,mesFogo)*(cl?1-.13*cl:1));
 const labels=anosFogo;
 const max=Math.max(...vals);
 return '<div class="grafico-fogo" role="img" aria-label="'+(annual?'Área queimada acumulada por ano':'Área queimada em '+cap(meses[mesFogo])+' por ano')+'">'+vals.map((v,i)=>'<button class="barra-fogo '+(anosFogo[i]===anoFogo?'current':'')+'" data-chart-index="'+i+'" title="'+labels[i]+': '+fmtMi(v)+' milhões de hectares"><i style="height:'+Math.max(2,100*v/max)+'%"></i><span>'+labels[i]+'</span></button>').join('')+'</div><div class="eixo-fogo"><span>0</span><span>'+fmtMi(max/3)+' mi</span><span>'+fmtMi(max*2/3)+' mi</span><span>'+fmtMi(max)+' mi ha</span></div>'
}
async function carregarApiFogo(){
 try{
  const [series,levelsApi,rankingApi]=await Promise.all([
   fetch(API_FOGO+'/statistics/time-series/country/0/state?monthStart=1&monthEnd=12').then(r=>r.json()),
   Promise.all([1,2,3,4].map(level=>fetch(API_FOGO+'/statistics/land-cover/country/0/state?level='+level+'&year='+anoFogo+'&monthStart=1&monthEnd=12').then(r=>r.json()))),
   fetch(API_FOGO+'/statistics/ranking/country/0/biome?year='+anoFogo+'&monthStart=1&monthEnd=12').then(r=>r.json())
  ]);
  if(series.annual?.length){const vals=series.annual.sort((a,b)=>a.year-b.year).map(x=>x.areaHa);if(vals.length>=8)totalAnualFogo=vals}
  if(Array.isArray(series.monthly))apiFogo.monthly=series.monthly;
  levelsApi.forEach((classesApi,levelIndex)=>{if(Array.isArray(classesApi))apiFogo.classesByLevel[levelIndex+1]=classesApi.map((x,i)=>({...x,color:corUso(x.namePt,i,levelIndex+1)}))});apiFogo.classes=apiFogo.classesByLevel[1]||[];
  if(rankingApi?.x)apiFogo.ranking=rankingApi.x.map((name,i)=>({name,areaHa:rankingApi.series?.[0]?.data?.[i]||0}));
  render();
 }catch(e){console.info('API Fogo indisponível, usando dados demonstrativos',e)}
}
function renderFogo(){
 $('filtrosFogo').hidden=false;$('territorioFallback').hidden=true;$('classeFallback').hidden=true;$('biomaWrap').hidden=true;
 $('timeline').hidden=false;
 $('territorioBtn').innerHTML='Recorte <strong>'+(uf?estados.find(s=>s.id===uf).name:'Brasil')+'</strong><span>⌄</span>';
 $('agruparBtn').innerHTML='Agrupar por <strong>'+agrupamentoFogo+'</strong><span>⌄</span>';
 $('coberturaBtn').innerHTML='Cobertura <strong>'+(cl?classes[cl]:'Todas as classes')+'</strong><span>⌄</span>';
 $('periodoBtn').hidden=true;$('timelineAno').textContent=anoFogo;$('rangeInicio').value=periodoFogo.tipo==='periodo'?periodoFogo.inicio:periodoFogo.fim;$('rangeFim').value=periodoFogo.fim;const timelineRange=$('rangeInicio').parentElement;const inicioTimeline=periodoFogo.tipo==='periodo'?periodoFogo.inicio:periodoFogo.fim;timelineRange.style.setProperty('--start',(inicioTimeline/11*100)+'%');timelineRange.style.setProperty('--end',(periodoFogo.fim/11*100)+'%');$('tempoValue').textContent=modoFogo==='anual'?'Série anual · 2019–2026':periodoCurtoFogo();$('meses').querySelectorAll('[data-m]').forEach(b=>{const i=+b.dataset.m;b.classList.toggle('fora-periodo',i<inicioTimeline||i>periodoFogo.fim)});
 const current=modoFogo==='anual'?totalAnualVisivel(anoFogo):totalMesFogo(anoFogo,mesFogo);
 const context=modoFogo==='anual'?'Total anual · 2019–2026':'Área queimada em '+cap(meses[mesFogo])+' de '+anoFogo;
 $('tituloMapa').textContent='Área queimada por estado';
 $('subMapa').textContent=cap(meses[mesFogo])+' de '+anoFogo+' · hectares';
 mapa();
 const monthly=totalMesFogo(anoFogo,mesFogo)*(cl?1-.13*cl:1);
 const inicioPeriodo=periodoFogo.tipo==='periodo'?periodoFogo.inicio:0;
 const annual=Array.from({length:mesFogo-inicioPeriodo+1},(_,i)=>totalMesFogo(anoFogo,inicioPeriodo+i)*(cl?1-.13*cl:1)).reduce((a,b)=>a+b,0);
 const previous=mesFogo>0?totalMesFogo(anoFogo,mesFogo-1):monthly;
 const variation=previous?Math.round((monthly/previous-1)*100):0;
 const anosPassados=anosFogo.filter(y=>y<anoFogo);
const mediaPeriodo=anosPassados.length?anosPassados.reduce((s,y)=>s+Array.from({length:mesFogo+1},(_,i)=>totalMesFogo(y,i)).reduce((a,b)=>a+b,0),0)/anosPassados.length:0;
const varMedia=mediaPeriodo?Math.round((annual/mediaPeriodo-1)*100):0;
const nativaShare=(()=>{const l1=apiFogo.classesByLevel[1];if(!l1||!l1.length)return null;const tot=l1.reduce((a,x)=>a+(x.areaHa||0),0);const nat=l1.filter(x=>/floresta|herbác/i.test(x.namePt)).reduce((a,x)=>a+(x.areaHa||0),0);return tot?nat/tot*100:null})();
const monthlyCard='<div class="fogo-card"><div class="metricname">ÁREA QUEIMADA EM '+cap(meses[mesFogo]).toUpperCase()+'</div><div class="fogo-big">'+nf(monthly)+' <small>ha</small></div><p>Respondeu por '+Math.round(monthly/Math.max(annual,1)*100)+'% do acumulado do ano</p><div class="compare green">▼ '+Math.abs(variation)+'% <span>vs. '+cap(meses[Math.max(0,mesFogo-1)])+'</span></div></div>';
 const annualCard='<div class="fogo-card"><div class="metricname">ACUMULADO DE JANEIRO A '+cap(meses[mesFogo]).toUpperCase()+'</div><div class="fogo-big">'+nf(annual)+' <small>ha</small></div><p>Soma de janeiro até o mês selecionado</p><div class="compare '+(annual>mediaPeriodo?'red':'green')+'">'+(annual>mediaPeriodo?'▲':'▼')+' '+Math.abs(Math.round((annual/mediaPeriodo-1)*100))+'% <span>vs. média 2019–'+(anoFogo-1)+'</span></div></div>';
 const pico=Array.from({length:mesFogo+1},(_,i)=>totalMesFogo(anoFogo,i)*(cl?1-.13*cl:1));const idxPico=pico.indexOf(Math.max(...pico));const highlight='<div class="fogo-highlights"><div><small>Pico do ano até aqui</small><strong>'+cap(meses[idxPico])+'</strong><span>'+fmtMi(pico[idxPico])+' mi ha</span></div><div><small>Vegetação nativa</small><strong>'+(nativaShare==null?'—':dec(nativaShare)+'%')+'</strong><span>do que queimou de jan. a '+meses[mesFogo].slice(0,3)+'</span></div><div><small>Acumulado vs. média</small><strong class="'+(varMedia>=0?'red-text':'green-text')+'">'+(varMedia>=0?'+':'')+varMedia+'%</strong><span>média 2019–'+(anoFogo-1)+'</span></div><div><small>'+cap(meses[mesFogo])+' vs. anterior</small><strong class="red-text">'+(variation>=0?'+':'')+variation+'%</strong><span>comparação mensal</span></div></div>';
 
const mesAbrev=meses[mesFogo].slice(0,3), mesAntAbrev=meses[Math.max(0,mesFogo-1)].slice(0,3);
const prevMes=totalMesFogo(anoFogo-1,mesFogo)*(cl?1-.13*cl:1);
const prevAcum=Array.from({length:mesFogo+1},(_,i)=>totalMesFogo(anoFogo-1,i)).reduce((a,b)=>a+b,0)*(cl?1-.13*cl:1);
const mediaMes=anosPassados.length?anosPassados.reduce((s,y)=>s+totalMesFogo(y,mesFogo),0)/anosPassados.length:0;
const pct=(a,b)=>b?Math.round((a/b-1)*100):0;
const seta=v=>v>=0?'▲':'▼';
const cor=v=>v>=0?'red':'green';
const dif=d=>(d>=0?'+':'−')+(Math.abs(d)>=1e6?dec(Math.abs(d)/1e6)+' mi':Math.round(Math.abs(d)/1000)+' mil');
const comp=(v,rotulo)=>'<div class="compare '+cor(v)+'">'+seta(v)+' '+Math.abs(v)+'% <span>'+rotulo+'</span></div>';
const fallbackClasses=[['Floresta',.523,'#1f8d49'],['Vegetação Herbácea e Arbustiva',.253,'#d6bc74'],['Agropecuária',.222,'#ffefc3'],['Área não vegetada',.001,'#d4271e'],['Corpo d’água',.001,'#2532e4']];
 const apiClassesNivel=apiFogo.classesByLevel[nivelFogo]||apiFogo.classes;
 const coverage=apiClassesNivel.length
  ?apiClassesNivel.map((x,i)=>[x.namePt,x.areaHa,x.color||['#239550','#d6b666','#f0d98a','#d52e24','#303ed0'][i%5]])
  :fallbackClasses.map(([name,share,color])=>[name,annual*share,color]);
 const coverageTotal=coverage.reduce((sum,item)=>sum+item[1],0);
 let angle=0;
 const segments=coverage.map(([,value,color])=>{const start=angle;angle+=value/Math.max(coverageTotal,1)*100;return color+' '+start+'% '+angle+'%'}).join(',');
 const topShare=coverage.length?coverage[0][1]/Math.max(coverageTotal,1)*100:0;
 const classeCard='<div class="fogo-extra-card"><div class="fogo-extra-head"><strong>Área queimada por classe de Uso e Cobertura</strong></div><div class="nivel-fogo" role="group" aria-label="Nível de classes">'+[1,2,3,4].map(n=>'<button data-nivel="'+n+'" class="'+(nivelFogo===n?'ativo':'')+'">Nível '+n+'</button>').join('')+'</div><button class="map-pill" id="mapClasse">Visualizar no mapa</button><div class="donut-fogo" style="background:conic-gradient('+segments+')"></div><div class="classe-legenda">'+coverage.map(([name,value,color])=>'<div><i style="background:'+color+'"></i><b>'+nf(value)+' ha · '+dec(value/Math.max(coverageTotal,1)*100)+'%</b><span>'+name+'</span></div>').join('')+'</div></div>';
 const territories=apiFogo.ranking.length?apiFogo.ranking:[['Cerrado',.56],['Amazônia',.20],['Caatinga',.032],['Mata Atlântica',.014],['Pantanal',.008],['Pampa',.0004]].map(([name,share])=>({name,areaHa:annual*share}));
 const rankingCard='<div class="fogo-extra-card"><div class="fogo-extra-head"><strong>Ranking dos territórios</strong></div><button class="map-pill" id="mapRanking">Visualizar no mapa</button><div class="ranking-fogo">'+territories.map((item,i)=>'<div><label><b>'+(i+1)+'º '+item.name+'</b><span>'+nf(item.areaHa)+' ha</span></label><i><em style="width:'+100*item.areaHa/Math.max(territories[0].areaHa,1)+'%"></em></i></div>').join('')+'</div></div>';
 $('painel').innerHTML='<h2 class="painel-titulo">Brasil em '+cap(meses[mesFogo])+' de '+anoFogo+'</h2><p class="area-desc">'+fmtMi2(monthly)+' mi ha queimados em '+mesAbrev+'/'+anoFogo+': '+(variation>=0?'+':'−')+Math.abs(variation)+'% vs. '+mesAntAbrev+'/'+anoFogo+'. Acumulado do ano: '+fmtMi2(annual)+' mi ha.</p><button class="link" id="verRel">Ver relatório completo →</button>'
+'<div class="fogo-card"><div class="card-head"><div class="metricname">ÁREA QUEIMADA EM '+cap(meses[mesFogo]).toUpperCase()+'</div><button id="baixarFogo" class="card-share" aria-label="Baixar dados" title="Baixar dados">'+ico('download')+'</button></div><div class="fogo-big">'+nf(monthly)+' <small>ha</small></div><p>Respondeu por '+Math.round(monthly/Math.max(annual,1)*100)+'% do acumulado do ano</p>'
+comp(pct(monthly,prevMes),'vs. '+fmtMi2(prevMes)+' mi ha em '+mesAbrev+'/'+(anoFogo-1)+' ('+dif(monthly-prevMes)+')')
+comp(pct(monthly,mediaMes),'vs. '+fmtMi2(mediaMes)+' mi ha na média 2019–'+(anoFogo-1)+' ('+dif(monthly-mediaMes)+')')+'</div>'
+'<div class="fogo-card"><div class="card-head"><div class="metricname">ACUMULADO DE JANEIRO A '+cap(meses[mesFogo]).toUpperCase()+'</div></div><div class="fogo-big">'+nf(annual)+' <small>ha</small></div><p>Soma de janeiro até o mês selecionado</p>'
+comp(pct(annual,prevAcum),'vs. '+fmtMi2(prevAcum)+' mi ha em '+(anoFogo-1)+' ('+dif(annual-prevAcum)+')')
+comp(pct(annual,mediaPeriodo),'vs. '+fmtMi2(mediaPeriodo)+' mi ha na média 2019–'+(anoFogo-1)+' ('+dif(annual-mediaPeriodo)+')')+'</div>'
+'<div class="fogo-highlights"><div><small>Pico do ano até aqui</small><strong>'+cap(meses[idxPico])+'</strong><span>'+fmtMi2(pico[idxPico])+' mi ha</span></div><div><small>Vegetação nativa</small><strong>'+(nativaShare==null?'—':dec(nativaShare)+'%')+'</strong><span>do que queimou de jan. a '+mesAbrev+'.</span></div><div><small>Acumulado vs. média</small><strong class="'+(varMedia>=0?'red-text':'green-text')+'">'+(varMedia>=0?'+':'−')+Math.abs(varMedia)+'%</strong><span>média 2019–'+(anoFogo-1)+': '+fmtMi2(mediaPeriodo)+' mi ha</span></div><div><small>'+cap(meses[mesFogo])+' vs. '+cap(meses[Math.max(0,mesFogo-1)])+'</small><strong class="'+(variation>=0?'red-text':'green-text')+'">'+(variation>=0?'+':'−')+Math.abs(variation)+'%</strong><span>'+mesAntAbrev+': '+fmtMi2(previous)+' mi ha</span></div></div>'
+'<div class="fogo-chart-card"><strong>Área queimada só em '+meses[mesFogo]+', por ano</strong><p class="emissao-caption">'+anoFogo+': '+fmtMi2(monthly)+' mi ha · '+(pct(monthly,mediaMes)>=0?'+':'−')+Math.abs(pct(monthly,mediaMes))+'% vs. média 2019–'+(anoFogo-1)+'</p><div class="linha-toggle"><div class="modo-fogo" role="group" aria-label="Tipo de gráfico"><button data-modo="mensal" class="'+(modoFogo==='mensal'?'sel':'')+'">Só no mês</button><button data-modo="anual" class="'+(modoFogo==='anual'?'sel':'')+'">Acumulado</button></div></div>'+graficoFogo()+'</div>'+classeCard+rankingCard;
 $('verRel').onclick=()=>view(true);
 $('mapClasse').onclick=()=>{cl=1;$('classe').value=1;render()}; $('mapRanking').onclick=()=>{agrupamentoFogo='Biomas';render()}; $('painel').querySelectorAll('[data-nivel]').forEach(b=>b.onclick=()=>{nivelFogo=+b.dataset.nivel;render()});
 $('painel').querySelectorAll('[data-modo]').forEach(b=>b.onclick=()=>{modoFogo=b.dataset.modo;if(modoFogo==='mensal')m=mesFogo;render()});
  $('baixarFogo').onclick=()=>$('download').click();
 $('painel').querySelectorAll('[data-chart-index]').forEach(b=>b.onclick=()=>{anoFogo=anosFogo[+b.dataset.chartIndex];m=mesFogo;render()});
 $('mapa').onclick=e=>{let id=e.target.dataset.uf;if(id){uf=uf===id?'':id;$('uf').value=uf;zoom=uf?1.65:1;render()}};
}
function iniciarFogo(){
 $('territorioBtn').onclick=()=>abreMenuFogo('territorio');
 $('agruparBtn').onclick=()=>abreMenuFogo('agrupar');
 $('coberturaBtn').onclick=()=>abreMenuFogo('cobertura');
 $('periodoBtn').onclick=()=>abreMenuFogo('ano');
 $('timelineAno').onclick=()=>abreMenuFogo('ano');
 $('rangeInicio').oninput=e=>{periodoFogo.tipo='periodo';periodoFogo.inicio=Math.min(+e.target.value,periodoFogo.fim);m=periodoFogo.fim;mesFogo=m;render()};
 $('rangeFim').oninput=e=>{periodoFogo.tipo='periodo';periodoFogo.fim=Math.max(+e.target.value,periodoFogo.inicio);m=periodoFogo.fim;mesFogo=m;render()};
 document.addEventListener('click',e=>{if(!e.target.closest('#menusFogo')&&!e.target.closest('.filtros-fogo')&&menuFogo)abreMenuFogo('')});
 carregarApiFogo();
}
function renderRelFogo(){
 const rel=$('relatorio');
 const year=modoFogo==='anual';
 rel.innerHTML='<section class="card hero"><div><div class="eyebrow">ÁREA QUEIMADA · BRASIL</div><h2>Área queimada</h2><p>Representa a área queimada '+(year?'em cada ano, desde 2019.':'em cada mês do ano selecionado.')+'</p><div class="big">'+fmtMi(year?totalAnualVisivel(anoFogo):totalMesFogo(anoFogo,mesFogo))+' <small>milhões de hectares</small></div><button class="periodo-inline" id="periodoInline">'+anoFogo+'⌄</button></div><div><div class="modo-fogo" role="group" aria-label="Período do gráfico"><button data-modo="mensal" class="'+(!year?'sel':'')+'">Mensal</button><span>/</span><button data-modo="anual" class="'+(year?'sel':'')+'">Anual</button></div>'+graficoFogo()+'</div></section><div class="prototipo">'+FONTE_DADOS+'</div>';
 rel.querySelectorAll('[data-modo]').forEach(b=>b.onclick=()=>{modoFogo=b.dataset.modo;if(modoFogo==='mensal')m=mesFogo;render()});
 $('periodoInline').onclick=()=>abreMenuFogo('ano');
 rel.querySelectorAll('[data-chart-index]').forEach(b=>b.onclick=()=>{anoFogo=anosFogo[+b.dataset.chartIndex];m=mesFogo;render()});
}
