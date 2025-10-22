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
//目录
function md2html(md){
    return (
        md.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
        .replace(/`([^`]+)`/g, '<code>$1</code>')
        .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
        .replace(/^[\s]*- (.+)$/gm, '<li>$1</li>')
        .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
        .replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')
        .split('\n\n').map((block) => (block.startsWith('<') ? block : `<p>${block}</p>`)).join('')
    );
}
const postList=document.getElementById('postlist');
fetch('daily/').then((res)=>res.text()).then((html)=>{
    const files=[...html.matchAll(/href="(.+?\.md)"/g)].map((m=>m[1]))
    files.reverse().forEach((file)=>loadPost(file));
})
.catch((err)=>(postList.innerHTML='加载失败：'+err));
//加载单篇文章
function loadPost(filename){
    fetch('js/posts.json').then((res)=>res.text()).then((text)=>{
        const parts=text.split('---');
        const meta=parts[1]
        const content=parts[2]||'';
        const info={};
        meta.split('\n').forEach((line)=>{
            const[k,v]=line.split(':').map((s)=>s.trim());
            if (k) info[k]=v;
        });
        const li=document.createElement('li');
        li.innerHTML=`<a href="article.html?post=${filename}">${info.title}||你猜标题是什么？？？</a>
                        <time>${info.date||''}</time>`;
        postList.appendChild(li)
    })
}



