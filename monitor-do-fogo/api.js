// Carrega a área queimada real por estado e mês da API pública do Monitor do Fogo.
// Se a API não responder, o protótipo continua com os dados simulados e mostra um aviso.
const API_BASE='https://plataforma.monitorfogo.mapbiomas.org/api';
const IBGE_UF={RO:11,AC:12,AM:13,RR:14,PA:15,AP:16,TO:17,MA:21,PI:22,CE:23,RN:24,PB:25,PE:26,AL:27,SE:28,BA:29,MG:31,ES:32,RJ:33,SP:35,PR:41,SC:42,RS:43,MS:50,MT:51,GO:52,DF:53};
let ANO=2026, MAXM=10, FONTE_DADOS='Protótipo · Dados simulados';

async function apiGet(path){
 const r=await fetch(API_BASE+path);
 if(!r.ok)throw new Error('HTTP '+r.status+' em '+path);
 return r.json();
}

// Redistribui a área de um estado num mês para bater com o valor da API.
// Mantém a divisão simulada entre classes de cobertura e biomas.
function aplicarUF(mesIdx,sigla,alvo){
 const rs=dados.filter(d=>d.mes===mesIdx&&d.uf===sigla);
 const atual=rs.reduce((a,r)=>a+r.ha,0);
 if(!rs.length||!atual)return;
 const f=alvo/atual;let carry=0,prev=0;
 rs.forEach(r=>{
  carry+=r.ha*f;r.ha=Math.round(carry)-prev;prev+=r.ha;
  r.em=+(r.ha*[0,8.8,4.1,3.4][r.c]*(1+r.b/20)).toFixed(2);
  r.orig=Math.round(r.ha/(110+r.c*14));
 });
}

async function carregarMapaApi(){
 try{
  const anos=await apiGet('/statistics/years');
  ANO=anos[anos.length-1];
  const mesesApi=await apiGet('/statistics/'+ANO+'/months');
  MAXM=mesesApi[mesesApi.length-1];
  const porMes=await Promise.all(Array.from({length:MAXM},(_,i)=>apiGet('/statistics/ranking/country/0/state/raw?year='+ANO+'&monthStart='+(i+1)+'&monthEnd='+(i+1))));
  porMes.forEach((lista,i)=>{
   lista.forEach(item=>{
    const sigla=Object.keys(IBGE_UF).find(s=>IBGE_UF[s]===item.code);
    if(sigla)aplicarUF(i,sigla,item.value||0);
   });
  });
  // Série nacional (gráficos de área queimada por ano e por mês)
  anoFogo=ANO;
  periodoFogo.fim=MAXM-1;mesFogo=MAXM-1;
  if(!params.get('mes'))m=MAXM-1;
  $('relMes').innerHTML=selectOpts(meses.slice(0,MAXM).map((n,i)=>[i,cap(n)+' de '+ANO]));
  FONTE_DADOS='Dados: API do Monitor do Fogo · até '+meses[MAXM-1]+' de '+ANO;
  $('atualizacao').textContent=FONTE_DADOS;
  render();
 }catch(e){
  console.warn('API do Monitor do Fogo indisponível; usando dados simulados.',e);
  FONTE_DADOS='Protótipo · API indisponível, dados simulados';
  $('atualizacao').textContent=FONTE_DADOS;
  render();
 }
}
