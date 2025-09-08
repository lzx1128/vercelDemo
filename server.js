import express from 'express';

const app = express();

// 静态文件托管（比如 CSS、JS、图片）
app.use(express.static('public'));

// API 路由示例
app.get('/api', (req, res) => {
  res.json({ message: 'Hello from Vercel API!' });
});

// 首页路由（返回 HTML）
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Vercel Express Demo</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          text-align: center;
          padding: 50px;
          background: #f0f0f0;
        }
        h1 {
          color: #0070f3;
        }
      </style>
    </head>
    <body>
      <h1>Welcome to Vercel + Express!</h1>
      <p>This is a simple HTML page served by Express.js on Vercel.</p>
      <p>Try the <a href="/api">API endpoint</a>.</p>
    </body>
    </html>
  `);
});

// 必须导出为无服务器函数
export default app;