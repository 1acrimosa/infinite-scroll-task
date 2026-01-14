const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());

// Хранение в памяти
let allItems = Array.from({length: 1000000}, (_, i) => ({id: i+1}));
let selectedIds = new Set(); // выбранные ID
let selectedOrder = []; // порядок выбранных

// Очереди для батчинга
let addQueue = new Set(); // дедупликация добавлений
let pendingSelects = []; // батчинг select раз в 1с
let processInterval = setInterval(() => {
    if (pendingSelects.length) {
        const batch = [...new Set(pendingSelects)]; // дедуп
        pendingSelects = [];
        // здесь сохраняем на сервере (пока в Set)
        batch.forEach(id => selectedIds.has(id) ? selectedIds.delete(id) : selectedIds.add(id));
    }
}, 1000);

setInterval(() => {
    if (addQueue.size) {
        const newIds = Array.from(addQueue);
        addQueue.clear();
        allItems.push(...newIds.map(id => ({id: Number(id)})));
    }
}, 10000); // батч add каждые 10с

// API левое окно: все кроме selected, фильтр, пагинация
app.get('/api/left', (req, res) => {
    const { filter = '', page = 1, limit = 20 } = req.query;
    const start = (page - 1) * limit;
    let items = allItems.filter(item =>
        !selectedIds.has(item.id) && String(item.id).startsWith(filter)
    );
    res.json(items.slice(start, start + Number(limit)));
});

// API правое окно: selected, фильтр, пагинация, сортировка
app.get('/api/right', (req, res) => {
    const { filter = '', page = 1, limit = 20, order } = req.query;
    const start = (page - 1) * limit;
    let items = Array.from(selectedIds).filter(id => String(id).startsWith(filter))
        .map(id => ({id}))
        .sort((a, b) => {
            if (order) {
                const oa = selectedOrder.indexOf(a.id);
                const ob = selectedOrder.indexOf(b.id);
                return oa - ob;
            }
            return a.id - b.id;
        });
    res.json(items.slice(start, start + Number(limit)));
});

// Toggle select
app.post('/api/select', (req, res) => {
    const { id } = req.body;
    pendingSelects.push(Number(id)); // в очередь
    res.json({ ok: true });
});

// Add new
app.post('/api/add', (req, res) => {
    const { id } = req.body;
    addQueue.add(id); // дедуп в Set
    res.json({ ok: true });
});

// Sort right
app.post('/api/sort', (req, res) => {
    const { order } = req.body; // array of ids
    selectedOrder = order;
    res.json({ ok: true });
});

app.listen(PORT, () => console.log(`Backend: http://localhost:${PORT}`));
