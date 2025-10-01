import React, {useEffect, useState} from 'react';
import { getReadings, getDevices, setAuthToken, addDevice, getSchema, getTelemetry, getLatest, getSeries } from '../services/api';
// Polling interval constant (5 seconds)
const POLLING_INTERVAL = 5000;

export default function Dashboard({token, user}){
  useEffect(()=>{
    setAuthToken(token);
    if(!token) return;
    fetchData();
  }, [token]);

  const [devices, setDevices] = useState([]);
  const [readings, setReadings] = useState([]);
  const [showAddDevice, setShowAddDevice] = useState(false);
  const [deviceId, setDeviceId] = useState('');
  const [deviceName, setDeviceName] = useState('');
  const [deviceLocation, setDeviceLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  
  // Real-time telemetry states
  const [telemetryData, setTelemetryData] = useState(null);
  const [overallStatus, setOverallStatus] = useState('unknown');

  async function fetchData(){
    try{
      const [devicesData, readingsData, latestTelemetry] = await Promise.all([
        getDevices(),
        getReadings(),
        getLatest()
      ]);
      setDevices(devicesData);
      setReadings(readingsData);
      setTelemetryData(latestTelemetry);
      calculateOverallStatus(latestTelemetry);
    }catch(e){
      console.error(e);
    }
  }

  async function fetchLatestTelemetry(){
    try{
      const latestTelemetry = await getLatest();
      setTelemetryData(latestTelemetry);
      calculateOverallStatus(latestTelemetry);
    }catch(e){
      console.error('Error fetching latest telemetry:', e);
    }
  }

  function calculateOverallStatus(telemetryData) {
    if (!telemetryData || !telemetryData.values) {
      setOverallStatus('unknown');
      return;
    }

    const { values } = telemetryData;
    
    // Check each parameter against safety thresholds
    const isSafe = checkWaterSafety(values);
    setOverallStatus(isSafe ? 'safe' : 'unsafe');
  }

  function checkWaterSafety(parameters) {
    // Safety thresholds for each parameter
    const thresholds = {
      'pH': { min: 6.5, max: 8.5 },
      'TDS': { max: 500 },
      'turbidity': { max: 1 },
      'chlorine': { min: 0.2, max: 4.0 },
      'hardness': { max: 300 },
      'microbes': { max: 0.1 },
      'microbial proxy': { max: 0.1 }
    };

    for (const [param, value] of Object.entries(parameters)) {
      const threshold = thresholds[param];
      if (!threshold) continue;

      if (threshold.min !== undefined && value < threshold.min) return false;
      if (threshold.max !== undefined && value > threshold.max) return false;
    }

    return true;
  }

  async function handleAddDevice(e){
    e.preventDefault();
    setLoading(true);
    try{
      await addDevice({
        name: deviceName || `Device ${deviceId}`,
        location: deviceLocation,
        device_id: deviceId
      });
      setDeviceId('');
      setDeviceName('');
      setDeviceLocation('');
      setShowAddDevice(false);
      setShowSuccessMessage(true);
      fetchData();
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);
    }catch(e){
      console.error('Failed to add device:', e);
    }
    setLoading(false);
  }

  // Set up polling for real-time updates
  useEffect(() => {
    if (!token) return;
    const interval = setInterval(() => {
      fetchLatestTelemetry();
    }, POLLING_INTERVAL);
    return () => clearInterval(interval);
  }, [token]);

  if(!token){
    return <div className="alert alert-info">Please login or register to see your dashboard.</div>
  }

  const userType = user?.user_type || 'household';
  const isOfficial = userType === 'official';

  return (
    <div>
      {/* Dashboard Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="mb-1">
            {isOfficial ? 'Municipal Water Monitoring Dashboard' : 'My Water Quality Dashboard'}
          </h3>
          <p className="text-muted mb-0">
            {isOfficial 
              ? 'Monitor multiple water sources across your municipality' 
              : 'Keep track of your home water quality'
            }
          </p>
        </div>
        <button 
          className="btn btn-primary"
          onClick={() => setShowAddDevice(true)}
        >
          <i className="fas fa-plus me-2"></i>
          Add Device
        </button>
      </div>

      {/* Success Message */}
      {showSuccessMessage && (
        <div className="alert alert-success alert-dismissible fade show mb-4" role="alert">
          <i className="fas fa-check-circle me-2"></i>
          <strong>Device Added Successfully!</strong> Your device is now connected and ready to monitor water quality.
          <button 
            type="button" 
            className="btn-close" 
            onClick={() => setShowSuccessMessage(false)}
            aria-label="Close"
          ></button>
        </div>
      )}

      {/* Add Device Modal */}
      {showAddDevice && (
        <div className="modal show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="fas fa-microchip me-2"></i>
                  Add New Device
                </h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowAddDevice(false)}
                ></button>
              </div>
              <form onSubmit={handleAddDevice}>
                <div className="modal-body">
                  <div className="alert alert-info">
                    <i className="fas fa-info-circle me-2"></i>
                    Enter your FlowVeda device ID to start monitoring water quality.
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label fw-bold">Device ID *</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={deviceId}
                      onChange={e => setDeviceId(e.target.value)}
                      placeholder="Enter your device ID (e.g., FLV-001-ABC123)"
                      required
                    />
                    <div className="form-text">
                      You can find your device ID on the device label or packaging.
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Device Name</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={deviceName}
                      onChange={e => setDeviceName(e.target.value)}
                      placeholder={isOfficial ? "e.g., Main Water Treatment Plant" : "e.g., Kitchen Sink Monitor"}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Location</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={deviceLocation}
                      onChange={e => setDeviceLocation(e.target.value)}
                      placeholder={isOfficial ? "e.g., District 1, Zone A" : "e.g., Kitchen, Main Floor"}
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    onClick={() => setShowAddDevice(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Adding...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-plus me-2"></i>
                        Add Device
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Water Quality Status Card */}
      {telemetryData && telemetryData.values && (
        <div className="row">
          <div className="col-12 mb-4">
            <div className="card">
              <div className="card-body text-center py-5">
                <div className={`status-indicator ${overallStatus}`}>
                  <div className="status-icon mb-3">
                    {overallStatus === 'safe' && (
                      <i className="fas fa-check-circle fa-4x text-success"></i>
                    )}
                    {overallStatus === 'unsafe' && (
                      <i className="fas fa-exclamation-triangle fa-4x text-danger"></i>
                    )}
                    {overallStatus === 'unknown' && (
                      <i className="fas fa-question-circle fa-4x text-warning"></i>
                    )}
                  </div>
                  
                  <h2 className={`status-title ${overallStatus}`}>
                    {overallStatus === 'safe' && 'Water Quality: SAFE'}
                    {overallStatus === 'unsafe' && 'Water Quality: NOT SAFE'}
                    {overallStatus === 'unknown' && 'Water Quality: UNKNOWN'}
                  </h2>
                  
                  <p className="status-description text-muted mb-4">
                    {overallStatus === 'safe' && 
                      'All water parameters are within safe limits. The water is safe for use.'}
                    {overallStatus === 'unsafe' && 
                      'One or more water parameters are outside safe limits. Please take necessary precautions.'}
                    {overallStatus === 'unknown' && 
                      'Unable to determine water quality status. Please check device connection.'}
                  </p>

                  {/* Last Updated Info */}
                  <div className="status-meta">
                    <small className="text-muted">
                      <i className="fas fa-clock me-1"></i>
                      Last updated: {new Date().toLocaleString()}
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Device Cards */}
      <div className="row">
        {devices.map((device, idx) => {
          // Find reading for this device
          const deviceReading = readings.find(r => r.device === device.name);
          const hasReading = deviceReading && deviceReading.reading;
          const deviceStatus = hasReading ? 
            (deviceReading.reading.is_safe ? 'safe' : 'unsafe') : 
            'unknown';

          return (
            <div className="col-lg-4 col-md-6 mb-4" key={device.id}>
              <div className="card h-100">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">
                    <i className="fas fa-microchip me-2 text-primary"></i>
                    {device.name}
                  </h5>
                  <span className={`badge bg-${getBatteryColor(deviceReading?.reading?.battery)}`}>
                    {hasReading ? `${deviceReading.reading.battery}% Battery` : 'No Data'}
                  </span>
                </div>
                <div className="card-body">
                  {/* Device Status Indicator */}
                  <div className={`device-status ${deviceStatus} text-center mb-4`}>
                    <div className="status-icon mb-2">
                      {deviceStatus === 'safe' && (
                        <i className="fas fa-check-circle fa-2x text-success"></i>
                      )}
                      {deviceStatus === 'unsafe' && (
                        <i className="fas fa-exclamation-triangle fa-2x text-danger"></i>
                      )}
                      {deviceStatus === 'unknown' && (
                        <i className="fas fa-question-circle fa-2x text-warning"></i>
                      )}
                    </div>
                    <h6 className={`status-text ${deviceStatus}`}>
                      {deviceStatus === 'safe' && 'SAFE TO USE'}
                      {deviceStatus === 'unsafe' && 'ATTENTION NEEDED'}
                      {deviceStatus === 'unknown' && 'NO DATA AVAILABLE'}
                    </h6>
                    {deviceStatus === 'unsafe' && deviceReading?.reading?.safety_message && (
                      <small className="text-danger d-block mt-1">
                        {deviceReading.reading.safety_message}
                      </small>
                    )}
                  </div>

                  {/* Device Info */}
                  <div className="device-info">
                    <div className="row text-center">
                      <div className="col-6">
                        <small className="text-muted d-block">Location</small>
                        <strong>{device.location || 'Not specified'}</strong>
                      </div>
                      <div className="col-6">
                        <small className="text-muted d-block">Battery</small>
                        <strong className={getBatteryTextColor(deviceReading?.reading?.battery)}>
                          {hasReading ? `${deviceReading.reading.battery}%` : 'N/A'}
                        </strong>
                      </div>
                    </div>
                  </div>

                  {/* Last Updated */}
                  {hasReading && (
                    <div className="mt-3 pt-3 border-top">
                      <small className="text-muted">
                        <i className="fas fa-clock me-1"></i>
                        Last updated: {new Date(deviceReading.reading.timestamp).toLocaleString()}
                      </small>
                    </div>
                  )}

                  {/* No Data State */}
                  {!hasReading && (
                    <div className="text-center py-3">
                      <div className="mb-2">
                        <i className="fas fa-microchip fa-2x text-primary"></i>
                      </div>
                      <p className="text-muted small mb-0">
                        Device connected. Waiting for data...
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State - No Devices */}
      {devices.length === 0 && (
        <div className="row">
          <div className="col-12">
            <div className="card text-center py-5">
              <div className="card-body">
                <i className="fas fa-microchip fa-3x text-primary mb-3"></i>
                <h5 className="card-title">No Devices Connected</h5>
                <p className="card-text text-muted">
                  {isOfficial 
                    ? 'Add your first monitoring device to start tracking water quality across your municipality.'
                    : 'Connect your FlowVeda device to start monitoring your home water quality.'
                  }
                </p>
                
                {/* Features Preview */}
                <div className="row g-3 mb-4">
                  <div className="col-md-4">
                    <div className="p-3 border rounded">
                      <i className="fas fa-check-circle fa-2x text-success mb-2"></i>
                      <h6 className="small">Safety Monitoring</h6>
                      <p className="small text-muted mb-0">Real-time water safety status</p>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="p-3 border rounded">
                      <i className="fas fa-bell fa-2x text-warning mb-2"></i>
                      <h6 className="small">Instant Alerts</h6>
                      <p className="small text-muted mb-0">Get notified when water is unsafe</p>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="p-3 border rounded">
                      <i className="fas fa-chart-line fa-2x text-info mb-2"></i>
                      <h6 className="small">Quality Tracking</h6>
                      <p className="small text-muted mb-0">Monitor water quality over time</p>
                    </div>
                  </div>
                </div>
                
                <button 
                  className="btn btn-primary btn-lg"
                  onClick={() => setShowAddDevice(true)}
                >
                  <i className="fas fa-plus me-2"></i>
                  Add Your First Device
                </button>
                
                <div className="mt-3">
                  <small className="text-muted">
                    <i className="fas fa-info-circle me-1"></i>
                    Once added, the system will automatically monitor water safety
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Official User Additional Features */}
      {isOfficial && readings.length > 0 && (
        <div className="row">
          <div className="col-12 mb-4">
            <div className="card">
              <div className="card-header">
                <h5 className="mb-0">
                  <i className="fas fa-chart-bar me-2 text-success"></i>
                  Municipal Overview
                </h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-3">
                    <div className="text-center">
                      <div className="h3 text-primary">{readings.length}</div>
                      <div className="text-muted">Active Devices</div>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="text-center">
                      <div className="h3 text-success">
                        {readings.filter(r => r.reading && r.reading.is_safe).length}
                      </div>
                      <div className="text-muted">Safe Water Sources</div>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="text-center">
                      <div className="h3 text-warning">
                        {readings.filter(r => r.reading && !r.reading.is_safe).length}
                      </div>
                      <div className="text-muted">Unsafe Alerts</div>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="text-center">
                      <div className="h3 text-info">
                        {readings.filter(r => r.reading && r.reading.battery > 20).length}
                      </div>
                      <div className="text-muted">Healthy Devices</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // Helper functions
  function getBatteryColor(batteryLevel) {
    if (batteryLevel === undefined || batteryLevel === null) return 'secondary';
    if (batteryLevel > 20) return 'success';
    if (batteryLevel > 10) return 'warning';
    return 'danger';
  }

  function getBatteryTextColor(batteryLevel) {
    if (batteryLevel === undefined || batteryLevel === null) return 'text-muted';
    if (batteryLevel > 20) return 'text-success';
    if (batteryLevel > 10) return 'text-warning';
    return 'text-danger';
  }
}

// Add CSS styles for the status indicators
const styles = `
.status-indicator.safe .status-title { color: #198754; }
.status-indicator.unsafe .status-title { color: #dc3545; }
.status-indicator.unknown .status-title { color: #ffc107; }

.device-status.safe { color: #198754; }
.device-status.unsafe { color: #dc3545; }
.device-status.unknown { color: #6c757d; }

.status-icon {
  transition: transform 0.3s ease;
}

.status-icon:hover {
  transform: scale(1.1);
}
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}