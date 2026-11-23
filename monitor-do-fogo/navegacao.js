let secao='geral';
const secoesRel=[['geral','Visão geral'],['mensal','Mês a mês'],['normal','Dentro do normal?'],['cobertura','O que queimou'],['destaques','Destaques'],['onde','Onde queima'],['origem','Origem'],['trajeto','Trajetória'],['combustivel','Combustível'],['metodo','Método e citação']];
function opcoesRel(){return secoesRel.filter(([k])=>!['mensal','normal','cobertura','destaques','onde'].includes(k)||p===0||([1,5].includes(p)&&['mensal','onde'].includes(k)))}
function montarSecao(){
 const links=opcoesRel();
 if(!links.some(([k])=>k===secao))secao='geral';
 $('secoes').innerHTML='<span class="regbadge">'+reg()+'</span>'+links.map(([k,n])=>'<button data-sec="'+k+'" '+(secao===k?'aria-current="page"':'')+'>'+n+'</button>').join('');
 if(secao==='geral')return;
 const rs=rows(),v=val(rs),head='<div class="eyebrow">'+reg().toUpperCase()+' · '+periodo()+'</div><h2>'+links.find(([k])=>k===secao)[1]+'</h2>';
 let content='';
 switch(secao){
 case 'mensal':content='<p>'+prod[p][0]+' por mês, em '+units[p]+'.</p>'+chart()+'<table class="tabla"><tr><th>Mês</th><th>Total ('+units[p]+')</th></tr>'+meses.slice(0,m+1).map((n,i)=>'<tr><td>'+cap(n)+'</td><td>'+nf(val(rows(i)))+'</td></tr>').join('')+'</table>';break;
 case 'normal':content='<p>Para saber se o mês ficou dentro do esperado, é preciso comparar o mesmo período em vários anos. A série demonstrativa contém apenas 2026.</p>'+metric('ÁREA QUEIMADA NO MÊS',nf(v),'ha',periodo())+'<h3 class="subheading">Contexto no ano</h3>'+chart();break;
 case 'cobertura':content='<p>Distribuição da área queimada por classe de uso e cobertura.</p><table class="tabla"><tr><th>Classe</th><th>Área (ha)</th><th>Participação</th></tr>'+classes.slice(1).filter(n=>!cl||n===classes[cl]).map(n=>{let a=sum(rs.filter(r=>r.c===classes.indexOf(n)),'ha');return '<tr><td>'+n+'</td><td>'+nf(a)+'</td><td>'+(v?dec(a/v*100)+'%':'—')+'</td></tr>'}).join('')+'</table>';break;
 case 'destaques':content=destaques();break;
 case 'onde':content='<p>'+prod[p][0]+' nas unidades da federação. Selecione uma UF para consultar seu relatório.</p><table class="tabla"><tr><th>UF</th><th>Total ('+units[p]+')</th></tr>'+estados.filter(s=>!uf||s.id===uf).map(s=>[s,stateVal(s)]).sort((a,b)=>b[1]-a[1]).map(([s,n])=>'<tr><td><button class="link" data-recorte="'+s.id+'">'+s.name+'</button></td><td>'+nf(n)+'</td></tr>').join('')+'</table>';break;
 case 'origem':content=cobertura();break;
 case 'trajeto':case 'combustivel':content='<p>'+prod[p][5]+'.</p>'+ficha()+'<button id="abrirMapa" class="botao">Explorar no mapa</button>';break;
 case 'metodo':content=ficha()+'<h3 class="subheading">Como citar esta visualização</h3><p>Monitor do Fogo. Protótipo demonstrativo. '+prod[p][0]+', '+reg()+', '+periodo()+'. Dados simulados. Limites territoriais de Natural Earth.</p>'+'<a class="link" href="https://brasil.mapbiomas.org/plataforma/" target="_blank" rel="noopener">Consultar a plataforma MapBiomas</a>';break;
 }
 $('relatorio').innerHTML='<section class="card secbody">'+head+content+'</section>';
}
