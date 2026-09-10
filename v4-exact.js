(()=>{
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
function init(){
 const hero=$('.hero'), shop=$('#shop'), grid=$('#grid'); if(!hero||!shop||!grid)return;
 setupNavigation();
 hero.querySelector('.eyebrow').textContent='WELCOME TO';
 hero.querySelector('h1').innerHTML='STORE BY <span>BENNI</span>';
 hero.querySelector('p').textContent='Timeless style. Premium quality. Just for you.';
 const acts=hero.querySelector('.actions'); acts.innerHTML='<a class="btn primary" href="#shop">SHOP NOW ›</a><a class="btn secondary" href="#shop">NEW ARRIVALS</a>';
 hero.querySelector('.heroart img').alt='Store by Benni featured bag';
 hero.insertAdjacentHTML('afterend',`<div class="v4-trust"><div>♢<b>100% ORIGINAL</b><span>Authentic Products</span></div><div>▱<b>FAST DELIVERY</b><span>Across Nigeria</span></div><div>♧<b>CUSTOMER CARE</b><span>We're here to help</span></div><div>♧<b>SECURE PAYMENT</b><span>Pay with confidence</span></div></div><div class="v4-title"><h2>SHOP BY CATEGORY</h2><a href="#shop">View all ›</a></div><div class="v4-cats"><a class="v4-cat" href="#shop" onclick="setCategory('Bags',document.querySelectorAll('.chip')[1])"><img src="assets/polene.jpg"><div><b>BAGS</b><span>Explore Collection</span></div></a><a class="v4-cat" href="#shop" onclick="setCategory('Shoes',document.querySelectorAll('.chip')[2])"><img src="assets/zara.jpg"><div><b>SHOES</b><span>Explore Collection</span></div></a></div><div class="v4-title v4-feature-title"><h2>FEATURED PRODUCTS</h2><a href="#shop">View all ›</a></div>`);
 const wrap=document.createElement('div');wrap.className='v4-product-wrap';grid.parentNode.insertBefore(wrap,grid);wrap.appendChild(grid);wrap.insertAdjacentHTML('afterbegin','<button class="v4-arrow left" aria-label="Previous products">‹</button>');wrap.insertAdjacentHTML('beforeend','<button class="v4-arrow right" aria-label="Next products">›</button>');
 $('.v4-arrow.left',wrap).onclick=()=>grid.scrollBy({left:-grid.clientWidth*.82,behavior:'smooth'});$('.v4-arrow.right',wrap).onclick=()=>grid.scrollBy({left:grid.clientWidth*.82,behavior:'smooth'});
 const dots=document.createElement('div');dots.className='v4-dots';dots.innerHTML='<i class="active"></i><i></i><i></i>';hero.appendChild(dots);
 const bottom=document.createElement('nav');bottom.className='v4-bottom';bottom.innerHTML='<a href="#top"><i>⌂</i>Home</a><a href="#shop"><i>⊞</i>Categories</a><a href="#shop"><i>♡</i>Wishlist</a><a href="#shop" onclick="openCart()"><i>🛒</i>Cart</a><a href="#why"><i>♙</i>Account</a>';document.body.appendChild(bottom);
 window.BENNI_VARIANTS=window.BENNI_VARIANTS||{};
 const obs=new MutationObserver(()=>enhanceCards());obs.observe(grid,{childList:true}); enhanceCards();
 function enhanceCards(){ $$('.card',grid).forEach(card=>{if(card.dataset.v4)return;card.dataset.v4='1';const img=$('.photo img',card);if(!img)return;const id=(img.src.split('/').pop()||'').split('.')[0];const variants=window.BENNI_VARIANTS[id]||[{src:img.getAttribute('src'),label:'Default',filter:'none'}];if(variants.length<2)return;let idx=0;const apply=v=>{img.src=v.src||v;img.style.filter=v.filter||'none';};const photo=$('.photo',card);const dots=document.createElement('div');dots.className='v4-color-dots';variants.forEach((v,i)=>{const b=document.createElement('button');b.setAttribute('aria-label',v.label||('Colour '+(i+1)));b.title=v.label||('Colour '+(i+1));b.style.cssText='width:10px;height:10px;border-radius:50%;border:1px solid #aaa;background:#'+['111','7b1e2b','d8c3a0','eee','8b5a2b'][i%5]+';padding:0;margin:0 3px';b.onclick=e=>{e.stopPropagation();idx=i;apply(v)};dots.appendChild(b)});apply(variants[0]);photo.parentNode.insertBefore(dots,photo.nextSibling)});}
}
function setupNavigation(){
 const nav=$('.nav'), header=$('.navin'), search=$('#search'), tools=$('.tools');
 header.insertAdjacentHTML('afterbegin','<button type="button" class="v4-icon v4-menu-button" aria-label="Open menu" aria-expanded="false" aria-controls="store-menu"><span aria-hidden="true">☰</span></button>');
 header.insertAdjacentHTML('beforeend','<button type="button" class="v4-icon v4-search-button" aria-label="Open search" aria-expanded="false" aria-controls="store-search"><span aria-hidden="true">⌕</span></button>');
 nav.insertAdjacentHTML('beforeend','<div id="store-menu" class="v4-menu" hidden><a href="#shop">Shop</a><a href="#why">Why Benni</a><a href="#contact">Contact</a></div>');
 const menu=$('#store-menu'), menuButton=$('.v4-menu-button'), searchButton=$('.v4-search-button');
 tools.id='store-search'; tools.hidden=true;
 tools.insertAdjacentHTML('beforeend','<p id="search-status" role="status" aria-live="polite"></p>');
 search.setAttribute('aria-controls','grid');
 function closeMenu(restore=false){menu.hidden=true;menuButton.setAttribute('aria-expanded','false');menuButton.setAttribute('aria-label','Open menu');if(restore)menuButton.focus()}
 function closeSearch(){tools.hidden=true;tools.classList.remove('v4-search-open');searchButton.setAttribute('aria-expanded','false');searchButton.setAttribute('aria-label','Open search');search.value='';render();searchButton.focus()}
 menuButton.addEventListener('click',()=>{const open=menu.hidden;closeMenu();if(open){menu.hidden=false;menuButton.setAttribute('aria-expanded','true');menuButton.setAttribute('aria-label','Close menu');$('a',menu).focus()}});
 menu.addEventListener('click',e=>{const link=e.target.closest('a');if(!link)return;closeMenu();const target=$(link.hash);if(target){target.tabIndex=-1;target.focus({preventScroll:true})}});
 nav.addEventListener('focusout',e=>{if(!nav.contains(e.relatedTarget))closeMenu()});
 document.addEventListener('pointerdown',e=>{if(!nav.contains(e.target))closeMenu()});
 document.addEventListener('keydown',e=>{if(e.key!=='Escape')return;if(!menu.hidden){e.preventDefault();closeMenu(true)}else if(!tools.hidden){e.preventDefault();closeSearch()}});
 searchButton.addEventListener('click',()=>{closeMenu();if(!tools.hidden)return closeSearch();tools.hidden=false;tools.classList.add('v4-search-open');searchButton.setAttribute('aria-expanded','true');searchButton.setAttribute('aria-label','Close search');category='All';$$('.chip').forEach(b=>b.classList.toggle('active',b.textContent==='All'));render();search.focus();});
 const originalRender=window.render;
 window.render=function(){originalRender();grid.scrollLeft=0;const count=$$('.card',grid).length;$('#search-status').textContent=count+' product'+(count===1?'':'s')+' found';};
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
