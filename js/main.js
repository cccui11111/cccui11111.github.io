/* ================= 基础功能：暗黑模式 + 阅读进度条 ================= */
const btn = document.getElementById('themeBtn');   // 主题按钮
const html = document.documentElement;             // <html> 元素
const bar = document.getElementById('progressBar');// 进度条容器

/* 页面加载时先读本地存储 */
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') html.classList.add('dark');

/* 点击按钮切换主题 */
btn.addEventListener('click', () => {
  html.classList.toggle('dark');
  const isDark = html.classList.contains('dark');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

/* 滚动时更新阅读进度 */
window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const percent = Math.min((scrollTop / docHeight) * 100, 100);
  bar.style.width = percent + '%';
});

/* ================= Day4：Markdown → HTML 解析器 ================= */
function md2html(md) {
  return (
    md
      // 代码块 ```...``` → <pre><code>
      .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
      // 行内代码 `...` → <code>
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      // 粗体 **...** → <strong>
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      // 列表 - ... → <li> 再包 <ul>
      .replace(/^[\s]*- (.+)$/gm, '<li>$1</li>')
      .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
      // 引用 > ... → <blockquote>
      .replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')
      // 分段：连续换行 → <p>
      .split('\n\n')
      .map((block) => (block.startsWith('<') ? block : `<p>${block}</p>`))
      .join('')
  );
}

/* ================= Day4：首页自动扫描 daily/ 目录 ================= */
const postList = document.getElementById('postList'); // 列表容器
if (postList) {
  // 1. 请求目录索引（GitHub Pages 会返回一个 HTML 列表）
  fetch('daily/')
    .then((res) => res.text())
    .then((html) => {
      // 用正则把所有 *.md 链接抓出来
      const files = [...html.matchAll(/href="(.+?\.md)"/g)].map((m) => m[1]);
      // 按时间倒序（这里简单用文件名排序，后期可改）
      files.reverse().forEach((file) => loadPost(file));
    })
    .catch((err) => (postList.innerHTML = '加载失败：' + err));
}

/* 2. 加载单篇文章并生成列表卡片 */
function loadPost(filename) {
  fetch('daily/' + filename)
    .then((res) => res.text())
    .then((text) => {
      // 拆 front-matter 和正文
      const parts = text.split('---');
      const meta = parts[1],
        content = parts[2] || '';
      const info = {};
      // 逐行解析 "key: value"
      meta.split('\n').forEach((line) => {
        const [k, v] = line.split(':').map((s) => s.trim());
        if (k) info[k] = v;
      });
      // 生成列表项
      const li = document.createElement('li');
      li.innerHTML = `
        <a href="article.html?post=${filename}">${info.title || '无题'}</a>
        <time>${info.date || ''}</time>
      `;
      postList.appendChild(li);
    });
}
