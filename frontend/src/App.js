import React, {useState} from 'react';
import Navbar from './components/Navbar';
import Landing from './components/Landing';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Register from './components/Register';
import Billing from './components/Billing';
import Premium from './components/Premium';
import Admin from './components/Admin'; // Import the Admin component
import ResidentDashboard from './components/ResidentDashboard';
import AdminDashboard from './components/AdminDashboard';

function App(){
  const [page, setPage] = useState('landing');
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || 'null'));

  function handleNav(p){
    setPage(p);
  }

  function handleLogin(loginData){
    // Check if it's an authority login (hardcoded credentials)
    if (loginData === 'authority_login') {
      setPage('admin-dashboard');
      return;
    }
    
    // Regular household login
    const tok = typeof loginData === 'string' ? loginData : loginData.token;
    const userData = typeof loginData === 'object' ? loginData.user : null;
    
    setToken(tok);
    setUser(userData);
    localStorage.setItem('token', tok);
    if(userData) localStorage.setItem('user', JSON.stringify(userData));
    setPage('user-dashboard');
  }

  function handleLogout(){
    setToken('');
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setPage('login');
  }

  // Function to handle navigation to admin page
  function navigateToAdmin() {
    setPage('admin-dashboard');
  }

  return (
    <div>
      {/* Don't show navbar on admin and landing pages */}
      {page !== 'landing' && page !== 'admin' && page !== 'admin-dashboard' && page !== 'user-dashboard' && (
        <Navbar onNavigate={handleNav} onLogout={handleLogout} token={token}/>
      )}
      
      <div className={page !== 'landing' && page !== 'admin' && page !== 'admin-dashboard' && page !== 'user-dashboard' ? 'container mt-4' : ''}>
        {page === 'landing' && <Landing onNavigate={handleNav} />}
        {page === 'dashboard' && <Dashboard token={token} user={user} />}
        {page === 'user-dashboard' && <ResidentDashboard user={user} onLogout={handleLogout} />}
        {page === 'admin-dashboard' && <AdminDashboard onLogout={handleLogout} />}
        {page === 'login' && <Login onLogin={handleLogin} onNavigateToAdmin={navigateToAdmin} />}
        {page === 'register' && <Register onRegistered={handleLogin} />}
        {page === 'billing' && <Billing token={token} />}
        {page === 'premium' && <Premium token={token} />}
        {page === 'admin' && <Admin onLogout={handleLogout} />}
      </div>
    </div>
  );
}

export default App;