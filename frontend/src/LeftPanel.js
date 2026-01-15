import React, { useState, useCallback } from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';
import { debounce } from 'lodash.debounce';

const LeftPanel = ({ backendUrl }) => {
    const [filter, setFilter] = useState('');
    const [page, setPage] = useState(1);

    const { data: items = [], isLoading, refetch } = useQuery(
        ['left', filter, page],
        () => axios.get(`${backendUrl}/left?filter=${filter}&page=${page}&limit=20`).then(res => res.data),
        { keepPreviousData: true }
    );

    const debouncedFilter = useCallback(debounce((value) => {
        setFilter(value);
        setPage(1);
    }, 300), []);

    const toggleSelect = async (id) => {
        await axios.post(`${backendUrl}/select`, { id });
        refetch();
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
                {isLoading ? 'Загрузка...' : (
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
