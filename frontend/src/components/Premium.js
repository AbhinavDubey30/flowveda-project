
import React, {useEffect, useState} from 'react';
import { getForecast, getAnomalies, subscribe, setAuthToken } from '../services/api';

export default function Premium({token}){
  useEffect(()=>{
    setAuthToken(token);
    if(!token) return;
    fetchPreview();
  }, [token]);

  const [forecast, setForecast] = useState(null);
  const [anomalies, setAnomalies] = useState(null);
  const [msg, setMsg] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  async function fetchPreview(){
    try{
      const f = await getForecast();
      setForecast(f);
    }catch(e){
      setForecast(null);
    }
    try{
      const a = await getAnomalies();
      setAnomalies(a);
    }catch(e){
      setAnomalies(null);
    }
  }

  async function handleSubscribe(){
    try{
      await subscribe('premium');
      setMsg('Welcome to FlowVeda Premium! Your dashboard is Ready!!');
      setIsSubscribed(true);
    }catch(e){
      setMsg('Subscription failed. Please try again.');
    }
  }

  if(!token) return <div className="alert alert-info">Login to view Premium features</div>

  return (
    <div>
      {/* Header */}
      <div className="text-center mb-5">
        <h2 className="text-dark-navy mb-3">FlowVeda Premium Services</h2>
        <p className="lead text-muted">
          Unlock advanced water quality monitoring features and intelligent insights
        </p>
      </div>

      {/* Success Message */}
      {msg && (
        <div className="alert alert-success alert-dismissible fade show mb-4" role="alert">
          <i className="fas fa-check-circle me-2"></i>
          <strong>{msg}</strong>
          <button 
            type="button" 
            className="btn-close" 
            onClick={() => setMsg('')}
            aria-label="Close"
          ></button>
        </div>
      )}

      {/* Premium Features Grid */}
      <div className="row g-4 mb-5">
        {/* Demand Forecasting */}
        <div className="col-md-6">
          <div className={`card h-100 ${!isSubscribed ? 'locked' : ''}`}>
            <div className="card-header bg-gradient-primary text-white">
              <h5 className="mb-0">
                <i className="fas fa-chart-line me-2"></i>
                Demand Forecasting
              </h5>
            </div>
            <div className="card-body">
              {isSubscribed ? (
                <div>
                  <p className="text-muted mb-3">
                    Predict future water needs using historical and live data for better planning.
                  </p>
                  {forecast ? (
                    <div>
                      <h6 className="text-success">7-Day Forecast:</h6>
                      <div className="row g-2">
                        {forecast.forecast.slice(0, 7).map((day, idx) => (
                          <div key={idx} className="col-12">
                            <div className="d-flex justify-content-between align-items-center p-2 bg-light rounded">
                              <span className="fw-bold">{new Date(day.date).toLocaleDateString()}</span>
                              <span className="text-primary">
                                {Object.values(day.predicted)[0] || 0} L predicted
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-3">
                      <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-4">
                  <i className="fas fa-lock fa-3x text-muted mb-3"></i>
                  <h6 className="text-muted">Premium Feature</h6>
                  <p className="text-muted small">
                    Predict future water consumption patterns and optimize usage planning.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Water Shutoff */}
        <div className="col-md-6">
          <div className={`card h-100 ${!isSubscribed ? 'locked' : ''}`}>
            <div className="card-header bg-gradient-primary text-white">
              <h5 className="mb-0">
                <i className="fas fa-shield-alt me-2"></i>
                intelligent Water Shutoff
              </h5>
            </div>
            <div className="card-body">
              {isSubscribed ? (
                <div>
                  <p className="text-muted mb-3">
                    Automatic shutoff for critical issues with instant attention alerts.
                  </p>
                  <div className="alert alert-info">
                    <i className="fas fa-info-circle me-2"></i>
                    <strong>Auto-shutoff enabled</strong> for critical water quality issues
                  </div>
                  <div className="row g-2">
                    <div className="col-6">
                      <div className="p-2 bg-success bg-opacity-10 rounded text-center">
                        <i className="fas fa-check-circle text-success"></i>
                        <div className="small mt-1">pH Monitoring</div>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="p-2 bg-success bg-opacity-10 rounded text-center">
                        <i className="fas fa-check-circle text-success"></i>
                        <div className="small mt-1">Contamination Alert</div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <i className="fas fa-lock fa-3x text-muted mb-3"></i>
                  <h6 className="text-muted">Premium Feature</h6>
                  <p className="text-muted small">
                    Automatic shutoff for critical issues with instant notifications.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Leak & Spike Detection */}
        <div className="col-md-6">
          <div className={`card h-100 ${!isSubscribed ? 'locked' : ''}`}>
            <div className="card-header bg-gradient-primary text-white">
              <h5 className="mb-0">
                <i className="fas fa-exclamation-triangle me-2"></i>
                Leak & Spike Detection
              </h5>
            </div>
            <div className="card-body">
              {isSubscribed ? (
                <div>
                  <p className="text-muted mb-3">
                    Instant alerts for unusual flow patterns or sensor irregularities.
                  </p>
                  {anomalies ? (
                    <div>
                      {anomalies.anomalies.length > 0 ? (
                        <div>
                          <h6 className="text-warning">Recent Anomalies:</h6>
                          {anomalies.anomalies.map((anomaly, idx) => (
                            <div key={idx} className="alert alert-warning small">
                              <strong>{anomaly.device}:</strong> {anomaly.message}
                              <div className="small text-muted mt-1">
                                Latest: {anomaly.latest}L | Avg: {anomaly.avg_prev}L
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-2">
                          <i className="fas fa-check-circle fa-2x text-success mb-2"></i>
                          <div className="text-success fw-bold">All systems normal</div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-3">
                      <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-4">
                  <i className="fas fa-lock fa-3x text-muted mb-3"></i>
                  <h6 className="text-muted">Premium Feature</h6>
                  <p className="text-muted small">
                    Advanced anomaly detection for leaks and unusual flow patterns.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Device Health Monitor */}
        <div className="col-md-6">
          <div className={`card h-100 ${!isSubscribed ? 'locked' : ''}`}>
            <div className="card-header bg-gradient-primary text-white">
              <h5 className="mb-0">
                <i className="fas fa-heartbeat me-2"></i>
                Device Health Monitor
              </h5>
            </div>
            <div className="card-body">
              {isSubscribed ? (
                <div>
                  <p className="text-muted mb-3">
                    Proactive maintenance notifications to users and authorities.
                  </p>
                  <div className="row g-2">
                    <div className="col-6">
                      <div className="p-2 bg-info bg-opacity-10 rounded text-center">
                        <i className="fas fa-battery-three-quarters text-info"></i>
                        <div className="small mt-1">Battery Health</div>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="p-2 bg-info bg-opacity-10 rounded text-center">
                        <i className="fas fa-tools text-info"></i>
                        <div className="small mt-1">Maintenance</div>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="p-2 bg-info bg-opacity-10 rounded text-center">
                        <i className="fas fa-wifi text-info"></i>
                        <div className="small mt-1">Connectivity</div>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="p-2 bg-info bg-opacity-10 rounded text-center">
                        <i className="fas fa-thermometer-half text-info"></i>
                        <div className="small mt-1">Temperature</div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <i className="fas fa-lock fa-3x text-muted mb-3"></i>
                  <h6 className="text-muted">Premium Feature</h6>
                  <p className="text-muted small">
                    Comprehensive device health monitoring and maintenance alerts.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Subscription Section */}
      {!isSubscribed && (
        <div className="card bg-gradient-water text-white">
          <div className="card-body text-center py-5">
            <h3 className="mb-3">Unlock All Premium Features</h3>
            <p className="lead mb-4">
              Get advanced water quality monitoring with intelligent insights and automated controls
            </p>
            
            <div className="row g-4 mb-4">
              <div className="col-md-4">
                <div className="feature-item">
                  <i className="fas fa-chart-line fa-2x mb-2"></i>
                  <h6>Demand Forecasting</h6>
                  <small>Predict future water needs</small>
                </div>
              </div>
              <div className="col-md-4">
                <div className="feature-item">
                  <i className="fas fa-shield-alt fa-2x mb-2"></i>
                  <h6>intelligent Shutoff</h6>
                  <small>Automatic safety controls</small>
                </div>
              </div>
              <div className="col-md-4">
                <div className="feature-item">
                  <i className="fas fa-heartbeat fa-2x mb-2"></i>
                  <h6>Device Health</h6>
                  <small>Proactive maintenance</small>
                </div>
              </div>
            </div>
            
            <div className="pricing-card bg-white text-dark rounded-3 p-4 mb-4 d-inline-block">
              <h2 className="text-dark-navy mb-1">₹99</h2>
              <div className="text-muted">per month</div>
            </div>
            
            <button 
              className="btn btn-light btn-lg px-5"
              onClick={handleSubscribe}
            >
              <i className="fas fa-crown me-2"></i>
              Subscribe Now – ₹99 only
            </button>
            
            <div className="mt-3">
              <small className="text-white-50">
                <i className="fas fa-shield-alt me-1"></i>
                Secure payment • Cancel anytime • 30-day money back guarantee
              </small>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
