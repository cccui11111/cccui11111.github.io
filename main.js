const btn=document.getElementById("themeBtn");
const html=document.documentElement;
const savedTheme=localStorage.getItem('theme');
if(savedTheme==='dark'){
    html.classList.add('dark');
}
btn.addEventListener('click',()=>{html.classList.toggle('dark');
const isDark=html.classList.contains('dark');
localStorage.setItem('theme',isDark?'dark':'light');});

const bar=document.getElementById('progressBar');
window.addEventListener('scroll',()=>{
    const scrollTop=window.scrollY;
    const docHeight=document.documentElement.scrollHeight-window.innerHeight;
    const percent=Math.min((scrollTop/docHeight)*100,100);
    bar.style.width=percent+'%';
    
});