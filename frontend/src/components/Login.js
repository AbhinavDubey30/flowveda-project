import React, {useState} from 'react';
import { login } from '../services/api';

export default function Login({onLogin, onNavigateToAdmin}){
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [deviceId, setDeviceId] = useState('');
  const [loginType, setLoginType] = useState('authority'); // 'authority' or 'household'
  const [err, setErr] = useState('');

  async function submit(e){
    e.preventDefault();
    setErr('');
    
    if(loginType === 'authority') {
      // Hardcoded authority credentials
      const hardcodedEmail = "admin@municipality.gov.in";
      const hardcodedPassword = "admin123";
      
      // Check against hardcoded credentials
      if(username === hardcodedEmail && password === hardcodedPassword) {
        // Successful authority login
        onLogin('authority_login'); // Special signal for authority login
      } else {
        setErr('Invalid email or password. Use: admin@municipality.gov.in / admin123');
      }
    } else {
      // Household login logic
      let loginData = {username: deviceId, password: mobileNumber};
      try{
        const r = await login(loginData);
        onLogin(r);
      }catch(e){
        setErr('Invalid credentials or server error');
      }
    }
  }

  return (
    <div className="row justify-content-center">
      <div className="col-md-6">
        <div className="card card-gauge p-4">
          <div className="text-center mb-4">
            <h4 className="text-dark-navy">Welcome Back to FlowVeda</h4>
            <p className="text-muted">Sign in to your dashboard</p>
          </div>
          
          <div className="mb-4">
            <label className="form-label fw-bold text-dark-teal">Login as:</label>
            <div className="row g-3">
              <div className="col-6">
                <div className="form-check h-100">
                  <input 
                    className="form-check-input" 
                    type="radio" 
                    name="loginType" 
                    id="authority" 
                    value="authority"
                    checked={loginType === 'authority'}
                    onChange={e => setLoginType(e.target.value)}
                  />
                  <label className="form-check-label h-100 d-flex flex-column justify-content-center" htmlFor="authority">
                    <i className="fas fa-building fa-2x text-primary mb-2"></i>
                    <strong>Authority</strong>
                    <small className="text-muted">Municipal/Water Board</small>
                  </label>
                </div>
              </div>
              <div className="col-6">
                <div className="form-check h-100">
                  <input 
                    className="form-check-input" 
                    type="radio" 
                    name="loginType" 
                    id="household" 
                    value="household"
                    checked={loginType === 'household'}
                    onChange={e => setLoginType(e.target.value)}
                  />
                  <label className="form-check-label h-100 d-flex flex-column justify-content-center" htmlFor="household">
                    <i className="fas fa-home fa-2x text-success mb-2"></i>
                    <strong>Household</strong>
                    <small className="text-muted">Family User</small>
                  </label>
                </div>
              </div>
            </div>
          </div>
          
          <form onSubmit={submit}>
            {loginType === 'authority' ? (
              <>
                <div className="mb-3">
                  <label className="form-label">Email ID</label>
                  <input 
                    type="email"
                    className="form-control" 
                    value={username} 
                    onChange={e=>setUsername(e.target.value)} 
                    required
                    placeholder="admin@municipality.gov.in"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <input 
                    type="password" 
                    className="form-control" 
                    value={password} 
                    onChange={e=>setPassword(e.target.value)} 
                    required
                    placeholder="admin123"
                  />
                  <small className="text-muted">Use: admin@municipality.gov.in / admin123</small>
                </div>
              </>
            ) : (
              <>
                <div className="mb-3">
                  <label className="form-label">Device ID</label>
                  <input 
                    className="form-control" 
                    value={deviceId} 
                    onChange={e=>setDeviceId(e.target.value)} 
                    required
                    placeholder="Enter your device ID"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Mobile Number</label>
                  <input 
                    type="tel"
                    className="form-control" 
                    value={mobileNumber} 
                    onChange={e=>setMobileNumber(e.target.value)} 
                    required
                    placeholder="+91 9876543210"
                  />
                  <small className="text-muted">OTP will be sent to your mobile for verification</small>
                </div>
              </>
            )}
            
            {err && <div className="alert alert-danger">{err}</div>}
            
            <button type="submit" className="btn btn-primary w-100 py-2">
              <i className="fas fa-sign-in-alt me-2"></i>
              {loginType === 'authority' ? 'Login to Authority Dashboard' : 'Login to Household Dashboard'}
            </button>
          </form>
          
          <div className="text-center mt-3">
            <p className="text-muted">
              Don't have an account? 
              <button 
                className="btn btn-link p-0 ms-1" 
                onClick={() => window.location.href = '/register'}
              >
                Register here
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}