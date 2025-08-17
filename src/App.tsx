import React, { useState } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

function App() {
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  const handleLogin = (userId: string) => {
    setCurrentUser(userId);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  return (
    <div className="App">
      {currentUser ? (
        <Dashboard userId={currentUser} onLogout={handleLogout} />
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;