(()=>{
const PHONE='+234 901 467 9963';
const IG='@storebybenni.ng';
const CONTACT={address:'',phone:PHONE,tiktok:'',facebook:'',instagram:IG};
window.BENNI_CONTACT=CONTACT;
window.BENNI_VARIANTS=window.BENNI_VARIANTS||{};

function injectContact(){
 const footer=document.querySelector('footer'); if(!footer||document.getElementById('contact')) return;
 const s=document.createElement('section'); s.id='contact'; s.className='section contact-section';
 s.innerHTML=`<div class="sectionhead"><div><div class="eyebrow">CONTACT STORE BY BENNI</div><h2>We’re here to help.</h2></div><p>Visit us, call us, or connect with us on social media. We’ll be happy to help with products, colours, availability and orders.</p></div><div class="contact-grid"><div class="contact-card"><span>⌖</span><h3>Physical Store</h3><p>${CONTACT.address||'Store address will be added here.'}</p></div><div class="contact-card"><span>☎</span><h3>Phone / WhatsApp</h3><p><a href="https://wa.me/2349014679963" target="_blank">${CONTACT.phone}</a></p></div><div class="contact-card"><span>◎</span><h3>Instagram</h3><p><a href="https://instagram.com/storebybenni.ng" target="_blank">${CONTACT.instagram}</a></p></div><div class="contact-card"><span>♪</span><h3>TikTok</h3><p>${CONTACT.tiktok||'Handle will be added here.'}</p></div><div class="contact-card"><span>f</span><h3>Facebook</h3><p>${CONTACT.facebook||'Handle will be added here.'}</p></div></div>`;
 footer.parentNode.insertBefore(s,footer);
}

function setupSliders(){
 document.querySelectorAll('.photo').forEach(btn=>{
  if(btn.dataset.sliderReady)return;
  const img=btn.querySelector('img'); if(!img)return;
  const card=btn.closest('.card'); const name=card?.querySelector('h3')?.textContent||'';
  const p=PRODUCTS.find(x=>x.name===name); if(!p)return;
  const images=(window.BENNI_VARIANTS[p.id]&&window.BENNI_VARIANTS[p.id].length)?window.BENNI_VARIANTS[p.id]:[p.image];
  if(images.length<2)return;
  btn.dataset.sliderReady='1';
  let i=0;
  const dots=document.createElement('div'); dots.className='variant-dots';
  images.forEach((src,n)=>{const d=document.createElement('button');d.type='button';d.className='variant-dot'+(n===0?' active':'');d.setAttribute('aria-label','View colour '+(n+1));d.onclick=e=>{e.stopPropagation();i=n;img.src=images[i];dots.querySelectorAll('button').forEach(x=>x.classList.remove('active'));d.classList.add('active')};dots.appendChild(d)});
  btn.appendChild(dots);
  let sx=0;
  btn.addEventListener('touchstart',e=>{sx=e.touches[0].clientX},{passive:true});
  btn.addEventListener('touchend',e=>{const dx=e.changedTouches[0].clientX-sx;if(Math.abs(dx)<35)return;i=(i+(dx<0?1:-1)+images.length)%images.length;img.src=images[i];dots.querySelectorAll('button').forEach((x,n)=>x.classList.toggle('active',n===i))},{passive:true});
 }
}

const oldRender=window.render;
window.render=function(){oldRender();requestAnimationFrame(setupSliders)};
const oldOpenProduct=window.openProduct;
window.openProduct=function(id){oldOpenProduct(id);const p=PRODUCTS.find(x=>x.id===id);const images=(window.BENNI_VARIANTS[p.id]&&window.BENNI_VARIANTS[p.id].length)?window.BENNI_VARIANTS[p.id]:[p.image];if(images.length>1){const box=document.querySelector('#productDetail .detail img');if(box){let i=0;box.style.touchAction='pan-y';let sx=0;box.addEventListener('touchstart',e=>sx=e.touches[0].clientX,{passive:true});box.addEventListener('touchend',e=>{const dx=e.changedTouches[0].clientX-sx;if(Math.abs(dx)<35)return;i=(i+(dx<0?1:-1)+images.length)%images.length;box.src=images[i]},{passive:true});}}};

const css=document.createElement('style');css.textContent=`.contact-section{padding-top:68px}.contact-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:14px}.contact-card{background:var(--cream);border:1px solid var(--line);border-radius:18px;padding:20px}.contact-card span{font-size:22px;color:var(--gold)}.contact-card h3{font:700 17px Georgia,serif;margin:10px 0 6px}.contact-card p{margin:0;color:var(--muted);font-size:12px;line-height:1.6}.contact-card a{color:inherit}.variant-dots{position:absolute;left:50%;bottom:10px;transform:translateX(-50%);display:flex;gap:5px;padding:5px 7px;border-radius:999px;background:rgba(255,255,255,.82);z-index:3}.variant-dot{width:7px;height:7px;padding:0;border:1px solid #b9a28a;border-radius:50%;background:#fff}.variant-dot.active{background:var(--gold)}@media(max-width:900px){.contact-grid{grid-template-columns:repeat(2,1fr)}}@media(max-width:560px){.contact-grid{grid-template-columns:1fr 1fr}.contact-card{padding:15px}.contact-card h3{font-size:14px}.contact-card p{font-size:11px}}`;
document.head.appendChild(css);

window.addEventListener('load',()=>{injectContact();requestAnimationFrame(setupSliders)});
})();
