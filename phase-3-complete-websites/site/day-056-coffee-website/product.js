(function(){
  const id=new URLSearchParams(location.search).get('id')||'vanilla-bean';
  const product=BreworaStore.product(id)||BREWORA_PRODUCTS[0];
  document.title=`${product.name} · BREWORA`;
  const visual=document.querySelector('[data-product-visual]');
  visual.style.setProperty('--product-surface',product.tone);
  visual.innerHTML=BreworaUI.gallery(product);
  const mainImage=visual.querySelector('[data-gallery-main]');
  visual.addEventListener('click',event=>{
    const thumbnail=event.target.closest('[data-gallery-thumb]');
    if(!thumbnail)return;
    mainImage.src=thumbnail.dataset.src;
    mainImage.alt=thumbnail.dataset.alt;
    visual.querySelectorAll('[data-gallery-thumb]').forEach(button=>{
      const active=button===thumbnail;
      button.classList.toggle('is-active',active);
      button.setAttribute('aria-pressed',String(active));
    });
  });
  document.querySelector('[data-product-badge]').textContent=product.badge;
  document.querySelector('[data-product-name]').textContent=product.name;
  document.querySelector('[data-product-notes]').textContent=product.notes;
  document.querySelector('[data-product-description]').textContent=product.description;
  document.querySelector('[data-product-price]').textContent=BreworaStore.money.format(product.price);
  let quantity=1;
  const out=document.querySelector('[data-qty]');
  document.querySelector('[data-qty-minus]').addEventListener('click',()=>{quantity=Math.max(1,quantity-1);out.textContent=quantity});
  document.querySelector('[data-qty-plus]').addEventListener('click',()=>{quantity++;out.textContent=quantity});
  document.querySelector('[data-product-add]').addEventListener('click',()=>{BreworaStore.add(product.id,quantity);breworaToast(`${quantity} × ${product.name} added to cart`)});
  document.querySelector('[data-buy-now]').addEventListener('click',()=>{BreworaStore.add(product.id,quantity);location.href='cart.html'});
})();
