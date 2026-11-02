const GLAZES=[{n:'Кобальт',c:'#25499C'},{n:'Селадон',c:'#7FB5A0'},{n:'Охра',c:'#D9A441'},{n:'Бордо',c:'#7B2D3B'},{n:'Графит',c:'#3A3F47'}];
const ITEMS=[
{id:1,t:'cup',n:'Чашка «Дымка»',d:'250 мл',p:1800,g:1},
{id:2,t:'cup',n:'Чашка «Прибой»',d:'300 мл',p:2100,g:0},
{id:3,t:'plate',n:'Тарелка «Луна»',d:'Ø 24 см',p:2900,g:2},
{id:4,t:'plate',n:'Тарелка «Поле»',d:'Ø 20 см',p:2400,g:4},
{id:5,t:'vase',n:'Ваза «Пруд»',d:'Высота 26 см',p:5200,g:1},
{id:6,t:'vase',n:'Ваза «Стебель»',d:'Высота 32 см',p:6400,g:3}];
const KINDS=[['all','Всё'],['cup','Чашки'],['plate','Тарелки'],['vase','Вазы']];
const SHAPES={
cup:c=>`<svg viewBox="0 0 120 100"><path d="M92 40C114 40 114 70 90 70" stroke="${c}" stroke-width="8" fill="none"/><path d="M18 28H94C94 68 82 88 56 88C30 88 18 68 18 28Z" fill="${c}"/><ellipse cx="56" cy="28" rx="38" ry="6" fill="#000" opacity=".25"/></svg>`,
plate:c=>`<svg viewBox="0 0 120 100"><ellipse cx="60" cy="62" rx="54" ry="20" fill="${c}"/><ellipse cx="60" cy="58" rx="38" ry="12" fill="#000" opacity=".16"/></svg>`,
vase:c=>`<svg viewBox="0 0 200 260"><path d="M80 20H120C120 50 116 62 116 82C158 100 178 140 178 182C178 226 146 250 100 250C54 250 22 226 22 182C22 140 42 100 84 82C84 62 80 50 80 20Z" fill="${c}"/><ellipse cx="100" cy="20" rx="20" ry="5" fill="#000" opacity=".25"/></svg>`};
const $=s=>document.querySelector(s);
const money=n=>n.toLocaleString('ru-RU')+' ₽';
const root=document.documentElement;

/* theme */
function setTheme(t){root.setAttribute('data-theme',t);try{localStorage.setItem('theme',t)}catch(e){}}
try{const t=localStorage.getItem('theme');if(t)root.setAttribute('data-theme',t)}catch(e){}
$('#theme').onclick=()=>{
  const cur=root.getAttribute('data-theme')||(matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light');
  setTheme(cur==='dark'?'light':'dark');
};

/* glaze picker */
const gBox=$('#glazes');
GLAZES.forEach((g,i)=>{
  const b=document.createElement('button');
  b.className='sw';b.type='button';b.style.background=g.c;b.title=g.n;b.setAttribute('aria-label','Глазурь '+g.n);
  b.setAttribute('aria-pressed',i===0);
  b.onclick=()=>{
    root.style.setProperty('--glaze',g.c);$('#gname').textContent=g.n;
    gBox.querySelectorAll('.sw').forEach(x=>x.setAttribute('aria-pressed',x===b));
  };
  gBox.appendChild(b);
});

/* catalog */
let kind='all';
const fBox=$('#filters');
KINDS.forEach(([k,label])=>{
  const b=document.createElement('button');
  b.className='btn';b.type='button';b.textContent=label;b.setAttribute('aria-pressed',k===kind);
  b.onclick=()=>{kind=k;fBox.querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed',x===b));renderGrid()};
  fBox.appendChild(b);
});
function renderGrid(){
  $('#grid').innerHTML=ITEMS.filter(i=>kind==='all'||i.t===kind).map(i=>`
    <article class="card">
      <div class="pic">${SHAPES[i.t](GLAZES[i.g].c)}</div>
      <h3>${i.n}</h3>
      <p>${i.d}, глазурь «${GLAZES[i.g].n}»</p>
      <div class="row"><span class="price">${money(i.p)}</span><button class="btn" data-id="${i.id}" type="button">В корзину</button></div>
    </article>`).join('');
}
$('#grid').addEventListener('click',e=>{
  const id=e.target.dataset&&e.target.dataset.id;
  if(id){cart[id]=(cart[id]||0)+1;renderCart()}
});

/* cart */
const cart={};
function renderCart(){
  const rows=ITEMS.filter(i=>cart[i.id]);
  const count=rows.reduce((s,i)=>s+cart[i.id],0);
  const sum=rows.reduce((s,i)=>s+cart[i.id]*i.p,0);
  $('#cnt').textContent=count;
  $('#sum').textContent=money(sum);
  $('#list').innerHTML=rows.length?rows.map(i=>`<div class="li"><span>${i.n} × ${cart[i.id]}</span><span>${money(i.p*cart[i.id])}</span></div>`).join(''):'<div class="empty">Корзина пуста. Добавьте что-нибудь из каталога.</div>';
}
$('#cartBtn').onclick=()=>$('#cart').showModal();
$('#close').onclick=()=>$('#cart').close();
$('#clear').onclick=()=>{for(const k in cart)delete cart[k];renderCart()};
renderGrid();renderCart();
