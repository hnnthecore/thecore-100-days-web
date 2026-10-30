(function(){
  const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
  let lenisFrame=0;
  let scrollStateObserver;
  if(window.Lenis&&!reducedMotion.matches){
    const lenis=new Lenis({duration:1.05,smoothWheel:true,wheelMultiplier:.9,syncTouch:false});
    window.veloraLenis=lenis;
    const updateScrollState=()=>document.body.classList.contains('menu-open')||document.body.classList.contains('cart-open')?lenis.stop():lenis.start();
    scrollStateObserver=new MutationObserver(updateScrollState);
    scrollStateObserver.observe(document.body,{attributes:true,attributeFilter:['class']});
    const raf=time=>{lenis.raf(time);lenisFrame=requestAnimationFrame(raf)};
    lenisFrame=requestAnimationFrame(raf);
    document.addEventListener('click',event=>{
      const link=event.target.closest('a[href*="#"]');
      if(!link)return;
      const destination=new URL(link.href,location.href);
      if(destination.pathname!==location.pathname||!destination.hash)return;
      const target=document.querySelector(destination.hash);
      if(!target)return;
      event.preventDefault();
      lenis.scrollTo(target,{offset:-(document.querySelector('[data-site-header]')?.offsetHeight||0)});
      history.pushState(null,'',destination.hash);
    });
    window.addEventListener('pagehide',event=>{
      if(event.persisted)return;
      cancelAnimationFrame(lenisFrame);
      scrollStateObserver.disconnect();
      lenis.destroy();
    },{once:true});
  }
  const current=document.body.dataset.page||'';
  const header=document.querySelector('[data-site-header]');
  const footer=document.querySelector('[data-site-footer]');
  const nav=[['home','index.html','Home'],['shop','shop.html','Shop'],['collections','collections.html','Collections'],['story','story.html','Our story']];
  const mark='<svg class="brand-mark" viewBox="0 0 48 48" aria-hidden="true"><path d="M10 9h28L24 41z"/><path d="M17 9l7 32 7-32"/></svg>';
  const brand=`<a class="brand" href="index.html" aria-label="Velora Chocolat, home">${mark}<span>VELORA<small>CHOCOLAT</small></span></a>`;
  if(header)header.innerHTML=`${brand}<nav class="main-nav" aria-label="Main navigation">${nav.map(([key,url,label])=>`<a href="${url}" ${current===key?'aria-current="page"':''}>${label}</a>`).join('')}</nav><div class="nav-actions"><a class="nav-contact" href="story.html#visit">Visit the atelier</a><button class="cart-trigger" type="button" data-cart-open aria-label="Open shopping bag"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.5 8.5h11l.8 11h-12.6l.8-11Z"/><path d="M9 9V6.8a3 3 0 0 1 6 0V9"/></svg><span>Bag</span><b data-cart-count>0</b></button><button class="menu-toggle" type="button" aria-expanded="false" aria-controls="mobile-menu" aria-label="Open menu"><i></i><i></i></button></div><nav class="mobile-menu" id="mobile-menu" hidden>${nav.map(([key,url,label])=>`<a href="${url}">${label}<span>↗</span></a>`).join('')}<a href="story.html#visit">Visit the atelier<span>↗</span></a></nav>`;
  if(footer)footer.innerHTML=`<div class="footer-lead">${brand}<p>Chocolate with clarity, character and a considered sense of occasion.</p></div><div class="footer-links"><div><h2>Explore</h2><a href="shop.html">All chocolate</a><a href="collections.html">Collections</a><a href="story.html">Our story</a></div><div><h2>Service</h2><a href="cart.html">Shopping bag</a><a href="checkout.html">Checkout</a><a href="mailto:hello@velora.example">Private enquiries</a></div><div><h2>Follow</h2><a href="https://www.instagram.com/" target="_blank" rel="noreferrer">Instagram ↗</a><a href="https://www.pinterest.com/" target="_blank" rel="noreferrer">Pinterest ↗</a></div></div><div class="footer-meta"><span>© 2026 Velora Chocolat</span><span>Frontend concept · sample products and pricing</span></div>`;
  document.body.insertAdjacentHTML('beforeend',`<div class="cart-scrim" data-cart-scrim hidden></div><aside class="cart-drawer" data-cart-drawer aria-hidden="true" aria-labelledby="cart-title" inert><header><div><p class="eyebrow">Your selection</p><h2 id="cart-title">Shopping bag</h2></div><button type="button" data-cart-close aria-label="Close shopping bag">×</button></header><div class="drawer-items" data-drawer-items></div><div class="drawer-empty" data-drawer-empty><p>Your bag is waiting.</p><a href="shop.html">Explore chocolate</a></div><footer><div><span>Subtotal</span><strong data-drawer-subtotal>₹0</strong></div><p>Delivery is calculated at checkout.</p><a class="button button-gold" href="checkout.html">Checkout <span>→</span></a><a class="drawer-cart-link" href="cart.html">View full bag</a></footer></aside><div class="toast" data-toast role="status" aria-live="polite"></div>`);
  const menu=document.querySelector('.mobile-menu');const toggle=document.querySelector('.menu-toggle');
  toggle?.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')!=='true';toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'Close menu':'Open menu');menu.hidden=!open;document.body.classList.toggle('menu-open',open)});
  const drawer=document.querySelector('[data-cart-drawer]');const scrim=document.querySelector('[data-cart-scrim]');let lastFocus;
  function openCart(open){lastFocus=document.activeElement;drawer.classList.toggle('open',open);drawer.setAttribute('aria-hidden',String(!open));drawer.inert=!open;scrim.hidden=!open;document.body.classList.toggle('cart-open',open);if(open)drawer.querySelector('[data-cart-close]').focus();else lastFocus?.focus?.()}
  document.querySelectorAll('[data-cart-open]').forEach(button=>button.addEventListener('click',()=>openCart(true)));document.querySelector('[data-cart-close]')?.addEventListener('click',()=>openCart(false));scrim.addEventListener('click',()=>openCart(false));
  document.addEventListener('keydown',event=>{if(event.key==='Escape'){openCart(false);if(!menu.hidden){toggle.click()}}});
  const drawerItems=document.querySelector('[data-drawer-items]');
  function renderCart(){const items=VeloraStore.detailed();const totals=VeloraStore.totals();document.querySelectorAll('[data-cart-count]').forEach(el=>el.textContent=totals.count);drawer.classList.toggle('empty',!items.length);document.querySelector('[data-drawer-subtotal]').textContent=VeloraStore.money.format(totals.subtotal);drawerItems.innerHTML=items.map(item=>`<article class="drawer-item"><img src="${item.image}" alt=""><div><h3>${item.name}</h3><p>${VeloraStore.money.format(item.price)}</p><div class="quantity"><button data-minus="${item.id}" aria-label="Decrease ${item.name}">−</button><span>${item.quantity}</span><button data-plus="${item.id}" aria-label="Increase ${item.name}">+</button></div></div><button class="remove" data-remove="${item.id}" aria-label="Remove ${item.name}">×</button></article>`).join('')}
  drawerItems.addEventListener('click',event=>{const button=event.target.closest('button');if(!button)return;if(button.dataset.minus)VeloraStore.setQuantity(button.dataset.minus,VeloraStore.getCart().find(i=>i.id===button.dataset.minus).quantity-1);if(button.dataset.plus)VeloraStore.setQuantity(button.dataset.plus,VeloraStore.getCart().find(i=>i.id===button.dataset.plus).quantity+1);if(button.dataset.remove)VeloraStore.remove(button.dataset.remove)});
  let toastTimer;window.veloraToast=(message)=>{const toast=document.querySelector('[data-toast]');toast.textContent=message;toast.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove('show'),2400)};
  window.veloraAdd=(id,quantity=1,open=false)=>{VeloraStore.add(id,quantity);window.veloraToast(`${VeloraStore.getProduct(id).name} added to your bag`);if(open)openCart(true)};
  window.VeloraUI={productCard:(product)=>`<article class="product-card" data-product-card="${product.id}"><a class="product-photo" href="product.html?id=${product.id}"><img src="${product.image}" alt="${product.name}" width="900" height="1125" loading="lazy"><span>${product.badge}</span></a><div class="product-meta"><p>${product.type} · ${product.weight}</p><h3><a href="product.html?id=${product.id}">${product.name}</a></h3><div><strong>${VeloraStore.money.format(product.price)}</strong><button type="button" data-card-add="${product.id}" aria-label="Add ${product.name} to bag">Add <b>+</b></button></div></div></article>`};
  document.addEventListener('click',event=>{const button=event.target.closest('[data-card-add]');if(button)window.veloraAdd(button.dataset.cardAdd)});
  window.addEventListener('velora:cart',renderCart);renderCart();
  const revealItems=document.querySelectorAll('[data-reveal]');if(matchMedia('(prefers-reduced-motion: reduce)').matches||!('IntersectionObserver'in window))revealItems.forEach(el=>el.classList.add('revealed'));else{const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('revealed');observer.unobserve(entry.target)}}),{threshold:.12});revealItems.forEach(el=>observer.observe(el))}
})();
