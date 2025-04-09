import React from 'react';

function App() {
    return (
        <div className="App">
            <header className="App-header">
                <h1>Welcome to Fujitsu Planner</h1>
            </header>
            <main>
                <p>Start planning your tasks here!</p>
            </main>
            <footer>
                <p>&copy; {new Date().getFullYear()} Fujitsu Planner</p>
            </footer>
        </div>
    );
}

export default App;