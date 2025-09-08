import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

// ES模块兼容性处理
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件配置
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 静态文件托管 - 确保路径正确
const publicPath = path.join(__dirname, '../public');
app.use(express.static(publicPath));

// 模拟数据库
let todos = [
  { id: 1, text: 'Learn Vercel deployment', completed: false, createdAt: new Date() },
  { id: 2, text: 'Build a REST API', completed: true, createdAt: new Date(Date.now() - 86400000) },
  { id: 3, text: 'Design a beautiful UI', completed: false, createdAt: new Date(Date.now() - 172800000) }
];

// API 路由
app.get('/api/todos', (req, res) => {
  try {
    const { completed, q } = req.query;
    let filteredTodos = [...todos];

    if (completed === 'true') filteredTodos = filteredTodos.filter(todo => todo.completed);
    if (completed === 'false') filteredTodos = filteredTodos.filter(todo => !todo.completed);
    if (q) filteredTodos = filteredTodos.filter(todo => todo.text.toLowerCase().includes(q.toLowerCase()));

    res.json({
      success: true,
      data: filteredTodos,
      meta: {
        total: filteredTodos.length,
        completed: filteredTodos.filter(todo => todo.completed).length
      }
    });
  } catch (error) {
    handleError(res, error, 'Failed to fetch todos');
  }
});

app.post('/api/todos', (req, res) => {
  try {
    const { text } = req.body;
    if (!text?.trim()) return sendError(res, 400, 'Todo text cannot be empty');

    const newTodo = {
      id: todos.length ? Math.max(...todos.map(t => t.id)) + 1 : 1,
      text: text.trim(),
      completed: false,
      createdAt: new Date()
    };

    todos.push(newTodo);
    res.status(201).json({ success: true, data: newTodo });
  } catch (error) {
    handleError(res, error, 'Failed to create todo');
  }
});

app.delete('/api/todos/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const initialLength = todos.length;
    
    todos = todos.filter(todo => todo.id !== id);
    if (todos.length === initialLength) {
      return sendError(res, 404, 'Todo not found');
    }

    res.json({ 
      success: true, 
      message: 'Todo deleted',
      remaining: todos.length 
    });
  } catch (error) {
    handleError(res, error, 'Failed to delete todo');
  }
});

// 首页路由
app.get('/', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'), (err) => {
    if (err) {
      console.error('Failed to serve index.html:', err);
      res.status(404).json({
        success: false,
        error: 'Frontend not found',
        hint: 'Make sure public/index.html exists'
      });
    }
  });
});

// 健康检查端点
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    time: new Date().toISOString(),
    todosCount: todos.length 
  });
});

// 404 处理
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    availableEndpoints: [
      'GET    /',
      'GET    /api/todos',
      'POST   /api/todos',
      'DELETE /api/todos/:id',
      'GET    /health'
    ]
  });
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error('Server error:', err.stack);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { details: err.message })
  });
});

// 辅助函数
function handleError(res, error, message) {
  console.error(error);
  res.status(500).json({ 
    success: false, 
    error: message,
    ...(process.env.NODE_ENV === 'development' && { details: error.message })
  });
}

function sendError(res, status, message) {
  return res.status(status).json({ success: false, error: message });
}

// 启动服务器
if (process.env.VERCEL !== '1') {
  const server = app.listen(PORT, () => {
    console.log(`
    ======================
    🚀 Server is running!
    ======================
    Local: http://localhost:${PORT}
    API Docs:
    - GET    /api/todos
    - POST   /api/todos
    - DELETE /api/todos/:id
    `);
    
    // 开发环境下提示手动访问
    if (process.env.NODE_ENV === 'development') {
      console.log('请手动打开浏览器访问以上地址');
    }
  });

  // 优雅关闭
  process.on('SIGTERM', () => {
    server.close(() => {
      console.log('Server gracefully closed');
      process.exit(0);
    });
  });
}

export default app;