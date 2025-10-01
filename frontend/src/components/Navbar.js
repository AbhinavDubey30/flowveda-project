
import React from 'react';

export default function Navbar({onNavigate, onLogout, token}){
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
      <div className="container">
        <div className="logo" style={{cursor:'pointer'}} onClick={()=>onNavigate('landing')}>
          <svg width="28" height="28" viewBox="0 0 24 24"><path fill="#00B4D8" d="M12 2C8 6 4 8 4 12a8 8 0 0 0 16 0c0-4-4-6-8-10z"/></svg>
          <span>FlowVeda</span>
        </div>
        <div>
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 d-flex flex-row gap-3">
            <li className="nav-item"><button className="btn btn-link" onClick={()=>onNavigate('landing')}>Home</button></li>
            <li className="nav-item"><button className="btn btn-link" onClick={()=>onNavigate('dashboard')}>Dashboard</button></li>
            <li className="nav-item"><button className="btn btn-link" onClick={()=>onNavigate('billing')}>Billing</button></li>
            <li className="nav-item"><button className="btn btn-link" onClick={()=>onNavigate('premium')}>Intelligence</button></li>
            {!token && <li><button className="btn btn-primary" onClick={()=>onNavigate('register')}>Get Started</button></li>}
            {token && <li><button className="btn btn-outline-danger" onClick={onLogout}>Logout</button></li>}
          </ul>
        </div>
      </div>
    </nav>
  );
}
