document.addEventListener('DOMContentLoaded', () => {
    // DOM 元素
    const responseOutput = document.getElementById('response-output');
    const refreshBtn = document.getElementById('refresh-btn');
    const filterSelect = document.getElementById('filter-select');
    const todoItemsContainer = document.getElementById('todo-items-container');

    // API 基础URL
    const API_BASE_URL = '/api/todos';

    // 格式化日期
    const formatDate = (dateString) => {
        const options = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    // 更新响应输出
    const updateResponseOutput = (data) => {
        responseOutput.textContent = JSON.stringify(data, null, 2);
    };

    // 获取Todos
    const fetchTodos = async (filter = 'all') => {
        try {
            let url = API_BASE_URL;
            if (filter === 'completed') url += '?completed=true';
            if (filter === 'active') url += '?completed=false';

            const response = await fetch(url);
            const data = await response.json();

            updateResponseOutput(data);
            renderTodoItems(data.data);
        } catch (error) {
            console.error('Error fetching todos:', error);
            updateResponseOutput({ error: 'Failed to fetch todos' });
        }
    };

    // 渲染Todo项目
    const renderTodoItems = (todos) => {
        todoItemsContainer.innerHTML = '';

        if (!todos || todos.length === 0) {
            todoItemsContainer.innerHTML = '<p class="no-todos">No todos found</p>';
            return;
        }

        todos.forEach(todo => {
            const todoElement = document.createElement('div');
            todoElement.className = `todo-item ${todo.completed ? 'completed' : ''}`;
            todoElement.innerHTML = `
        <div class="todo-content">
          <div class="todo-id">ID: ${todo.id}</div>
          <div class="todo-text">${todo.text}</div>
          <div class="todo-date">Created: ${formatDate(todo.createdAt)}</div>
        </div>
        <div class="todo-actions">
          <button class="delete-btn" data-id="${todo.id}">×</button>
        </div>
      `;
            todoItemsContainer.appendChild(todoElement);
        });

        // 添加删除事件监听
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const id = e.target.getAttribute('data-id');
                await deleteTodo(id);
            });
        });
    };

    // 创建Todo
    const createTodo = async (text) => {
        try {
            const response = await fetch(API_BASE_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text })
            });

            const data = await response.json();
            updateResponseOutput(data);
            fetchTodos(filterSelect.value);
        } catch (error) {
            console.error('Error creating todo:', error);
            updateResponseOutput({ error: 'Failed to create todo' });
        }
    };

    // 删除Todo
    const deleteTodo = async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/${id}`, {
                method: 'DELETE'
            });

            const data = await response.json();
            updateResponseOutput(data);
            fetchTodos(filterSelect.value);
        } catch (error) {
            console.error('Error deleting todo:', error);
            updateResponseOutput({ error: 'Failed to delete todo' });
        }
    };

    // 事件监听
    refreshBtn.addEventListener('click', () => {
        fetchTodos(filterSelect.value);
    });

    filterSelect.addEventListener('change', (e) => {
        fetchTodos(e.target.value);
    });

    // GET端点尝试按钮
    document.querySelector('.endpoint-card.get .try-btn').addEventListener('click', () => {
        fetchTodos(filterSelect.value);
    });

    // POST端点发送按钮
    document.querySelector('.endpoint-card.post .send-btn').addEventListener('click', () => {
        const input = document.getElementById('new-todo-text');
        if (input.value.trim()) {
            createTodo(input.value.trim());
            input.value = '';
        }
    });

    // DELETE端点发送按钮
    document.querySelector('.endpoint-card.delete .send-btn').addEventListener('click', () => {
        const input = document.getElementById('delete-todo-id');
        if (input.value.trim()) {
            deleteTodo(input.value.trim());
            input.value = '';
        }
    });

    // 初始加载
    fetchTodos();
});