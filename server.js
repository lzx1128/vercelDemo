import express from 'express';
import cors from 'cors';

const app = express();

// 启用 CORS 和 JSON 解析
app.use(cors());
app.use(express.json());

// 静态文件托管
app.use(express.static('public'));

// 模拟数据库
let todos = [
  { id: 1, text: 'Learn Vercel deployment', completed: false },
  { id: 2, text: 'Build a REST API', completed: true },
  { id: 3, text: 'Design a beautiful UI', completed: false }
];

// API 路由
app.get('/api/todos', (req, res) => {
  res.json(todos);
});

app.post('/api/todos', (req, res) => {
  const newTodo = {
    id: todos.length + 1,
    text: req.body.text,
    completed: false
  };
  todos.push(newTodo);
  res.status(201).json(newTodo);
});

app.delete('/api/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  todos = todos.filter(todo => todo.id !== id);
  res.status(204).send();
});

// 美观的首页
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Vercel Express API</title>
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap" rel="stylesheet">
      <style>
        :root {
          --primary: #4361ee;
          --secondary: #3f37c9;
          --light: #f8f9fa;
          --dark: #212529;
          --success: #4cc9f0;
        }
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Poppins', sans-serif;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          min-height: 100vh;
          padding: 2rem;
          color: var(--dark);
        }
        
        .container {
          max-width: 1200px;
          margin: 0 auto;
          background: rgba(255, 255, 255, 0.9);
          border-radius: 16px;
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
          backdrop-filter: blur(5px);
          padding: 2rem;
        }
        
        header {
          text-align: center;
          margin-bottom: 2rem;
        }
        
        h1 {
          color: var(--primary);
          font-size: 2.5rem;
          margin-bottom: 0.5rem;
        }
        
        .subtitle {
          color: #6c757d;
          font-weight: 300;
        }
        
        .api-section {
          margin: 2rem 0;
        }
        
        .endpoint {
          background: white;
          border-radius: 8px;
          padding: 1rem;
          margin-bottom: 1rem;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }
        
        .method {
          display: inline-block;
          padding: 0.25rem 0.75rem;
          border-radius: 4px;
          font-weight: 600;
          font-size: 0.875rem;
          margin-right: 0.5rem;
        }
        
        .get { background: #d1e7dd; color: #0f5132; }
        .post { background: #cfe2ff; color: #084298; }
        .delete { background: #f8d7da; color: #842029; }
        
        .path {
          font-family: monospace;
          font-size: 1.1rem;
        }
        
        .description {
          margin-top: 0.5rem;
          color: #495057;
        }
        
        .try-button {
          display: inline-block;
          margin-top: 1rem;
          padding: 0.5rem 1rem;
          background: var(--primary);
          color: white;
          text-decoration: none;
          border-radius: 4px;
          transition: all 0.3s ease;
        }
        
        .try-button:hover {
          background: var(--secondary);
          transform: translateY(-2px);
        }
        
        footer {
          text-align: center;
          margin-top: 2rem;
          color: #6c757d;
          font-size: 0.875rem;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <header>
          <h1>Vercel Express API</h1>
          <p class="subtitle">A modern REST API deployed on Vercel</p>
        </header>
        
        <div class="api-section">
          <h2>API Endpoints</h2>
          
          <div class="endpoint">
            <span class="method get">GET</span>
            <span class="path">/api/todos</span>
            <p class="description">Get all todo items</p>
            <a href="/api/todos" class="try-button">Try it</a>
          </div>
          
          <div class="endpoint">
            <span class="method post">POST</span>
            <span class="path">/api/todos</span>
            <p class="description">Create a new todo item</p>
          </div>
          
          <div class="endpoint">
            <span class="method delete">DELETE</span>
            <span class="path">/api/todos/:id</span>
            <p class="description">Delete a todo item by ID</p>
          </div>
        </div>
        
        <footer>
          <p>Deployed with ❤️ on Vercel | Express.js</p>
        </footer>
      </div>
    </body>
    </html>
  `);
});

// 导出为 Vercel 无服务器函数
export default app;