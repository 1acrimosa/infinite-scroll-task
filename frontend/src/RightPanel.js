import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    DndContext,
    closestCenter,
    useSensor,
    useSensors,
    PointerSensor,
} from '@dnd-kit/core';
import {
    SortableContext,
    useSortable,
    arrayMove,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const SortableItem = ({ id }) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        padding: '10px',
        borderBottom: '1px solid #eee',
        background: '#f9f9f9',
        margin: '2px 0',
        cursor: 'grab',
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            ID: {id}
        </div>
    );
};

const RightPanel = ({ backendUrl }) => {
    const [filter, setFilter] = useState('');
    const [page, setPage] = useState(1);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState([]);

    const sensors = useSensors(useSensor(PointerSensor));

    const fetchItems = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${backendUrl}/right?filter=${filter}&page=${page}&limit=20`);
            setItems(res.data);
        } catch (e) {
            console.error(e);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchItems();
    }, [filter, page]);

    useEffect(() => {
        const saved = localStorage.getItem('selectedOrder');
        if (saved) setSelectedOrder(JSON.parse(saved));
    }, []);

    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (active.id !== over.id) {
            setSelectedOrder((items) => {
                const oldIndex = items.indexOf(active.id);
                const newIndex = items.indexOf(over.id);
                const newOrder = arrayMove(items, oldIndex, newIndex);
                localStorage.setItem('selectedOrder', JSON.stringify(newOrder));
                axios.post(`${backendUrl}/sort`, { order: newOrder });
                return newOrder;
            });
        }
    };

    return (
        <div className="panel">
            <div className="header">
                <h3>Выбранные элементы</h3>
                <input
                    placeholder="Фильтр по ID"
                    onChange={e => {
                        setFilter(e.target.value);
                        setPage(1);
                    }}
                    style={{ width: '100%', padding: '5px' }}
                />
            </div>
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={items.map(i => i.id)} strategy={verticalListSortingStrategy}>
                    <div className="list">
                        {loading ? 'Загрузка...' : (
                            <div>
                                {items.map(item => (
                                    <SortableItem key={item.id} id={item.id} />
                                ))}
                                <button onClick={() => setPage(p => p + 1)} style={{ width: '100%', padding: '10px' }}>
                                    Загрузить еще
                                </button>
                            </div>
                        )}
                    </div>
                </SortableContext>
            </DndContext>
        </div>
    );
};

export default RightPanel;
