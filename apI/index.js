import express from 'express';

const app = express();

// 示例路由
app.get('/api', (req, res) => {
  res.send('Hello from Vercel Node.js!');
});

// 必须导出为无服务器函数
export default app;