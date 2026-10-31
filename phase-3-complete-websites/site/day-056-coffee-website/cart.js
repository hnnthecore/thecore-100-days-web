(function(){
  const lines=document.querySelector('[data-cart-lines]');
  const empty=document.querySelector('[data-cart-empty]');
  const summary=document.querySelector('.cart-summary');
  document.querySelector('[data-subtotal]').closest('.sum-row').insertAdjacentHTML('afterend','<div class="sum-row" data-discount-row hidden><span>Six-pack saving (15%)</span><strong data-discount></strong></div>');

  function render(){
    const items=BreworaStore.details();
    const totals=BreworaStore.totals();
    empty.hidden=!!items.length;
    summary.hidden=!items.length;
    lines.innerHTML=items.map(item=>`<article class="cart-line">${BreworaUI.can(item,true)}<div><p class="kicker">${item.notes}</p><h2>${item.name}</h2><p>${BreworaStore.money.format(item.price)}</p><div class="qty"><button data-dec="${item.id}" aria-label="Decrease ${item.name}">−</button><span>${item.quantity}</span><button data-inc="${item.id}" aria-label="Increase ${item.name}">+</button></div></div><button class="remove" data-remove="${item.id}" aria-label="Remove ${item.name}">×</button></article>`).join('');
    document.querySelector('[data-subtotal]').textContent=BreworaStore.money.format(totals.subtotal);
    const discountRow=document.querySelector('[data-discount-row]');
    discountRow.hidden=!totals.discount;
    document.querySelector('[data-discount]').textContent=`−${BreworaStore.money.format(totals.discount)}`;
    document.querySelector('[data-delivery]').textContent=totals.delivery?BreworaStore.money.format(totals.delivery):'Free';
    document.querySelector('[data-total]').textContent=BreworaStore.money.format(totals.total);
  }

  window.addEventListener('brewora:cart',render);
  document.querySelector('[data-checkout]').addEventListener('click',()=>{document.querySelector('[data-checkout-note]').textContent='Checkout is a frontend demonstration. No payment or order has been submitted.'});
  render();
})();
