import React, { useState } from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';
import { debounce } from 'lodash.debounce';

const LeftPanel = ({ backendUrl }) => {
    const [filter, setFilter] = useState('');
    const [page, setPage] = useState(1);
    const limit = 20;

    const { data: items = [], isLoading } = useQuery(
        ['left', filter, page],
        () => axios.get(`${backendUrl}/left?filter=${filter}&page=${page}&limit=${limit}`).then(res => res.data)
    );

    const debouncedSetFilter = debounce((val) => {
        setFilter(val);
        setPage(1);
    }, 300);

    const toggleSelect = async (id) => {
        await axios.post(`${backendUrl}/select`, { id });
        window.location.reload(); // простой рефреш для demo
    };

    const loadMore = () => setPage(p => p + 1);

    return (
        <div className="panel">
            <div className="header">
                <input
                    placeholder="Фильтр по ID"
                    onChange={e => debouncedSetFilter(e.target.value)}
                    style={{ width: '100%' }}
                />
            </div>
            <div className="list">
                {isLoading ? 'Loading...' : (
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {items.map(item => (
                            <li key={item.id} style={{ padding: '10px', borderBottom: '1px solid #eee', display: 'flex' }}>
                                <input type="checkbox" onChange={() => toggleSelect(item.id)} />
                                <span style={{ marginLeft: 10 }}>ID: {item.id}</span>
                            </li>
                        ))}
                        <button onClick={loadMore} style={{ width: '100%' }}>Load more</button>
                    </ul>
                )}
            </div>
        </div>
    );
};

export default LeftPanel;
