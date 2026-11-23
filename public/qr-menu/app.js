'use strict';
const data = window.MENU_DATA || {items:[],barDocuments:[]};
const items = data.items;
const byId = new Map(items.map(item=>[item.id,item]));
const $ = id => document.getElementById(id);
const esc = value => String(value ?? '').replace(/[&<>"']/g, char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const money = value => new Intl.NumberFormat('ru-RU').format(value)+' ₽';
const norm = value => String(value||'').toLocaleLowerCase('ru').replace(/ё/g,'е');
let selected = {};
try { const saved=JSON.parse(localStorage.getItem('smokedog-choice-v1')||'{}'); for(const [id,n] of Object.entries(saved)) if(byId.has(id)&&Number.isInteger(n)&&n>0&&n<=99) selected[id]=n; } catch {}
let activeTab='food', activeCategory='Все', query='', dishId=null;
const categoryOf = item => item.subcategory || item.category;
const typeOf = item => item.category==='Кальян'?'hookah':item.category==='Бар'?'bar':'food';
function persist(){try{localStorage.setItem('smokedog-choice-v1',JSON.stringify(selected));}catch{}}
function toast(message){$('toast').textContent=message;$('toast').classList.add('visible');clearTimeout(toast.timer);toast.timer=setTimeout(()=>$('toast').classList.remove('visible'),1600);}
function change(id,delta){if(!byId.has(id))return;selected[id]=Math.max(0,Math.min(99,(selected[id]||0)+delta));if(!selected[id])delete selected[id];persist();updateSelection();if($('selection-dialog').open)renderSelection();if($('dish-dialog').open&&dishId===id)updateDishButton();if(delta>0)toast('Добавлено в ваш выбор');}
function updateSelection(){let count=0,total=0;for(const[id,n]of Object.entries(selected)){count+=n;total+=byId.get(id).priceValue*n;}document.querySelectorAll('.count').forEach(node=>node.textContent=count);$('selection-total').textContent=money(total);$('selection-bar').hidden=!count;document.querySelectorAll('[data-add]').forEach(button=>{const n=selected[button.dataset.add]||0;button.textContent=n||'+';button.classList.toggle('selected',!!n);button.setAttribute('aria-label',`Добавить ${byId.get(button.dataset.add).name}${n?`, выбрано ${n}`:''}`);});}
function renderCategories(){const categories=['Все',...new Set(items.filter(item=>typeOf(item)===activeTab).map(item=>categoryOf(item)))];$('categories').innerHTML=categories.map(category=>`<button data-category="${esc(category)}" class="${activeCategory===category?'active':''}" aria-pressed="${activeCategory===category}">${esc(category==='Все'?(activeTab==='food'?'Все блюда':activeTab==='bar'?'Все напитки':'Все варианты'):category)}</button>`).join('');$('categories').hidden=activeTab==='hookah';}
function render(){renderCategories();$('menu-grid').classList.toggle('drinks',activeTab==='bar'&&!query);const found=items.filter(item=>query?norm(item.name+' '+categoryOf(item)+' '+item.description).includes(norm(query)):typeOf(item)===activeTab&&(activeCategory==='Все'||categoryOf(item)===activeCategory));$('section-title').textContent=query?'Результаты поиска':activeCategory!=='Все'?activeCategory:activeTab==='food'?'Все блюда':activeTab==='bar'?'Бар':'Кальян';$('results-count').textContent=`${found.length} ${found.length%10===1&&found.length%100!==11?'позиция':found.length%10>=2&&found.length%10<=4&&(found.length%100<12||found.length%100>14)?'позиции':'позиций'}`;$('clear-search').hidden=!query;$('menu-grid').innerHTML=found.length?found.map(item=>`<article class="card ${item.image?'has-photo':''}"><button class="card-photo" data-dish="${esc(item.id)}" aria-label="Подробнее: ${esc(item.name)}">${item.image?`<img src="${esc(item.image)}" alt="${esc(item.name)}" loading="lazy" decoding="async">`:'<span class="no-photo" aria-hidden="true">SD</span>'}<span class="category-badge">${esc(categoryOf(item))}</span></button><div class="card-body"><button class="card-title" data-dish="${esc(item.id)}">${esc(item.name)}</button><span class="card-weight">${esc(item.weight||'')}</span><div class="card-bottom"><span class="price">${esc(item.price)}</span><button class="add" data-add="${esc(item.id)}" aria-label="Добавить ${esc(item.name)}">+</button></div></div></article>`).join(''):'<div class="empty"><h3>Пока ничего не нашлось</h3><p>Попробуйте другое название или откройте всё меню.</p><button id="reset-filter">Показать всё меню</button></div>';
 const docs=!query?(data.barDocuments||[]).filter(doc=>activeTab==='hookah'?doc.title.includes('Кальян'):activeTab==='bar'?!doc.title.includes('Кальян'):false):[];$('documents').innerHTML=docs.map(doc=>`<a class="document" href="${esc(doc.localUrl||doc.url||doc.href)}" target="_blank" rel="noopener"><div>${esc(doc.name||doc.title)}<small>Открыть · PDF${doc.sizeMB?' · '+doc.sizeMB+' МБ':''}</small></div><span>↗</span></a>`).join('');updateSelection();}
function updateDishButton(){const item=byId.get(dishId);if(!item)return;const n=selected[dishId]||0;$('dish-add').textContent=n?`Добавить ещё · в выборе ${n}`:'Добавить в мой выбор';}
function openDish(id){const item=byId.get(id);if(!item)return;dishId=id;$('dish-content').innerHTML=`${item.image?`<img class="dish-image" src="${esc(item.image)}" alt="${esc(item.name)}">`:''}<div class="dish-details"><p class="eyebrow">${esc(categoryOf(item))}</p><h2 id="dish-title">${esc(item.name)}</h2>${item.weight?`<p>${esc(item.weight)}</p>`:''}${item.description?`<p>${esc(item.description)}</p>`:''}<div class="card-bottom"><strong class="price">${esc(item.price)}</strong><button class="dish-add" id="dish-add" data-add-detail="${esc(item.id)}">Добавить в мой выбор</button></div></div>`;updateDishButton();$('dish-dialog').showModal();}
function renderSelection(){const chosen=Object.entries(selected);$('selection-items').innerHTML=chosen.length?chosen.map(([id,n])=>{const item=byId.get(id);return `<div class="selection-row"><div><h3>${esc(item.name)}</h3><small class="chosen-weight">${esc(item.weight||'')}</small><p>${money(item.priceValue*n)}</p></div><div class="quantity"><button data-minus="${esc(id)}" aria-label="Убрать одну порцию: ${esc(item.name)}">−</button><span aria-label="Количество">${n}</span><button data-plus="${esc(id)}" aria-label="Добавить одну порцию: ${esc(item.name)}">+</button></div></div>`;}).join(''):'<div class="empty"><h3>Выбор за вами</h3><p>Добавляйте блюда кнопкой «+».<br>Они появятся здесь.</p><button id="back-menu">Перейти к меню</button></div>';$('selection-summary').innerHTML=chosen.length?`<div class="summary"><span>Предварительно</span><strong>${money(chosen.reduce((sum,[id,n])=>sum+byId.get(id).priceValue*n,0))}</strong></div><p class="summary-note">Это список выбранных позиций. Для заказа обратитесь к официанту. Стоимость весовых блюд рассчитывается по фактическому весу.</p>`:'';}
function openSelection(){renderSelection();$('selection-dialog').showModal();}
document.addEventListener('click',event=>{const button=event.target.closest('button');if(!button)return;if(button.dataset.tab){activeTab=button.dataset.tab;activeCategory='Все';query='';$('search').value='';document.querySelectorAll('[data-tab]').forEach(tab=>{tab.classList.toggle('active',tab===button);tab.setAttribute('aria-pressed',tab===button);});render();}else if(button.dataset.category){activeCategory=button.dataset.category;query='';$('search').value='';render();}else if(button.dataset.dish)openDish(button.dataset.dish);else if(button.dataset.add)change(button.dataset.add,1);else if(button.dataset.addDetail)change(button.dataset.addDetail,1);else if(button.dataset.plus)change(button.dataset.plus,1);else if(button.dataset.minus)change(button.dataset.minus,-1);else if(button.classList.contains('dialog-close'))button.closest('dialog').close();else if(button.id==='selection-top'||button.id==='selection-bar')openSelection();else if(button.id==='reset-filter'){query='';activeCategory='Все';$('search').value='';render();}else if(button.id==='back-menu'){$('selection-dialog').close();$('menu').scrollIntoView();}else if(button.id==='clear-search'){query='';$('search').value='';render();$('search').focus();}});
$('search').addEventListener('input',event=>{query=event.target.value.trim();render();});
document.querySelectorAll('dialog').forEach(dialog=>{dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});});
render();

async function showVerifiedTable() {
  const token = new URLSearchParams(location.search).get('table');
  if (!token || !/^[A-Za-z0-9_-]{32,128}$/.test(token)) return;

  const search = new URLSearchParams({ table: token });
  try {
    const response = await fetch(`/api/qr-menu/config?${search}`, { cache: 'no-store', referrerPolicy: 'no-referrer' });
    if (!response.ok) return;
    const config = await response.json();
    const label = config.table?.label;
    if (typeof label !== 'string' || !label) return;

    document.querySelector('.menu-heading .eyebrow').textContent = label;
    document.querySelector('#selection-dialog .eyebrow').textContent = label;
  } catch {
    // The guest can still browse the menu and show their selection to a waiter.
  }
}

showVerifiedTable();
