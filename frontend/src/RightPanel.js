import React from 'react';

const RightPanel = ({ backendUrl }) => (
    <div className="panel">
        <div className="header">
            <h3>Выбранные элементы</h3>
            <input placeholder="Фильтр по ID" disabled />
        </div>
        <div className="list">Пусто (добавим DnD)</div>
    </div>
);

export default RightPanel;
