(function(){
  const KEY='brewora-cart-v1';
  const money=new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:0});
  const product=id=>window.BREWORA_PRODUCTS.find(item=>item.id===id);
  const read=()=>{try{const value=JSON.parse(localStorage.getItem(KEY));return Array.isArray(value)?value.filter(item=>product(item.id)&&item.quantity>0):[]}catch{return[]}};
  const save=cart=>{localStorage.setItem(KEY,JSON.stringify(cart));window.dispatchEvent(new CustomEvent('brewora:cart'));return cart};
  const add=(id,quantity=1)=>{const cart=read();const line=cart.find(item=>item.id===id);if(line)line.quantity+=quantity;else cart.push({id,quantity});return save(cart)};
  const set=(id,quantity)=>quantity<=0?remove(id):save(read().map(item=>item.id===id?{...item,quantity}:item));
  const remove=id=>save(read().filter(item=>item.id!==id));
  const details=()=>read().map(item=>({...product(item.id),quantity:item.quantity,lineTotal:product(item.id).price*item.quantity}));
  const totals=()=>{const subtotal=details().reduce((sum,item)=>sum+item.lineTotal,0);const count=read().reduce((sum,item)=>sum+item.quantity,0);const discount=count>=6?Math.round(subtotal*.15):0;const delivery=subtotal===0||subtotal>=5000?0:250;return{subtotal,discount,delivery,total:subtotal-discount+delivery,count}};
  window.BreworaStore={money,product,read,add,set,remove,details,totals,clear:()=>save([])};
})();
