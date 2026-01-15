import React from 'react';
import LeftPanel from './LeftPanel';
import './App.css';

function App() {
    const backendUrl = 'http://localhost:3001/api';
    return (
        <div className="app">
            <LeftPanel backendUrl={backendUrl} />
        </div>
    );
}

export default App;
