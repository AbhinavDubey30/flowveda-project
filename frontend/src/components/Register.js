
import React, {useState} from 'react';
import { register } from '../services/api';

export default function Register({onRegistered}){
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [userType, setUserType] = useState('household');
  const [mobileNumber, setMobileNumber] = useState('');
  const [municipalityName, setMunicipalityName] = useState('');
  const [location, setLocation] = useState('');
  const [householdSize, setHouseholdSize] = useState(1);
  const [deviceId, setDeviceId] = useState('');
  const [step, setStep] = useState(1);
  const [err, setErr] = useState('');

  function validateStep1(){
    // Allow any input - just check if username is provided, otherwise generate one
    if(!username) {
      setUsername(`user_${Date.now()}`); // Generate unique username
    }
    if(!password) {
      setPassword('defaultpass123'); // Set default password
    }
    if(!confirmPassword) {
      setConfirmPassword('defaultpass123'); // Set default confirm password
    }
    if(!email) {
      setEmail(`${username || 'user'}_${Date.now()}@flowveda.local`); // Generate email
    }
    return true; // Always allow to proceed
  }

  function nextStep(e){
    e.preventDefault();
    if(validateStep1()){
      setErr('');
      setStep(2);
    }
  }

  async function submit(e){
    e.preventDefault();
    setErr('');
    
    const registrationData = {
      username,
      email,
      password,
      user_type: userType,
      mobile_number: mobileNumber,
      municipality_name: municipalityName,
      location,
      household_size: householdSize,
      device_id: deviceId
    };
    
    try{
      const r = await register(registrationData);
      onRegistered(r);
    }catch(e){
      setErr('Registration failed or server error');
    }
  }

  return (
    <div className="row justify-content-center">
      <div className="col-md-8">
        <div className="card p-4 card-gauge">
          <div className="text-center mb-4">
            <h4 className="text-dark-navy">Get Started with FlowVeda</h4>
            <p className="text-muted">Join thousands of users monitoring water quality</p>
            <div className="progress mb-3" style={{height: '6px'}}>
              <div 
                className="progress-bar bg-primary" 
                style={{width: step === 1 ? '50%' : '100%'}}
              ></div>
            </div>
            <small className="text-muted">Step {step} of 2</small>
          </div>
          
          {step === 1 ? (
            <form onSubmit={nextStep}>
              <div className="mb-4">
                <label className="form-label fw-bold text-dark-teal">I am a:</label>
                <div className="row g-3">
                  <div className="col-6">
                    <div className="form-check h-100">
                      <input 
                        className="form-check-input" 
                        type="radio" 
                        name="userType" 
                        id="household" 
                        value="household"
                        checked={userType === 'household'}
                        onChange={e => setUserType(e.target.value)}
                      />
                      <label className="form-check-label h-100 d-flex flex-column justify-content-center" htmlFor="household">
                        <i className="fas fa-home fa-2x text-primary mb-2"></i>
                        <strong>Household User</strong>
                        <small className="text-muted">Personal water quality monitoring for my home</small>
                      </label>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="form-check h-100">
                      <input 
                        className="form-check-input" 
                        type="radio" 
                        name="userType" 
                        id="official" 
                        value="official"
                        checked={userType === 'official'}
                        onChange={e => setUserType(e.target.value)}
                      />
                      <label className="form-check-label h-100 d-flex flex-column justify-content-center" htmlFor="official">
                        <i className="fas fa-building fa-2x text-success mb-2"></i>
                        <strong>Official/Municipal</strong>
                        <small className="text-muted">Water corporation or municipality representative</small>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Full Name <small className="text-muted">(optional)</small></label>
                  <input 
                    className="form-control" 
                    value={username} 
                    onChange={e=>setUsername(e.target.value)} 
                    placeholder="Enter your full name (auto-generated if empty)"
                  />
                </div>
                
                <div className="col-md-6 mb-3">
                  <label className="form-label">Email ID <small className="text-muted">(optional)</small></label>
                  <input 
                    type="email"
                    className="form-control" 
                    value={email} 
                    onChange={e=>setEmail(e.target.value)} 
                    placeholder="your.email@example.com (auto-generated if empty)"
                  />
                </div>
              </div>
              
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Password <small className="text-muted">(optional)</small></label>
                  <input 
                    type="password" 
                    className="form-control" 
                    value={password} 
                    onChange={e=>setPassword(e.target.value)} 
                    placeholder="Create a password (default: defaultpass123)"
                  />
                </div>
                
                <div className="col-md-6 mb-3">
                  <label className="form-label">Confirm Password <small className="text-muted">(optional)</small></label>
                  <input 
                    type="password" 
                    className="form-control" 
                    value={confirmPassword} 
                    onChange={e=>setConfirmPassword(e.target.value)} 
                    placeholder="Confirm your password"
                  />
                </div>
              </div>
              
              {err && <div className="alert alert-danger">{err}</div>}
              
              <div className="d-grid gap-2">
                <button type="submit" className="btn btn-primary py-2">
                  <i className="fas fa-arrow-right me-2"></i>
                  Continue to Additional Details
                </button>
                <button 
                  type="button" 
                  className="btn btn-outline-success py-2"
                  onClick={async (e) => {
                    e.preventDefault();
                    setErr('');
                    
                    // Auto-fill with defaults
                    if(!username) setUsername(`user_${Date.now()}`);
                    if(!email) setEmail(`user_${Date.now()}@flowveda.local`);
                    if(!password) setPassword('defaultpass123');
                    if(!confirmPassword) setConfirmPassword('defaultpass123');
                    if(!mobileNumber) setMobileNumber('9876543210');
                    if(!location) setLocation('Mumbai, Maharashtra');
                    if(!deviceId) setDeviceId(`FLV-${Date.now()}`);
                    
                    // Submit with defaults
                    const registrationData = {
                      username: username || `user_${Date.now()}`,
                      email: email || `user_${Date.now()}@flowveda.local`,
                      password: password || 'defaultpass123',
                      user_type: userType,
                      mobile_number: mobileNumber || '9876543210',
                      municipality_name: municipalityName || 'Default Municipality',
                      location: location || 'Mumbai, Maharashtra',
                      household_size: householdSize,
                      device_id: deviceId || `FLV-${Date.now()}`
                    };
                    
                    try{
                      const r = await register(registrationData);
                      onRegistered(r);
                    }catch(e){
                      setErr('Registration failed or server error');
                    }
                  }}
                >
                  <i className="fas fa-bolt me-2"></i>
                  Quick Register (Auto-fill)
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={submit}>
              <h5 className="text-dark-teal mb-3">
                {userType === 'household' ? 'Household Details' : 'Municipality Details'}
              </h5>
              
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Mobile Number <small className="text-muted">(optional)</small></label>
                  <input 
                    type="tel"
                    className="form-control" 
                    value={mobileNumber} 
                    onChange={e=>setMobileNumber(e.target.value)} 
                    placeholder="+91 9876543210"
                  />
                </div>
                
                <div className="col-md-6 mb-3">
                  <label className="form-label">Location <small className="text-muted">(optional)</small></label>
                  <input 
                    className="form-control" 
                    value={location} 
                    onChange={e=>setLocation(e.target.value)} 
                    placeholder="City, State"
                  />
                </div>
              </div>
              
              {userType === 'household' ? (
                <>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Household Size</label>
                      <select 
                        className="form-control" 
                        value={householdSize} 
                        onChange={e=>setHouseholdSize(parseInt(e.target.value))}
                      >
                        <option value={1}>1 person</option>
                        <option value={2}>2 people</option>
                        <option value={3}>3 people</option>
                        <option value={4}>4 people</option>
                        <option value={5}>5+ people</option>
                      </select>
                    </div>
                    
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Device ID <small className="text-muted">(optional)</small></label>
                      <input 
                        className="form-control" 
                        value={deviceId} 
                        onChange={e=>setDeviceId(e.target.value)} 
                        placeholder="Enter your device ID"
                      />
                    </div>
                  </div>
                </>
              ) : (
                <div className="mb-3">
                  <label className="form-label">Municipality / Water Board Name <small className="text-muted">(optional)</small></label>
                  <input 
                    className="form-control" 
                    value={municipalityName} 
                    onChange={e=>setMunicipalityName(e.target.value)} 
                    placeholder="Enter municipality or water board name"
                  />
                </div>
              )}
              
              {err && <div className="alert alert-danger">{err}</div>}
              
              <div className="d-grid gap-2">
                <div className="d-flex gap-2">
                  <button 
                    type="button" 
                    className="btn btn-outline-secondary flex-fill"
                    onClick={() => setStep(1)}
                  >
                    <i className="fas fa-arrow-left me-2"></i>
                    Back
                  </button>
                  <button type="submit" className="btn btn-success flex-fill">
                    <i className="fas fa-user-plus me-2"></i>
                    Complete Registration
                  </button>
                </div>
                <button 
                  type="button" 
                  className="btn btn-outline-primary"
                  onClick={async (e) => {
                    e.preventDefault();
                    setErr('');
                    
                    // Auto-fill missing fields with defaults
                    if(!mobileNumber) setMobileNumber('9876543210');
                    if(!location) setLocation('Mumbai, Maharashtra');
                    if(!deviceId) setDeviceId(`FLV-${Date.now()}`);
                    if(!municipalityName) setMunicipalityName('Default Municipality');
                    
                    // Submit with defaults
                    const registrationData = {
                      username: username || `user_${Date.now()}`,
                      email: email || `user_${Date.now()}@flowveda.local`,
                      password: password || 'defaultpass123',
                      user_type: userType,
                      mobile_number: mobileNumber || '9876543210',
                      municipality_name: municipalityName || 'Default Municipality',
                      location: location || 'Mumbai, Maharashtra',
                      household_size: householdSize,
                      device_id: deviceId || `FLV-${Date.now()}`
                    };
                    
                    try{
                      const r = await register(registrationData);
                      onRegistered(r);
                    }catch(e){
                      setErr('Registration failed or server error');
                    }
                  }}
                >
                  <i className="fas fa-magic me-2"></i>
                  Complete with Defaults
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
