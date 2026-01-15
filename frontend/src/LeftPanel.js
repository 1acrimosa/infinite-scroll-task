import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const LeftPanel = ({ backendUrl }) => {
    const [filter, setFilter] = useState('');
    const [page, setPage] = useState(1);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchItems = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${backendUrl}/left?filter=${filter}&page=${page}&limit=20`);
            setItems(res.data);
        } catch (e) {
            console.error(e);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchItems();
    }, [filter, page]);

    const debouncedFilter = useCallback((value) => {
        setTimeout(() => {
            setFilter(value);
            setPage(1);
        }, 300);
    }, []);

    const toggleSelect = async (id) => {
        await axios.post(`${backendUrl}/select`, { id });
        fetchItems(); // обновить
    };

    return (
        <div className="panel">
            <div className="header">
                <h3>Все элементы</h3>
                <input
                    placeholder="Фильтр по ID"
                    onChange={e => debouncedFilter(e.target.value)}
                    style={{ width: '100%', padding: '5px' }}
                />
            </div>
            <div className="list">
                {loading ? 'Загрузка...' : (
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                        {items.map(item => (
                            <li key={item.id} className="item">
                                <input type="checkbox" onChange={() => toggleSelect(item.id)} />
                                <span>ID: {item.id}</span>
                            </li>
                        ))}
                        <button onClick={() => setPage(p => p + 1)} style={{ width: '100%', padding: '10px' }}>
                            Загрузить еще
                        </button>
                    </ul>
                )}
            </div>
        </div>
    );
};

export default LeftPanel;
