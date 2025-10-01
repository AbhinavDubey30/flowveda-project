import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import 'leaflet/dist/leaflet.css';

// Set the API base URL for local development
const API_BASE = '/api';

const AdminDashboard = () => {
  const [waterQuality, setWaterQuality] = useState(null);
  const [consumptionData, setConsumptionData] = useState(null);
  const [tamperingAlert, setTamperingAlert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [threshold, setThreshold] = useState(10);

  useEffect(() => {
    fetchDashboardData();
  }, [threshold]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch water quality data
      const qualityResponse = await axios.get(`${API_BASE}/water-quality`);
      setWaterQuality(qualityResponse.data);

      // Fetch consumption data
      const consumptionResponse = await axios.get(`${API_BASE}/zone-consumption`);
      setConsumptionData(consumptionResponse.data);

      // Fetch tampering alert
      const tamperingResponse = await axios.get(`${API_BASE}/tampering-alert?threshold=${threshold}`);
      setTamperingAlert(tamperingResponse.data);

    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getZoneColor = (contaminationLevel) => {
    switch (contaminationLevel) {
      case 1: return '#10b981'; // green
      case 2: return '#f59e0b'; // yellow
      case 3: return '#ef4444'; // red
      default: return '#10b981';
    }
  };

  const getZoneStatusText = (contaminationLevel) => {
    switch (contaminationLevel) {
      case 1: return 'Safe';
      case 2: return 'Unsafe';
      case 3: return 'Critical';
      default: return 'Safe';
    }
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-IN').format(num);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  // Mock coordinates for Zone-1 (you can replace with actual coordinates)
  const zoneCoordinates = [28.6139, 77.2090]; // Delhi coordinates as example

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card">
              <div className="card-body text-center">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3">Loading admin dashboard...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-4">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="alert alert-danger" role="alert">
              <h4 className="alert-heading">Error</h4>
              <p>{error}</p>
              <button className="btn btn-outline-danger" onClick={fetchDashboardData}>
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-12">
          <h1 className="text-dark-navy mb-4">
            <i className="fas fa-shield-alt me-2"></i>
            Admin Dashboard - Zone 1 Management
          </h1>
        </div>
      </div>

      {/* Tampering Alert */}
      {tamperingAlert?.tampering_detected && (
        <div className="row mb-4">
          <div className="col-12">
            <div className="alert-banner alert-tampering">
              <i className="fas fa-exclamation-triangle me-2"></i>
              ⚠ Possible Tampering Detected in Zone-1
              <br />
              <small>
                Difference: {tamperingAlert.alert_data?.difference_percent?.toFixed(1)}% 
                (Threshold: {tamperingAlert.threshold_percent}%)
                <br />
                Water Released: {formatNumber(tamperingAlert.alert_data?.water_released)} L
                | Water Delivered: {formatNumber(tamperingAlert.alert_data?.water_delivered)} L
              </small>
            </div>
          </div>
        </div>
      )}

      {/* Contamination Map */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="dashboard-card">
            <h3 className="text-dark-teal mb-3">
              <i className="fas fa-map-marked-alt me-2"></i>
              Contamination Map - Zone 1
            </h3>
            
            <div className="map-container">
              <MapContainer
                center={zoneCoordinates}
                zoom={13}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <CircleMarker
                  center={zoneCoordinates}
                  radius={20}
                  pathOptions={{
                    fillColor: getZoneColor(waterQuality?.latest_reading?.contamination_level),
                    color: '#000',
                    weight: 2,
                    opacity: 1,
                    fillOpacity: 0.8
                  }}
                >
                  <Popup>
                    <div>
                      <h6>Zone 1 Water Quality</h6>
                      <p><strong>Status:</strong> {getZoneStatusText(waterQuality?.latest_reading?.contamination_level)}</p>
                      <p><strong>pH:</strong> {waterQuality?.latest_reading?.ph}</p>
                      <p><strong>TDS:</strong> {waterQuality?.latest_reading?.tds} mg/L</p>
                      <p><strong>Turbidity:</strong> {waterQuality?.latest_reading?.turbidity} NTU</p>
                      <p><strong>Chlorine:</strong> {waterQuality?.latest_reading?.chlorine} mg/L</p>
                      <p><strong>Last Updated:</strong> {waterQuality?.latest_reading?.timestamp ? 
                        new Date(waterQuality.latest_reading.timestamp).toLocaleString('en-IN') : 
                        'Unknown'
                      }</p>
                    </div>
                  </Popup>
                </CircleMarker>
              </MapContainer>
            </div>
            
            <div className="mt-3">
              <div className="row text-center">
                <div className="col-md-4">
                  <div className="status-indicator status-safe me-2"></div>
                  <span className="small">Safe (Level 1)</span>
                </div>
                <div className="col-md-4">
                  <div className="status-indicator status-unsafe me-2"></div>
                  <span className="small">Unsafe (Level 2)</span>
                </div>
                <div className="col-md-4">
                  <div className="status-indicator status-critical me-2"></div>
                  <span className="small">Critical (Level 3)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Usage & Forecast */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="dashboard-card">
            <h3 className="text-dark-teal mb-3">
              <i className="fas fa-chart-bar me-2"></i>
              Monthly Usage & Forecast
            </h3>
            
            {consumptionData && (
              <div className="chart-container">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={consumptionData.historical_data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value) => [formatNumber(value), 'Consumption (L)']}
                      labelFormatter={(label) => `Month: ${label}`}
                    />
                    <Bar dataKey="total_consumption_litres" fill="#0ea5e9" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
            
            {consumptionData?.forecast && (
              <div className="row mt-4">
                <div className="col-md-4">
                  <div className="text-center">
                    <h5 className="text-muted">Next Month Forecast</h5>
                    <h3 className="text-primary">
                      {formatNumber(consumptionData.forecast.next_month_predicted)} L
                    </h3>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="text-center">
                    <h5 className="text-muted">Trend</h5>
                    <h4 className={`${consumptionData.forecast.trend === 'increasing' ? 'text-danger' : 
                      consumptionData.forecast.trend === 'decreasing' ? 'text-success' : 'text-warning'}`}>
                      <i className={`fas fa-arrow-${consumptionData.forecast.trend === 'increasing' ? 'up' : 
                        consumptionData.forecast.trend === 'decreasing' ? 'down' : 'right'} me-2`}></i>
                      {consumptionData.forecast.trend}
                    </h4>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="text-center">
                    <h5 className="text-muted">Slope</h5>
                    <h4 className="text-info">
                      {consumptionData.forecast.slope > 0 ? '+' : ''}{consumptionData.forecast.slope}
                    </h4>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tampering Detection Settings */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="dashboard-card">
            <h3 className="text-dark-teal mb-3">
              <i className="fas fa-cog me-2"></i>
              Tampering Detection Settings
            </h3>
            
            <div className="row">
              <div className="col-md-6">
                <label htmlFor="threshold" className="form-label">
                  Tampering Threshold (%)
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="threshold"
                  value={threshold}
                  onChange={(e) => setThreshold(parseFloat(e.target.value))}
                  min="1"
                  max="50"
                  step="1"
                />
                <div className="form-text">
                  Alert when water released vs delivered difference exceeds this percentage
                </div>
              </div>
              
              <div className="col-md-6">
                <div className="mt-4">
                  <h5>Current Status</h5>
                  <div className={`alert ${tamperingAlert?.tampering_detected ? 'alert-danger' : 'alert-success'}`}>
                    <i className={`fas fa-${tamperingAlert?.tampering_detected ? 'exclamation-triangle' : 'check-circle'} me-2`}></i>
                    {tamperingAlert?.tampering_detected ? 'Tampering Detected' : 'No Tampering Detected'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* System Statistics */}
      <div className="row">
        <div className="col-12">
          <div className="dashboard-card">
            <h3 className="text-dark-teal mb-3">
              <i className="fas fa-chart-line me-2"></i>
              System Statistics
            </h3>
            
            <div className="row">
              <div className="col-md-3 mb-3">
                <div className="text-center">
                  <h5 className="text-muted">Total Households</h5>
                  <h3 className="text-primary">250</h3>
                </div>
              </div>
              <div className="col-md-3 mb-3">
                <div className="text-center">
                  <h5 className="text-muted">Active Sensors</h5>
                  <h3 className="text-success">12</h3>
                </div>
              </div>
              <div className="col-md-3 mb-3">
                <div className="text-center">
                  <h5 className="text-muted">Avg. Response Time</h5>
                  <h3 className="text-info">2.3s</h3>
                </div>
              </div>
              <div className="col-md-3 mb-3">
                <div className="text-center">
                  <h5 className="text-muted">System Uptime</h5>
                  <h3 className="text-warning">99.8%</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;