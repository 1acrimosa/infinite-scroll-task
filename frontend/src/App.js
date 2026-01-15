import React from 'react';
import LeftPanel from './LeftPanel';
import RightPanel from './RightPanel';
import './App.css';

function App() {
    const backendUrl = 'https://infinite-scroll-task.onrender.com/api';
    return (
        <div className="app">
            <div className="panels">
                <LeftPanel backendUrl={backendUrl} />
                <RightPanel backendUrl={backendUrl} />
            </div>
        </div>
    );
}

export default App;
