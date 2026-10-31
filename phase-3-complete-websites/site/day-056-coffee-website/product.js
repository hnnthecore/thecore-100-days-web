(function(){
  const id=new URLSearchParams(location.search).get('id')||'vanilla-bean';
  const product=BreworaStore.product(id)||BREWORA_PRODUCTS[0];
  document.title=`${product.name} · BREWORA`;
  document.querySelector('[data-product-visual]').innerHTML=BreworaUI.photo(product,true);
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
