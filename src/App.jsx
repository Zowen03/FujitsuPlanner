import './styles/App.css';

function App() {
  return (
    <div className="App">
      {/* Fixed Header */}
      <header className="app-header">
  <h1 className="app-title">Fujitsu Growth</h1>
  <div className="account-logo">
    <img src="account-placeholder.png" alt="Account" />
  </div>
</header>

      {/* Main Body */}
      <main className="app-body">
        <section className="intro-section">
          <div className="intro-text">
            <h2>Welcome to your personal certification planner</h2>
            <p>
              Structure your learning, track progress, and deploy study templates built by the Fujitsu community. Take control of your growth today.
            </p>
          </div>
          <button className="quick-start-btn">Quick Start</button>
        </section>

        <section className="planners-section">
          <h2>Your Planners</h2>
          <div className="calendar-preview">
            <p>[Calendar Placeholder – Month View]</p>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
