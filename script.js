(function(){
const KEY='pautado-v1';
const $app=document.getElementById('app');
const MESES=['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro'];
const DOW=['D','S','T','Q','Q','S','S'];
const DOWN=['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];
const STATUS={fila:'Na fila',producao:'Em produção',entregue:'Aguardando aprovação',alteracao:'Em alteração',aprovada:'Aprovada'};
 
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const pad=n=>String(n).padStart(2,'0');
const iso=d=>d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate());
const parse=s=>{const [y,m,d]=s.split('-').map(Number);return new Date(y,m-1,d)};
const today=()=>{const d=new Date();d.setHours(0,0,0,0);return d};
const addDays=(d,n)=>{const x=new Date(d);x.setDate(x.getDate()+n);return x};
const br=s=>{const d=parse(s);return pad(d.getDate())+'/'+pad(d.getMonth()+1)+'/'+d.getFullYear()};
const brShort=s=>{const d=parse(s);return DOWN[d.getDay()]+', '+pad(d.getDate())+'/'+pad(d.getMonth()+1)};
const stamp=()=>{const d=new Date();return pad(d.getDate())+'/'+pad(d.getMonth()+1)+' '+pad(d.getHours())+':'+pad(d.getMinutes())};
const uid=()=>Math.random().toString(36).slice(2,9);
 
/* ---------- seed ---------- */
function seed(){
  const t=today();
  const bd=n=>{let d=new Date(t),c=0;while(c<n){d=addDays(d,1);if(d.getDay()!==0&&d.getDay()!==6)c++}return iso(d)};
  const y=t.getFullYear();
  const s={
    session:null,
    users:[
      {id:'u-des',name:'Estúdio Norte',email:'estudio@norte.design',pass:'demo',role:'designer'},
      {id:'u-cli',name:'Café Mirante',email:'contato@cafemirante.com',pass:'demo',role:'cliente'}
    ],
    clients:{'u-cli':{credits:9,plan:'mensal',cycleEnd:iso(addDays(t,18)),monthly:20}},
    released:14,
    seq:146,
    settings:{
      workdays:[1,2,3,4,5],
      capacity:2,
      holidays:[
        {date:y+'-10-12',name:'Nossa Senhora Aparecida'},
        {date:y+'-11-02',name:'Finados'},
        {date:y+'-11-20',name:'Consciência Negra'},
        {date:y+'-12-25',name:'Natal'}
      ],
      types:[
        {id:'post',name:'Post para feed',credits:2,lead:2,freeRev:1,extra:1,exts:'png, jpg',fields:[
          {k:'texto',label:'Texto da arte',kind:'textarea',hint:'Tudo o que precisa aparecer escrito na peça.'},
          {k:'formato',label:'Formato',kind:'select',options:['1080 × 1350 (retrato)','1080 × 1080 (quadrado)']},
          {k:'objetivo',label:'Objetivo do post',kind:'text',hint:'Ex.: divulgar o café da manhã de sábado.'},
          {k:'ref',label:'Referência visual',kind:'text',hint:'Link ou descrição de uma arte que você gosta.'}]},
        {id:'stories',name:'Sequência de stories',credits:3,lead:3,freeRev:1,extra:1,exts:'png, jpg, mp4',fields:[
          {k:'telas',label:'Número de telas',kind:'number',min:2,max:10},
          {k:'roteiro',label:'Roteiro tela a tela',kind:'textarea',hint:'Uma linha por tela.'},
          {k:'cta',label:'Chamada final',kind:'text',hint:'Ex.: “Peça pelo link da bio”.'}]},
        {id:'banner',name:'Banner para site',credits:4,lead:4,freeRev:2,extra:2,exts:'png, jpg, webp',fields:[
          {k:'dim',label:'Dimensões em px',kind:'text',hint:'Ex.: 1920 × 600'},
          {k:'titulo',label:'Título',kind:'text'},
          {k:'sub',label:'Subtítulo',kind:'text'},
          {k:'link',label:'Página de destino',kind:'text'}]},
        {id:'flyer',name:'Flyer ou cardápio',credits:6,lead:5,freeRev:2,extra:2,exts:'pdf',fields:[
          {k:'conteudo',label:'Conteúdo completo',kind:'textarea',hint:'Itens, preços, endereço, horários.'},
          {k:'tam',label:'Tamanho',kind:'select',options:['A4','A5','DL (10 × 21 cm)']},
          {k:'uso',label:'Uso',kind:'select',options:['Impresso (PDF com sangria de 3 mm)','Digital (PDF leve)']}]}
      ]
    },
    demands:[]
  };
  const mk=(code,typeId,fields,due,status,hist,extra={})=>{
    const ty=s.settings.types.find(x=>x.id===typeId);
    return Object.assign({id:uid(),code,clientId:'u-cli',typeId,typeName:ty.name,fields,due,status,credits:ty.credits,freeRev:ty.freeRev,extra:ty.extra,revUsed:0,extraPaid:0,files:[],lockedAt:hist[0].t,history:hist},extra);
  };
  s.demands=[
    mk('OS-0145','post',{texto:'Café da manhã de sábado\nPão na chapa + café coado por R$ 18\nDas 8h às 11h',formato:'1080 × 1350 (retrato)',objetivo:'Encher a casa no sábado de manhã',ref:'Fotos com luz natural, tipografia grande'},bd(2),'producao',
      [{t:'22/09 10:14',x:'Pedido criado e briefing travado'},{t:'22/09 10:14',x:'2 créditos retidos'},{t:'23/09 09:02',x:'Estúdio iniciou a produção'}]),
    mk('OS-0144','stories',{telas:'4',roteiro:'Tela 1: novo cold brew\nTela 2: como é feito (12h de infusão)\nTela 3: preço R$ 14\nTela 4: onde comprar',cta:'Peça pelo link da bio'},bd(1),'entregue',
      [{t:'19/09 15:40',x:'Pedido criado e briefing travado'},{t:'19/09 15:40',x:'3 créditos retidos'},{t:'22/09 11:20',x:'Estúdio iniciou a produção'},{t:'24/09 17:05',x:'Entrega verificada e enviada (4 arquivos)'}],
      {files:[{name:'coldbrew_01.png',size:812000},{name:'coldbrew_02.png',size:790000},{name:'coldbrew_03.png',size:744000},{name:'coldbrew_04.png',size:801000}]}),
    mk('OS-0146','banner',{dim:'1920 × 600',titulo:'Grãos da Mantiqueira',sub:'Torra média, notas de chocolate e laranja',link:'cafemirante.com/graos'},bd(6),'fila',
      [{t:'25/09 08:31',x:'Pedido criado e briefing travado'},{t:'25/09 08:31',x:'4 créditos retidos'}]),
    mk('OS-0141','flyer',{conteudo:'Cardápio de inverno: chocolate quente R$ 16, chai R$ 15, torta de maçã R$ 19',tam:'A5',uso:'Impresso (PDF com sangria de 3 mm)'},iso(addDays(t,-6)),'aprovada',
      [{t:'08/09 13:00',x:'Pedido criado e briefing travado'},{t:'08/09 13:00',x:'6 créditos retidos'},{t:'15/09 16:48',x:'Entrega verificada e enviada (1 arquivo)'},{t:'16/09 09:10',x:'Cliente aprovou. 6 créditos liberados ao estúdio'}],
      {files:[{name:'cardapio_inverno_A5.pdf',size:2400000}]})
  ];
  return s;
}
let S;
function load(){try{const r=localStorage.getItem(KEY);if(r){S=JSON.parse(r);return}}catch(e){}S=seed()}
function save(){try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}}
load();
 
/* ---------- ui state ---------- */
let view=S.session?'app':'landing';
let route={page:'home'};
let wiz=null;
let authErr='';
let detailUI={};
let confirmBuy=null;
 
function toast(msg){const t=document.getElementById('toast');t.textContent=msg;t.hidden=false;clearTimeout(toast.h);toast.h=setTimeout(()=>t.hidden=true,2600)}
const me=()=>S.users.find(u=>u.id===S.session);
const typeById=id=>S.settings.types.find(t=>t.id===id);
 
/* ---------- calendar rules ---------- */
function holidayOf(isoDate){return S.settings.holidays.find(h=>h.date===isoDate)}
function isWork(d){return S.settings.workdays.includes(d.getDay())&&!holidayOf(iso(d))}
function earliest(lead){let d=today(),c=0,guard=0;while(c<lead&&guard<400){d=addDays(d,1);if(isWork(d))c++;guard++}return d}
function load_(isoDate){return S.demands.filter(x=>x.due===isoDate&&x.status!=='aprovada').length}
function dayState(d,lead){
  const i=iso(d);
  if(d<=today())return 'passado';
  if(holidayOf(i))return 'feriado';
  if(!S.settings.workdays.includes(d.getDay()))return 'folga';
  if(d<earliest(lead))return 'cedo';
  if(load_(i)>=S.settings.capacity)return 'lotado';
  return 'ok';
}
function escrowOf(cid){return S.demands.filter(d=>d.clientId===cid&&d.status!=='aprovada').reduce((a,d)=>a+d.credits+d.extraPaid,0)}
 
/* ---------- shared pieces ---------- */
const regMark=`<svg class="reg" viewBox="0 0 24 24" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="6" fill="var(--accent)"/><path d="M7 8.5h10M7 12h10M7 15.5h6" stroke="#fff" stroke-width="1.8" stroke-linecap="round"/></svg>`;
const pill=st=>`<span class="pill ${st}">${STATUS[st]}</span>`;
 
function topbar(){
  const u=me();
  if(!u){
    return `<div class="top"><button class="logo" data-a="go-landing">${regMark}Pautado</button><span class="spacer"></span>
      <button class="btn ghost sm" data-a="go-login">Entrar</button><button class="btn dark sm" data-a="go-signup">Criar conta</button></div>`;
  }
  const isC=u.role==='cliente';
  const tabs=isC?[['home','Meus pedidos'],['nova','Novo pedido'],['creditos','Créditos']]:[['home','Fila de pedidos'],['config','Regras do estúdio']];
  const cur=route.page==='demanda'?'home':route.page;
  return `<div class="top"><button class="logo" data-a="nav" data-p="home">${regMark}Pautado</button>
    <nav class="nav">${tabs.map(([p,l])=>`<button class="${cur===p?'on':''}" data-a="nav" data-p="${p}">${l}</button>`).join('')}</nav>
    <span class="spacer"></span>
    ${isC?`<span class="chip"><b>${S.clients[u.id].credits}</b> créditos</span>`:`<span class="chip">Estúdio</span>`}
    <span class="muted" style="font-size:14px">${esc(u.name)}</span>
    <button class="btn ghost sm" data-a="logout">Sair</button></div>`;
}
 
/* ---------- landing ---------- */
function landing(){
  return topbar()+`
  <section class="hero">
    <div>
      <p class="eyebrow">Novo · Pautado</p>
      <h1>Pedido completo. Prazo que cabe. <em>Pagamento na aprovação.</em></h1>
      <p class="lede">O cliente só consegue enviar um pedido com o briefing inteiro preenchido e numa data que o estúdio consegue cumprir. Os créditos ficam retidos até a aprovação da entrega.</p>
      <div class="ctas"><button class="btn primary" data-a="go-signup">Criar conta</button><button class="btn" data-a="demo" data-r="cliente">Testar como cliente</button><button class="btn ghost" data-a="demo" data-r="designer">Testar como estúdio ›</button></div>
    </div>
    <div class="ticket" aria-label="Exemplo de ordem de serviço">
      <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:10px"><span class="muted" style="font-size:14px">Ordem de serviço · OS-0145</span></div>
      <h3 style="font-size:28px;font-weight:700;letter-spacing:-.035em;margin-bottom:10px">Post para feed</h3>
      <div class="stamp">2 créditos retidos</div>
      <div class="row"><span>Cliente</span><span>Café Mirante</span></div>
      <div class="row"><span>Formato</span><span class="mono">1080 × 1350</span></div>
      <div class="row"><span>Texto</span><span>Café da manhã de sábado…</span></div>
      <div class="row"><span>Entrega</span><span class="mono">qui, 01/10</span></div>
      <div class="row"><span>Alterações</span><span class="mono">0 de 1 grátis</span></div>
      <div class="row"><span>Status</span><span>${pill('producao')}</span></div>
    </div>
  </section>
  <section class="section">
    <header><h2>Como um pedido anda</h2><p class="muted" style="max-width:44ch">Quatro etapas, sempre nessa ordem. Nenhuma pode ser pulada.</p></header>
    <div class="steps">
      <div class="step"><span class="n">1</span><h3>Escolha a peça</h3><p class="muted">Cada tipo tem preço em créditos, prazo mínimo e alterações incluídas definidos pelo estúdio.</p></div>
      <div class="step"><span class="n">2</span><h3>Preencha o briefing</h3><p class="muted">Todos os campos são obrigatórios. Depois de enviado, o briefing fica travado.</p></div>
      <div class="step"><span class="n">3</span><h3>Escolha a data</h3><p class="muted">O calendário esconde fins de semana, feriados, dias lotados e datas antes do prazo mínimo.</p></div>
      <div class="step"><span class="n">4</span><h3>Aprove a entrega</h3><p class="muted">A entrega passa por uma verificação contra o briefing. Os créditos só vão para o estúdio quando você aprova.</p></div>
    </div>
  </section>
  <section class="section">
    <header><h2>Regras do estúdio, aplicadas pelo sistema</h2></header>
    <div class="rules">
      <div><h3>Briefing travado</h3><p class="muted">O que foi pedido fica registrado com data e hora. Mudança de ideia vira alteração.</p></div>
      <div><h3>Calendário viável</h3><p class="muted">O estúdio define dias de trabalho, feriados e quantas entregas cabem por dia.</p></div>
      <div><h3>Alterações contadas</h3><p class="muted">Cada tipo inclui um número de alterações. As próximas custam créditos, com valor definido antes.</p></div>
      <div><h3>Pagamento retido</h3><p class="muted">Créditos saem do seu saldo na hora do pedido e ficam guardados até a aprovação.</p></div>
      <div><h3>Verificação da entrega</h3><p class="muted">Antes do envio, os arquivos são conferidos item a item contra o briefing.</p></div>
    </div>
  </section>
  <section class="section">
    <header><h2>Planos</h2></header>
    <div class="plans">
      <div class="plan"><p class="eyebrow">Avulso</p><p class="price">R$ 22 <span class="muted" style="font:400 17px var(--sans);letter-spacing:-.02em">por crédito</span></p>
        <ul><li>Pacotes de 5 ou 10 créditos</li><li>Créditos não expiram</li><li>Bom para pedidos esporádicos</li></ul></div>
      <div class="plan hl"><p class="eyebrow">Mensal</p><p class="price">R$ 390 <span class="muted" style="font:400 17px var(--sans);letter-spacing:-.02em">/ mês</span></p>
        <ul><li>20 créditos por ciclo (R$ 19,50 cada)</li><li>Créditos não acumulam: o saldo zera no fim do ciclo</li><li>Prioridade no calendário do estúdio</li></ul></div>
    </div>
  </section>
  <footer class="foot"><span>Pautado · protótipo. Dados ficam só neste navegador.</span><button class="btn ghost sm" data-a="reset">Restaurar dados de exemplo</button></footer>`;
}
 
/* ---------- auth ---------- */
const CONTRACT=`<p><b>1. Objeto.</b> O estúdio produz as peças pedidas pelo cliente conforme o briefing enviado pela plataforma.</p>
<p><b>2. Briefing.</b> O briefing enviado é definitivo. Pedidos fora dele contam como alteração.</p>
<p><b>3. Prazo.</b> A data escolhida no calendário é o prazo de entrega. Atrasos do estúdio devolvem 50% dos créditos do pedido.</p>
<p><b>4. Alterações.</b> Cada tipo de peça inclui um número de alterações. Alterações adicionais são cobradas no valor informado no pedido.</p>
<p><b>5. Pagamento.</b> Os créditos ficam retidos até a aprovação da entrega. Sem resposta do cliente em 5 dias úteis, a entrega é aprovada automaticamente.</p>
<p><b>6. Plano mensal.</b> Os créditos do plano mensal não acumulam e zeram no fim de cada ciclo.</p>`;
function login(){
  return topbar()+`<div class="auth">
    <div><p class="eyebrow">Entrar</p><h2 style="margin-top:8px">Acesse seus pedidos</h2></div>
    <form class="card form" data-f="login">
      <div class="field"><label for="l-email">E-mail</label><input class="input" id="l-email" name="email" type="email" required autocomplete="email"></div>
      <div class="field"><label for="l-pass">Senha</label><input class="input" id="l-pass" name="pass" type="password" required autocomplete="current-password"></div>
      ${authErr?`<p class="errmsg">${esc(authErr)}</p>`:''}
      <button class="btn primary" type="submit">Entrar</button>
    </form>
    <div class="demo"><button class="btn" data-a="demo" data-r="cliente">Entrar como Café Mirante</button><button class="btn" data-a="demo" data-r="designer">Entrar como Estúdio Norte</button></div>
    <p class="muted" style="font-size:14px;text-align:center">Ainda não tem conta? <button class="btn ghost sm" data-a="go-signup">Criar conta</button></p>
  </div>`;
}
function signup(){
  return topbar()+`<div class="auth">
    <div><p class="eyebrow">Criar conta de cliente</p><h2 style="margin-top:8px">Comece a pedir peças ao Estúdio Norte</h2></div>
    <form class="card form" data-f="signup">
      <div class="field"><label for="s-name">Nome da empresa</label><input class="input" id="s-name" name="name" required autocomplete="organization"></div>
      <div class="field"><label for="s-email">E-mail</label><input class="input" id="s-email" name="email" type="email" required autocomplete="email"></div>
      <div class="field"><label for="s-pass">Senha</label><input class="input" id="s-pass" name="pass" type="password" minlength="4" required autocomplete="new-password"><span class="hint">Mínimo de 4 caracteres.</span></div>
      <div class="field"><label>Plano</label>
        <div class="seg"><label><input type="radio" name="plan" value="mensal" id="s-plan-m" checked><strong>Mensal</strong><small>20 créditos · R$ 390</small></label>
        <label><input type="radio" name="plan" value="avulso" id="s-plan-a"><strong>Avulso</strong><small>Compre quando precisar</small></label></div></div>
      <details class="contract"><summary>Contrato de prestação de serviço</summary><div>${CONTRACT}</div></details>
      <label class="check"><input type="checkbox" name="ok" id="s-ok" required> Li e aceito o contrato. Ele vale para todos os pedidos feitos nesta conta.</label>
      ${authErr?`<p class="errmsg">${esc(authErr)}</p>`:''}
      <button class="btn primary" type="submit">Criar conta</button>
    </form>
  </div>`;
}
 
/* ---------- client: home ---------- */
function listItems(list,showClient){
  if(!list.length)return `<div class="empty">Nenhum pedido aqui.</div>`;
  return list.map(d=>{
    const late=d.status!=='aprovada'&&parse(d.due)<today();
    const cli=S.users.find(u=>u.id===d.clientId);
    return `<button class="item" data-a="open" data-id="${d.id}">
      <span class="mono code muted">${d.code}</span>
      <span><span class="t">${esc(d.typeName)}</span><br><span class="s">${showClient?esc(cli?cli.name:'')+' · ':''}${d.credits+d.extraPaid} créditos</span></span>
      ${pill(d.status)}
      <span class="due ${late?'late':''}">${d.status==='aprovada'?'entregue':'até'} ${brShort(d.due)}</span></button>`;
  }).join('');
}
function clientHome(){
  const u=me(),c=S.clients[u.id];
  const mine=S.demands.filter(d=>d.clientId===u.id);
  const open=mine.filter(d=>d.status!=='aprovada').sort((a,b)=>a.due.localeCompare(b.due));
  const done=mine.filter(d=>d.status==='aprovada');
  const waiting=mine.filter(d=>d.status==='entregue');
  return `<div class="page">
    <div class="pagehead"><div><p class="eyebrow">${esc(u.name)}</p><h1 style="margin-top:8px">Meus pedidos</h1></div><button class="btn primary" data-a="nav" data-p="nova">Novo pedido</button></div>
    ${waiting.length?`<div class="note warn">${waiting.length===1?'1 entrega espera':waiting.length+' entregas esperam'} sua aprovação. Os créditos só são liberados ao estúdio quando você aprova.</div>`:''}
    <div class="stats">
      <div class="stat"><span class="eyebrow">Disponíveis</span><span class="v">${c.credits}<small>cr</small></span></div>
      <div class="stat"><span class="eyebrow">Retidos</span><span class="v">${escrowOf(u.id)}<small>cr</small></span></div>
      <div class="stat"><span class="eyebrow">Em andamento</span><span class="v">${open.length}</span></div>
      <div class="stat"><span class="eyebrow">${c.plan==='mensal'?'Ciclo termina':'Plano'}</span><span class="v" style="font-size:22px">${c.plan==='mensal'?brShort(c.cycleEnd):'Avulso'}</span></div>
    </div>
    <div style="display:grid;gap:10px"><h3>Em andamento</h3><div class="list">${listItems(open)}</div></div>
    <div style="display:grid;gap:10px"><h3>Concluídos</h3><div class="list">${listItems(done)}</div></div>
  </div>`;
}
 
/* ---------- client: wizard ---------- */
function newWiz(){const t=today();wiz={step:1,typeId:null,fields:{},due:null,month:new Date(t.getFullYear(),t.getMonth(),1),errors:{}}}
function wizard(){
  if(!wiz)newWiz();
  const labels=['Tipo de peça','Briefing','Data de entrega','Revisão'];
  const head=`<div class="pagehead"><div><p class="eyebrow">Novo pedido</p><h1 style="margin-top:8px">${['Que peça você precisa?','Briefing','Quando você precisa?','Confira e envie'][wiz.step-1]}</h1></div>
    <div class="wsteps">${labels.map((l,i)=>`<span class="${i+1===wiz.step?'on':i+1<wiz.step?'done':''}">${i+1}. ${l}</span>`).join('')}</div></div>`;
  let body='';
  const ty=wiz.typeId&&typeById(wiz.typeId);
  if(wiz.step===1){
    body=`<div class="types">${S.settings.types.map(t=>`<button class="type ${wiz.typeId===t.id?'on':''}" data-a="pick-type" data-id="${t.id}">
      <h3>${esc(t.name)}</h3>
      <dl><dt>Custo</dt><dd>${t.credits} créditos</dd><dt>Prazo mínimo</dt><dd>${t.lead} dias úteis</dd><dt>Alterações incluídas</dt><dd>${t.freeRev}</dd><dt>Alteração extra</dt><dd>${t.extra} cr</dd><dt>Arquivos</dt><dd>${esc(t.exts)}</dd></dl></button>`).join('')}</div>`;
  }
  if(wiz.step===2){
    body=`<form class="card form" data-f="brief" novalidate>
      <p class="muted" style="font-size:14px">${esc(ty.name)} · todos os campos são obrigatórios. Depois do envio, o briefing não pode ser editado.</p>
      ${ty.fields.map(f=>{
        const v=wiz.fields[f.k]??'',err=wiz.errors[f.k],id='b-'+f.k;
        let ctl;
        if(f.kind==='textarea')ctl=`<textarea class="input" id="${id}" name="${f.k}">${esc(v)}</textarea>`;
        else if(f.kind==='select')ctl=`<select class="input" id="${id}" name="${f.k}"><option value="">Escolha…</option>${f.options.map(o=>`<option ${o===v?'selected':''}>${esc(o)}</option>`).join('')}</select>`;
        else ctl=`<input class="input" id="${id}" name="${f.k}" type="${f.kind==='number'?'number':'text'}" ${f.min?`min="${f.min}" max="${f.max}"`:''} value="${esc(v)}">`;
        return `<div class="field ${err?'err':''}"><label for="${id}">${esc(f.label)}</label>${ctl}${f.hint?`<span class="hint">${esc(f.hint)}</span>`:''}${err?`<span class="errmsg">${esc(err)}</span>`:''}</div>`;
      }).join('')}
      <div class="actions"><button class="btn" type="button" data-a="wiz-back">Voltar</button><button class="btn primary" type="submit">Escolher data</button></div></form>`;
  }
  if(wiz.step===3){
    const m=wiz.month,first=new Date(m.getFullYear(),m.getMonth(),1),days=new Date(m.getFullYear(),m.getMonth()+1,0).getDate();
    const e=earliest(ty.lead);
    let cells='';for(let i=0;i<first.getDay();i++)cells+=`<span class="day blank"></span>`;
    for(let d=1;d<=days;d++){
      const dt=new Date(m.getFullYear(),m.getMonth(),d),st=dayState(dt,ty.lead),i=iso(dt);
      const h=holidayOf(i);
      const tip={passado:'Data passada',feriado:'Feriado: '+(h?h.name:''),folga:'Estúdio não trabalha neste dia',cedo:'Antes do prazo mínimo de '+ty.lead+' dias úteis',lotado:'Agenda cheia neste dia',ok:'Disponível'}[st];
      cells+=`<button class="day ${st==='ok'?'ok':'x '+st} ${wiz.due===i?'sel':''}" ${st==='ok'?`data-a="pick-day" data-d="${i}"`:'disabled'} title="${esc(tip)}" aria-label="${d} de ${MESES[m.getMonth()]}: ${esc(tip)}">${d}</button>`;
    }
    const t=today(),canPrev=m>new Date(t.getFullYear(),t.getMonth(),1);
    const monthHols=S.settings.holidays.filter(h=>{const d=parse(h.date);return d.getMonth()===m.getMonth()&&d.getFullYear()===m.getFullYear()});
    body=`<div class="two"><div class="cal"><header><button class="btn sm" data-a="month" data-d="-1" ${canPrev?'':'disabled'} aria-label="Mês anterior">‹</button><strong>${MESES[m.getMonth()]} ${m.getFullYear()}</strong><button class="btn sm" data-a="month" data-d="1" aria-label="Próximo mês">›</button></header>
      <div class="grid7">${DOW.map(x=>`<span class="dow">${x}</span>`).join('')}${cells}</div></div>
      <div class="side card"><p class="eyebrow">Regras deste pedido</p>
        <p>${esc(ty.name)} precisa de <b>${ty.lead} dias úteis</b>. A primeira data possível é <b class="mono">${brShort(iso(e))}</b>.</p>
        <div class="legend"><span><i style="background:var(--paper);border:1px solid var(--line)"></i>Disponível</span><span><i style="background:var(--accent)"></i>Sua escolha</span><span><i style="background:var(--warn)"></i>Feriado</span><span><i style="background:var(--info)"></i>Agenda cheia (${S.settings.capacity} entregas/dia)</span><span><i style="background:var(--sunk)"></i>Fim de semana ou antes do prazo</span></div>
        ${monthHols.length?`<div class="note" style="font-size:13px">${monthHols.map(h=>`<span class="mono">${br(h.date).slice(0,5)}</span> ${esc(h.name)}`).join('<br>')}</div>`:''}
        ${wiz.due?`<div class="note good">Entrega em <b>${brShort(wiz.due)}</b></div>`:''}
        <div class="actions"><button class="btn" data-a="wiz-back">Voltar</button><button class="btn primary" data-a="wiz-next" ${wiz.due?'':'disabled'}>Revisar pedido</button></div></div></div>`;
  }
  if(wiz.step===4){
    const c=S.clients[me().id],enough=c.credits>=ty.credits;
    body=`<div class="two"><div class="card" style="display:grid;gap:16px"><h3>${esc(ty.name)}</h3>
      <dl class="summary">${ty.fields.map(f=>`<dt>${esc(f.label)}</dt><dd>${esc(wiz.fields[f.k])}</dd>`).join('')}<dt>Entrega</dt><dd class="mono">${brShort(wiz.due)}</dd></dl></div>
      <div class="side card"><p class="eyebrow">Pagamento</p>
        <dl class="summary"><dt>Custo</dt><dd class="mono">${ty.credits} créditos</dd><dt>Seu saldo</dt><dd class="mono">${c.credits} créditos</dd><dt>Alterações</dt><dd>${ty.freeRev} incluídas, depois ${ty.extra} cr cada</dd></dl>
        ${enough?`<div class="note">Os ${ty.credits} créditos saem do seu saldo agora e ficam retidos. O estúdio só recebe quando você aprovar a entrega.</div>`
          :`<div class="note bad">Faltam ${ty.credits-c.credits} créditos para este pedido. <button class="btn sm" data-a="nav" data-p="creditos" style="margin-top:8px">Comprar créditos</button></div>`}
        <label class="check"><input type="checkbox" id="w-agree"> Confirmo que o briefing está completo. Depois do envio ele fica travado.</label>
        <div class="actions"><button class="btn" data-a="wiz-back">Voltar</button><button class="btn primary" data-a="wiz-submit" ${enough?'':'disabled'}>Enviar pedido</button></div></div></div>`;
  }
  return `<div class="page">${head}${body}</div>`;
}
 
/* ---------- credits ---------- */
function credits(){
  const u=me(),c=S.clients[u.id];
  const packs=[{n:5,p:110},{n:10,p:210}];
  return `<div class="page">
    <div class="pagehead"><div><p class="eyebrow">Créditos</p><h1 style="margin-top:8px">${c.credits} créditos disponíveis</h1></div></div>
    <div class="plans">
      <div class="plan ${c.plan==='mensal'?'hl':''}"><p class="eyebrow">Plano mensal ${c.plan==='mensal'?'· ativo':''}</p><p class="price">R$ 390 <span class="muted" style="font:400 17px var(--sans);letter-spacing:-.02em">/ mês</span></p>
        <p class="muted">20 créditos por ciclo. O saldo não acumula: no fim do ciclo, os créditos que sobraram zeram e entram 20 novos.</p>
        ${c.plan==='mensal'?`<div class="note">Ciclo atual termina em <b class="mono">${br(c.cycleEnd)}</b>. Créditos retidos em pedidos abertos não são afetados.</div>
          <div class="actions" style="justify-content:flex-start"><button class="btn sm" data-a="cycle">Simular fim do ciclo</button><button class="btn ghost sm" data-a="plan" data-v="avulso">Cancelar plano</button></div>`
          :`<div class="actions" style="justify-content:flex-start"><button class="btn dark" data-a="buy" data-k="mensal">Assinar por R$ 390/mês</button></div>`}
      </div>
      <div class="plan"><p class="eyebrow">Pacotes avulsos</p><p class="muted">Créditos avulsos não expiram e são usados depois dos créditos do plano.</p>
        <div style="display:grid;gap:8px">${packs.map(p=>`<div style="display:flex;justify-content:space-between;align-items:center;gap:10px;padding:10px 12px;border:1px solid var(--line);border-radius:8px"><span><b class="mono">${p.n} créditos</b><br><span class="muted" style="font-size:13px">R$ ${p.p} · R$ ${(p.p/p.n).toFixed(0)} cada</span></span><button class="btn sm" data-a="buy" data-k="${p.n}">Comprar</button></div>`).join('')}</div>
      </div>
    </div>
    ${confirmBuy?`<div class="card" style="display:grid;gap:12px"><h3>Confirmar compra</h3><p>${confirmBuy==='mensal'?'Assinar o plano mensal por R$ 390. Você recebe 20 créditos agora.':`Comprar ${confirmBuy} créditos por R$ ${packs.find(p=>p.n==confirmBuy).p}.`}</p><p class="muted" style="font-size:13px">Protótipo: nenhuma cobrança real acontece.</p><div class="actions" style="justify-content:flex-start"><button class="btn primary" data-a="buy-ok">Confirmar</button><button class="btn" data-a="buy-cancel">Cancelar</button></div></div>`:''}
  </div>`;
}
 
/* ---------- designer home ---------- */
function designerHome(){
  const all=S.demands;
  const by=st=>all.filter(d=>d.status===st);
  const open=all.filter(d=>d.status!=='aprovada').sort((a,b)=>a.due.localeCompare(b.due));
  const retained=open.reduce((a,d)=>a+d.credits+d.extraPaid,0);
  return `<div class="page">
    <div class="pagehead"><div><p class="eyebrow">Estúdio Norte</p><h1 style="margin-top:8px">Fila de pedidos</h1></div></div>
    <div class="stats">
      <div class="stat"><span class="eyebrow">Na fila</span><span class="v">${by('fila').length}</span></div>
      <div class="stat"><span class="eyebrow">Em produção</span><span class="v">${by('producao').length+by('alteracao').length}</span></div>
      <div class="stat"><span class="eyebrow">A receber</span><span class="v">${retained}<small>cr retidos</small></span></div>
      <div class="stat"><span class="eyebrow">Liberado</span><span class="v">${S.released}<small>cr</small></span></div>
    </div>
    <div style="display:grid;gap:10px"><h3>Abertos, por data de entrega</h3><div class="list">${listItems(open,true)}</div></div>
    <div style="display:grid;gap:10px"><h3>Aprovados</h3><div class="list">${listItems(by('aprovada'),true)}</div></div>
  </div>`;
}
 
/* ---------- detail ---------- */
function checklistFor(d){
  const ty=typeById(d.typeId)||{fields:[],exts:''};
  const items=Object.entries(d.fields).map(([k,v])=>{
    const f=ty.fields.find(x=>x.k===k);const lab=f?f.label:k;
    const short=String(v).split('\n')[0];
    return {k,t:`${lab}: ${short.length>60?short.slice(0,60)+'…':short}`};
  });
  (d.revisions||[]).filter(r=>!r.done).forEach((r,i)=>items.push({k:'rev'+i,t:'Alteração pedida: '+r.text}));
  return items;
}
function detail(){
  const d=S.demands.find(x=>x.id===route.id);if(!d)return `<div class="page"><p>Pedido não encontrado.</p></div>`;
  const u=me(),isC=u.role==='cliente',ty=typeById(d.typeId);
  const cli=S.users.find(x=>x.id===d.clientId);
  const freeLeft=Math.max(0,d.freeRev-d.revUsed);
  let action='';
  if(!isC&&d.status==='fila'){
    action=`<div class="card" style="display:grid;gap:12px"><h3>Próximo passo</h3><p class="muted">Comece quando for produzir. O cliente vê a mudança de status.</p><button class="btn primary" data-a="start">Iniciar produção</button></div>`;
  }
  if(!isC&&(d.status==='producao'||d.status==='alteracao')){
    const ui=detailUI[d.id]||(detailUI[d.id]={files:[],checked:{},run:null});
    const items=checklistFor(d);
    action=`<div class="card" style="display:grid;gap:14px"><h3>${d.status==='alteracao'?'Enviar versão alterada':'Enviar entrega'}</h3>
      <div class="field"><label for="up-files">Arquivos finais (${esc(ty?ty.exts:'')})</label><input class="input" id="up-files" type="file" multiple data-a="files"></div>
      ${ui.files.length?`<div class="files">${ui.files.map(f=>`<div class="file"><span>${esc(f.name)}</span><span>${(f.size/1024).toFixed(0)} KB</span></div>`).join('')}</div>`:''}
      <div class="field"><label>Confira cada item do briefing</label><div class="checks">${items.map(it=>`<label class="check"><input type="checkbox" data-a="chk" data-k="${it.k}" ${ui.checked[it.k]?'checked':''}> ${esc(it.t)}</label>`).join('')}</div></div>
      ${ui.run?`<div class="note" style="display:grid;gap:6px">${ui.run.map(s=>`<div class="aistep ${s.st}"><b>${s.st==='pass'?'✓':s.st==='fail'?'✕':'…'}</b>${esc(s.t)}</div>`).join('')}</div>`:''}
      <p class="muted" style="font-size:13px">A verificação confere formato dos arquivos e cobertura do briefing antes de liberar o envio. Neste protótipo ela é simulada.</p>
      <div class="actions"><button class="btn primary" data-a="verify">Verificar e enviar</button></div></div>`;
  }
  if(isC&&d.status==='entregue'){
    const ui=detailUI[d.id]||(detailUI[d.id]={});
    const c=S.clients[u.id];
    action=`<div class="card" style="display:grid;gap:14px"><h3>Sua aprovação</h3>
      <p class="muted">Aprovar libera ${d.credits+d.extraPaid} créditos ao estúdio e encerra o pedido.</p>
      <button class="btn primary" data-a="approve">Aprovar e liberar pagamento</button>
      <div style="border-top:1px solid var(--line);padding-top:14px;display:grid;gap:10px">
        <div class="field"><label for="rev-text">Pedir alteração</label><textarea class="input" id="rev-text" placeholder="Descreva exatamente o que mudar.">${esc(ui.text||'')}</textarea>
        <span class="hint">${freeLeft>0?`Você ainda tem ${freeLeft} ${freeLeft===1?'alteração incluída':'alterações incluídas'}.`:`Alterações incluídas esgotadas. Esta custa ${d.extra} ${d.extra===1?'crédito':'créditos'} (saldo: ${c.credits}).`}</span></div>
        ${ui.err?`<p class="errmsg">${esc(ui.err)}</p>`:''}
        <div class="actions" style="justify-content:flex-start"><button class="btn" data-a="revise">${freeLeft>0?'Pedir alteração':`Pagar ${d.extra} cr e pedir alteração`}</button></div></div></div>`;
  }
  if(d.status==='aprovada')action=`<div class="note good">Pedido aprovado. ${d.credits+d.extraPaid} créditos liberados ao estúdio.</div>`;
  if(isC&&(d.status==='fila'||d.status==='producao'||d.status==='alteracao'))action=`<div class="note">O estúdio está com este pedido. Você recebe a entrega até <b class="mono">${brShort(d.due)}</b>.</div>`;
 
  return `<div class="page">
    <div><button class="btn ghost sm" data-a="nav" data-p="home">← Voltar</button></div>
    <div class="pagehead"><div><p class="eyebrow">${d.code}${!isC&&cli?' · '+esc(cli.name):''}</p><h1 style="margin-top:8px">${esc(d.typeName)}</h1></div>
      <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap">${pill(d.status)}<span class="chip">entrega ${brShort(d.due)}</span></div></div>
    <div class="two">
      <div style="display:grid;gap:16px">
        <div class="card" style="display:grid;gap:14px"><div style="display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap"><h3>Briefing</h3><span class="lock"><svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><rect x="2" y="5" width="8" height="6" rx="1" fill="currentColor"/><path d="M4 5V3.5a2 2 0 0 1 4 0V5" fill="none" stroke="currentColor" stroke-width="1.3"/></svg>travado em ${esc(d.lockedAt)}</span></div>
          <dl class="summary">${Object.entries(d.fields).map(([k,v])=>{const f=ty&&ty.fields.find(x=>x.k===k);return `<dt>${esc(f?f.label:k)}</dt><dd>${esc(v)}</dd>`}).join('')}</dl>
          ${(d.revisions||[]).length?`<div style="display:grid;gap:8px"><p class="eyebrow">Alterações pedidas</p>${d.revisions.map((r,i)=>`<div class="note" style="font-size:14px"><span class="mono muted">#${i+1} · ${esc(r.t)}${r.paid?' · paga':''}</span><br>${esc(r.text)}</div>`).join('')}</div>`:''}
        </div>
        ${action}
      </div>
      <div class="side">
        <div class="card" style="display:grid;gap:12px"><p class="eyebrow">Condições</p><dl class="summary"><dt>Créditos</dt><dd class="mono">${d.credits}${d.extraPaid?' + '+d.extraPaid:''} ${d.status==='aprovada'?'liberados':'retidos'}</dd><dt>Alterações</dt><dd class="mono">${d.revUsed} usadas · ${d.freeRev} incluídas</dd><dt>Extra</dt><dd class="mono">${d.extra} cr cada</dd></dl></div>
        ${d.files.length?`<div class="card" style="display:grid;gap:10px"><p class="eyebrow">Arquivos entregues</p><div class="files">${d.files.map(f=>`<div class="file"><span>${esc(f.name)}</span><span>${(f.size/1024).toFixed(0)} KB</span></div>`).join('')}</div></div>`:''}
        <div class="card" style="display:grid;gap:12px"><p class="eyebrow">Histórico</p><ol class="timeline">${d.history.map(h=>`<li><span><time>${esc(h.t)}</time>${esc(h.x)}</span></li>`).join('')}</ol></div>
      </div>
    </div></div>`;
}
 
/* ---------- designer settings ---------- */
function config(){
  const st=S.settings;
  return `<div class="page">
    <div class="pagehead"><div><p class="eyebrow">Estúdio Norte</p><h1 style="margin-top:8px">Regras do estúdio</h1></div><p class="muted" style="max-width:40ch;font-size:14px">Valem para pedidos novos. Pedidos já enviados mantêm as condições da data em que foram feitos.</p></div>
    <div style="display:grid;gap:10px"><h3>Tipos de peça</h3>
      <div class="tablewrap"><table><thead><tr><th>Peça</th><th>Créditos</th><th>Prazo mín. (dias úteis)</th><th>Alterações incluídas</th><th>Alteração extra (cr)</th></tr></thead><tbody>
      ${st.types.map(t=>`<tr><td><b>${esc(t.name)}</b><br><span class="muted" style="font-size:13px">${t.fields.length} campos obrigatórios</span></td>
        ${['credits','lead','freeRev','extra'].map(k=>`<td><input class="input" type="number" min="${k==='freeRev'?0:1}" max="60" id="t-${t.id}-${k}" data-a="tset" data-id="${t.id}" data-k="${k}" value="${t[k]}" aria-label="${k} de ${esc(t.name)}"></td>`).join('')}</tr>`).join('')}
      </tbody></table></div></div>
    <div class="two">
      <div class="card" style="display:grid;gap:14px"><h3>Dias de trabalho</h3>
        <div class="wd">${DOWN.map((n,i)=>`<label><input type="checkbox" id="wd-${i}" data-a="wd" data-i="${i}" ${st.workdays.includes(i)?'checked':''}>${n}</label>`).join('')}</div>
        <div class="field"><label for="cap">Entregas por dia</label><input class="input" id="cap" type="number" min="1" max="20" data-a="cap" value="${st.capacity}" style="max-width:120px"><span class="hint">Quando um dia chega a esse número, ele some do calendário do cliente.</span></div>
      </div>
      <div class="card" style="display:grid;gap:14px"><h3>Feriados e folgas</h3>
        <div class="hol">${st.holidays.slice().sort((a,b)=>a.date.localeCompare(b.date)).map(h=>`<div><span><span class="mono">${br(h.date)}</span> · ${esc(h.name)}</span><button class="btn ghost sm" data-a="hol-del" data-d="${h.date}" aria-label="Remover ${esc(h.name)}">Remover</button></div>`).join('')||'<p class="muted">Nenhum.</p>'}</div>
        <form class="row" data-f="hol"><div class="field" style="flex:1;min-width:130px"><label for="h-date">Data</label><input class="input" id="h-date" name="date" type="date" required></div><div class="field" style="flex:2;min-width:150px"><label for="h-name">Motivo</label><input class="input" id="h-name" name="name" placeholder="Ex.: recesso" required></div><button class="btn dark" type="submit">Adicionar</button></form>
      </div>
    </div>
  </div>`;
}
 
/* ---------- render ---------- */
function render(){
  let html='';
  if(view==='landing')html=landing();
  else if(view==='login')html=login();
  else if(view==='signup')html=signup();
  else{
    const u=me();if(!u){view='landing';return render()}
    const pages=u.role==='cliente'?{home:clientHome,nova:wizard,creditos:credits,demanda:detail}:{home:designerHome,config:config,demanda:detail};
    html=topbar()+(pages[route.page]||pages.home)();
    if(u)html+=`<footer class="foot" style="margin-top:40px"><span class="demo-bar">Protótipo · dados salvos só neste navegador. <button class="btn ghost sm" data-a="switch">Trocar para ${u.role==='cliente'?'o estúdio':'o cliente'}</button></span><button class="btn ghost sm" data-a="reset">Restaurar dados de exemplo</button></footer>`;
  }
  $app.innerHTML=html;
}
function go(p,extra){route=Object.assign({page:p},extra||{});if(p==='nova'&&!wiz)newWiz();render();window.scrollTo(0,0)}
function log(d,x){d.history.push({t:stamp(),x})}
 
/* ---------- events ---------- */
$app.addEventListener('click',e=>{
  const b=e.target.closest('[data-a]');if(!b||b.tagName==='INPUT')return;
  const a=b.dataset.a;
  if(a==='go-landing'){view='landing';render()}
  if(a==='go-login'){authErr='';view='login';render()}
  if(a==='go-signup'){authErr='';view='signup';render()}
  if(a==='demo'||a==='switch'){const r=a==='demo'?b.dataset.r:(me().role==='cliente'?'designer':'cliente');S.session=r==='cliente'?'u-cli':'u-des';save();view='app';go('home')}
  if(a==='logout'){S.session=null;save();view='landing';wiz=null;render()}
  if(a==='reset'){try{localStorage.removeItem(KEY)}catch(_){}S=seed();view='landing';wiz=null;detailUI={};render();toast('Dados de exemplo restaurados')}
  if(a==='nav'){if(b.dataset.p==='nova')newWiz();confirmBuy=null;go(b.dataset.p)}
  if(a==='open')go('demanda',{id:b.dataset.id});
  if(a==='pick-type'){wiz.typeId=b.dataset.id;wiz.fields={};wiz.due=null;wiz.errors={};wiz.step=2;render()}
  if(a==='wiz-back'){captureBrief();wiz.step--;render()}
  if(a==='month'){const m=wiz.month;wiz.month=new Date(m.getFullYear(),m.getMonth()+Number(b.dataset.d),1);render()}
  if(a==='pick-day'){wiz.due=b.dataset.d;render()}
  if(a==='wiz-next'){wiz.step=4;render()}
  if(a==='wiz-submit'){
    if(!document.getElementById('w-agree').checked){toast('Marque a confirmação do briefing para enviar');return}
    const ty=typeById(wiz.typeId),c=S.clients[me().id];
    if(dayState(parse(wiz.due),ty.lead)!=='ok'){toast('Essa data deixou de estar disponível. Escolha outra.');wiz.step=3;wiz.due=null;render();return}
    c.credits-=ty.credits;S.seq++;
    const d={id:uid(),code:'OS-'+String(S.seq).padStart(4,'0'),clientId:me().id,typeId:ty.id,typeName:ty.name,fields:Object.assign({},wiz.fields),due:wiz.due,status:'fila',credits:ty.credits,freeRev:ty.freeRev,extra:ty.extra,revUsed:0,extraPaid:0,files:[],lockedAt:stamp(),history:[]};
    log(d,'Pedido criado e briefing travado');log(d,ty.credits+' créditos retidos');
    S.demands.push(d);save();wiz=null;toast(d.code+' enviado');go('demanda',{id:d.id});
  }
  if(a==='buy'){confirmBuy=b.dataset.k;render()}
  if(a==='buy-cancel'){confirmBuy=null;render()}
  if(a==='buy-ok'){
    const c=S.clients[me().id];
    if(confirmBuy==='mensal'){c.plan='mensal';c.credits+=20;c.cycleEnd=iso(addDays(today(),30));toast('Plano mensal ativo. 20 créditos adicionados')}
    else{c.credits+=Number(confirmBuy);toast(confirmBuy+' créditos adicionados')}
    confirmBuy=null;save();render();
  }
  if(a==='plan'){S.clients[me().id].plan='avulso';save();render();toast('Plano cancelado. Seus créditos atuais continuam valendo')}
  if(a==='cycle'){const c=S.clients[me().id];const lost=c.credits;c.credits=c.monthly||20;c.cycleEnd=iso(addDays(parse(c.cycleEnd),30));save();render();toast(`${lost} créditos zeraram. Novo ciclo com ${c.credits} créditos`)}
  const d=route.id&&S.demands.find(x=>x.id===route.id);
  if(a==='start'&&d){d.status='producao';log(d,'Estúdio iniciou a produção');save();render()}
  if(a==='verify'&&d)runVerify(d);
  if(a==='approve'&&d){d.status='aprovada';S.released+=d.credits+d.extraPaid;log(d,`Cliente aprovou. ${d.credits+d.extraPaid} créditos liberados ao estúdio`);save();render();toast('Entrega aprovada')}
  if(a==='revise'&&d){
    const ui=detailUI[d.id]||(detailUI[d.id]={});
    const text=document.getElementById('rev-text').value.trim();ui.text=text;
    if(text.length<10){ui.err='Descreva a alteração com pelo menos 10 caracteres.';render();return}
    const c=S.clients[me().id],free=d.revUsed<d.freeRev;
    if(!free&&c.credits<d.extra){ui.err=`Saldo insuficiente: esta alteração custa ${d.extra} créditos e você tem ${c.credits}.`;render();return}
    if(!free){c.credits-=d.extra;d.extraPaid+=d.extra}
    d.revUsed++;d.revisions=d.revisions||[];d.revisions.push({t:stamp(),text,paid:!free,done:false});
    d.status='alteracao';log(d,free?`Alteração ${d.revUsed} pedida (incluída)`:`Alteração ${d.revUsed} pedida (${d.extra} cr retidos)`);
    detailUI[d.id]={};save();render();toast('Alteração enviada ao estúdio');
  }
  if(a==='hol-del'){S.settings.holidays=S.settings.holidays.filter(h=>h.date!==b.dataset.d);save();render()}
});
$app.addEventListener('change',e=>{
  const t=e.target,a=t.dataset.a;if(!a)return;
  const d=route.id&&S.demands.find(x=>x.id===route.id);
  if(a==='files'&&d){detailUI[d.id].files=[...t.files].map(f=>({name:f.name,size:f.size}));detailUI[d.id].run=null;render()}
  if(a==='chk'&&d){detailUI[d.id].checked[t.dataset.k]=t.checked}
  if(a==='tset'){const ty=typeById(t.dataset.id);const v=Math.max(Number(t.min),Math.round(Number(t.value)||0));ty[t.dataset.k]=v;t.value=v;save();toast('Regra salva')}
  if(a==='wd'){const i=Number(t.dataset.i),w=S.settings.workdays;if(t.checked&&!w.includes(i))w.push(i);if(!t.checked)S.settings.workdays=w.filter(x=>x!==i);if(!S.settings.workdays.length){S.settings.workdays=[i];toast('O estúdio precisa trabalhar pelo menos um dia')}save();render()}
  if(a==='cap'){S.settings.capacity=Math.max(1,Math.round(Number(t.value)||1));save();toast('Capacidade salva')}
});
$app.addEventListener('submit',e=>{
  e.preventDefault();const f=e.target,k=f.dataset.f,fd=new FormData(f);
  if(k==='login'){
    const u=S.users.find(x=>x.email.toLowerCase()===String(fd.get('email')).trim().toLowerCase()&&x.pass===fd.get('pass'));
    if(!u){authErr='E-mail ou senha incorretos. Use os botões de demonstração abaixo se ainda não tem conta.';render();return}
    S.session=u.id;save();view='app';go('home');
  }
  if(k==='signup'){
    const email=String(fd.get('email')).trim().toLowerCase();
    if(S.users.some(x=>x.email.toLowerCase()===email)){authErr='Já existe uma conta com esse e-mail. Entre com ela.';render();return}
    const id='u-'+uid(),plan=fd.get('plan');
    S.users.push({id,name:String(fd.get('name')).trim(),email,pass:fd.get('pass'),role:'cliente'});
    S.clients[id]={credits:plan==='mensal'?20:0,plan,cycleEnd:iso(addDays(today(),30)),monthly:20,contractAt:stamp()};
    S.session=id;save();view='app';go('home');toast(plan==='mensal'?'Conta criada com 20 créditos':'Conta criada. Compre créditos para fazer o primeiro pedido');
  }
  if(k==='brief'){
    captureBrief();const ty=typeById(wiz.typeId);wiz.errors={};
    ty.fields.forEach(fl=>{const v=String(wiz.fields[fl.k]||'').trim();
      if(!v)wiz.errors[fl.k]='Campo obrigatório.';
      else if(fl.kind==='number'&&(Number(v)<fl.min||Number(v)>fl.max))wiz.errors[fl.k]=`Use um número entre ${fl.min} e ${fl.max}.`;
      else if(fl.kind==='textarea'&&v.length<10)wiz.errors[fl.k]='Detalhe um pouco mais (mínimo 10 caracteres).';});
    if(Object.keys(wiz.errors).length){render();const first=document.querySelector('.field.err .input');first&&first.focus();return}
    wiz.step=3;const e0=earliest(ty.lead);wiz.month=new Date(e0.getFullYear(),e0.getMonth(),1);render();
  }
  if(k==='hol'){S.settings.holidays.push({date:fd.get('date'),name:String(fd.get('name')).trim()});save();render();toast('Folga adicionada. O dia sai do calendário do cliente')}
});
function captureBrief(){const f=document.querySelector('form[data-f="brief"]');if(!f||!wiz)return;new FormData(f).forEach((v,k)=>wiz.fields[k]=v)}
 
function runVerify(d){
  const ui=detailUI[d.id],ty=typeById(d.typeId),items=checklistFor(d);
  const exts=(ty?ty.exts:'').split(',').map(s=>s.trim().toLowerCase()).filter(Boolean);
  const steps=[
    {t:'Arquivos anexados',ok:ui.files.length>0,why:'Anexe os arquivos finais.'},
    {t:'Formato dos arquivos ('+exts.join(', ')+')',ok:ui.files.length>0&&ui.files.every(f=>exts.includes(f.name.split('.').pop().toLowerCase())),why:'Algum arquivo não está no formato combinado.'},
    {t:'Itens do briefing conferidos ('+items.filter(i=>ui.checked[i.k]).length+'/'+items.length+')',ok:items.every(i=>ui.checked[i.k]),why:'Marque todos os itens do briefing.'}
  ];
  if(d.typeId==='stories')steps.push({t:'Quantidade de telas ('+d.fields.telas+')',ok:ui.files.length>=Number(d.fields.telas),why:`O briefing pede ${d.fields.telas} telas.`});
  ui.run=steps.map(s=>({t:s.t,st:'run'}));render();
  let i=0;
  const tick=()=>{
    if(i>=steps.length){
      const fail=steps.find(s=>!s.ok);
      if(fail){toast('Envio bloqueado: '+fail.why);return}
      d.files=ui.files.slice();(d.revisions||[]).forEach(r=>r.done=true);
      d.status='entregue';log(d,`Entrega verificada e enviada (${d.files.length} ${d.files.length===1?'arquivo':'arquivos'})`);
      detailUI[d.id]=null;save();render();toast('Entrega enviada ao cliente');return;
    }
    ui.run[i]={t:steps[i].t+(steps[i].ok?'':' — '+steps[i].why),st:steps[i].ok?'pass':'fail'};
    if(!steps[i].ok){for(let j=i+1;j<steps.length;j++)ui.run[j]={t:steps[j].t,st:'run'};render();toast('Envio bloqueado: '+steps[i].why);return}
    i++;render();setTimeout(tick,550);
  };
  setTimeout(tick,500);
}
 
render();
})();
 
