import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

// ES模块兼容性处理
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// 中间件配置
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 静态文件托管
app.use(express.static(path.join(__dirname, '../../public')));

// 模拟数据库
let todos = [
  { id: 1, text: 'Learn Vercel deployment', completed: false, createdAt: new Date() },
  { id: 2, text: 'Build a REST API', completed: true, createdAt: new Date(Date.now() - 86400000) },
  { id: 3, text: 'Design a beautiful UI', completed: false, createdAt: new Date(Date.now() - 172800000) }
];

// API 路由
app.get('/api/todos', (req, res) => {
  // 支持查询参数过滤
  const { completed } = req.query;
  let filteredTodos = [...todos];

  if (completed === 'true') {
    filteredTodos = todos.filter(todo => todo.completed);
  } else if (completed === 'false') {
    filteredTodos = todos.filter(todo => !todo.completed);
  }

  res.json({
    success: true,
    data: filteredTodos,
    meta: {
      total: filteredTodos.length,
      completed: filteredTodos.filter(todo => todo.completed).length
    }
  });
});

app.post('/api/todos', (req, res) => {
  const { text } = req.body;

  if (!text || typeof text !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'Invalid todo text'
    });
  }

  const newTodo = {
    id: todos.length > 0 ? Math.max(...todos.map(t => t.id)) + 1 : 1,
    text: text.trim(),
    completed: false,
    createdAt: new Date()
  };

  todos.push(newTodo);

  res.status(201).json({
    success: true,
    data: newTodo
  });
});

app.delete('/api/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const initialLength = todos.length;

  todos = todos.filter(todo => todo.id !== id);

  if (todos.length === initialLength) {
    return res.status(404).json({
      success: false,
      error: 'Todo not found'
    });
  }

  res.status(200).json({
    success: true,
    message: 'Todo deleted successfully'
  });
});

// 美观的首页
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/index.html'));
});

// 404 处理
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found'
  });
});

// 错误处理
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

// 导出为 Vercel 无服务器函数
export default app;