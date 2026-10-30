const featured=document.querySelector('[data-featured-products]');
if(featured)featured.innerHTML=VELORA_PRODUCTS.slice(0,4).map(VeloraUI.productCard).join('');
const newsletter=document.querySelector('[data-newsletter]');
newsletter?.addEventListener('submit',event=>{event.preventDefault();const input=newsletter.querySelector('input');const status=newsletter.querySelector('[data-newsletter-status]');if(!input.checkValidity()){status.textContent='Please enter a valid email address.';input.focus();return}status.textContent='Your address is valid. Connect an email provider to complete signup.'});
const videos=document.querySelectorAll('video');
if('IntersectionObserver'in window&&!matchMedia('(prefers-reduced-motion: reduce)').matches){const observer=new IntersectionObserver(entries=>entries.forEach(entry=>entry.isIntersecting?entry.target.play().catch(()=>{}):entry.target.pause()),{rootMargin:'20% 0px'});videos.forEach(video=>observer.observe(video))}
