(function () {
  const CART_KEY = 'velora-cart-v2';
  const ORDER_KEY = 'velora-last-order-v1';
  const money = new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:0});
  const getProduct = (id) => window.VELORA_PRODUCTS.find((product) => product.id === id);
  function read(key,fallback){try{const value=JSON.parse(localStorage.getItem(key));return value ?? fallback}catch{return fallback}}
  function getCart(){const cart=read(CART_KEY,[]);return Array.isArray(cart)?cart.filter(item=>getProduct(item.id)&&item.quantity>0):[]}
  function saveCart(cart){localStorage.setItem(CART_KEY,JSON.stringify(cart));window.dispatchEvent(new CustomEvent('velora:cart',{detail:{cart}}));return cart}
  function add(id,quantity=1){const cart=getCart();const item=cart.find(entry=>entry.id===id);if(item)item.quantity+=quantity;else cart.push({id,quantity});return saveCart(cart)}
  function setQuantity(id,quantity){const cart=getCart();const item=cart.find(entry=>entry.id===id);if(!item)return cart;if(quantity<=0)return remove(id);item.quantity=quantity;return saveCart(cart)}
  function remove(id){return saveCart(getCart().filter(item=>item.id!==id))}
  function clear(){return saveCart([])}
  function detailed(){return getCart().map(item=>({...getProduct(item.id),quantity:item.quantity,lineTotal:getProduct(item.id).price*item.quantity}))}
  function totals(){const subtotal=detailed().reduce((sum,item)=>sum+item.lineTotal,0);const delivery=subtotal===0||subtotal>=4000?0:250;return{subtotal,delivery,total:subtotal+delivery,count:getCart().reduce((sum,item)=>sum+item.quantity,0)}}
  function saveOrder(order){localStorage.setItem(ORDER_KEY,JSON.stringify(order))}
  function getOrder(){return read(ORDER_KEY,null)}
  window.VeloraStore={money,getProduct,getCart,add,setQuantity,remove,clear,detailed,totals,saveOrder,getOrder};
})();
