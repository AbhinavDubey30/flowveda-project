import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Set the API base URL for local development
const API_BASE = 'http://127.0.0.1:8000/api';

const ResidentDashboard = () => {
  const [waterQuality, setWaterQuality] = useState(null);
  const [billingData, setBillingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Mock household ID for demo purposes
  const householdId = 'User-1';

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch water quality data
      const qualityResponse = await axios.get(`${API_BASE}/water-quality/`);
      setWaterQuality(qualityResponse.data);

      // Fetch billing data
      const billingResponse = await axios.get(`${API_BASE}/billing/${householdId}/`);
      setBillingData(billingResponse.data);

    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    try {
      const response = await axios.post(`${API_BASE}/pay-bill/`, {
        household_id: householdId,
        amount: billingData?.amount_payable
      });
      
      if (response.data.status === 'success') {
        setPaymentSuccess(true);
        // Refresh billing data
        setTimeout(() => {
          fetchDashboardData();
          setPaymentSuccess(false);
        }, 3000);
      }
    } catch (err) {
      console.error('Payment failed:', err);
      alert('Payment failed. Please try again.');
    }
  };

  const getWaterQualityBadge = (contaminationLevel) => {
    switch (contaminationLevel) {
      case 1:
        return (
          <div className="water-quality-badge water-quality-safe">
            <span className="status-indicator status-safe"></span>
            Safe
          </div>
        );
      case 2:
        return (
          <div className="water-quality-badge water-quality-unsafe">
            <span className="status-indicator status-unsafe"></span>
            Unsafe – Check Advisory
          </div>
        );
      case 3:
        return (
          <div className="water-quality-badge water-quality-critical">
            <span className="status-indicator status-critical"></span>
            Water Supply Shut Off – Critical Contamination
          </div>
        );
      default:
        return (
          <div className="water-quality-badge water-quality-safe">
            <span className="status-indicator status-safe"></span>
            Safe
          </div>
        );
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

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
                <p className="mt-3">Loading your dashboard...</p>
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
            <i className="fas fa-home me-2"></i>
            Resident Dashboard
          </h1>
        </div>
      </div>

      {/* Water Quality Section */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="dashboard-card">
            <h3 className="text-dark-teal mb-3">
              <i className="fas fa-tint me-2"></i>
              Water Quality Status
            </h3>
            
            {waterQuality && (
              <div className="row">
                <div className="col-md-6">
                  <div className="text-center mb-3">
                    <h4 className="mb-3">Current Status</h4>
                    {getWaterQualityBadge(waterQuality.latest_reading?.contamination_level)}
                  </div>
                </div>
                
                <div className="col-md-6">
                  <div className="row">
                    <div className="col-6">
                      <div className="parameter-gauge">
                        <div className="gauge-container">
                          <div className="gauge-value">{waterQuality.latest_reading?.ph}</div>
                          <div className="gauge-label">pH Level</div>
                          <div className="gauge-range">Safe: 6.5 - 8.5</div>
                        </div>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="parameter-gauge">
                        <div className="gauge-container">
                          <div className="gauge-value">{waterQuality.latest_reading?.tds}</div>
                          <div className="gauge-label">TDS (mg/L)</div>
                          <div className="gauge-range">Safe: 0 - 500</div>
                        </div>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="parameter-gauge">
                        <div className="gauge-container">
                          <div className="gauge-value">{waterQuality.latest_reading?.turbidity}</div>
                          <div className="gauge-label">Turbidity (NTU)</div>
                          <div className="gauge-range">Safe: 0 - 1</div>
                        </div>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="parameter-gauge">
                        <div className="gauge-container">
                          <div className="gauge-value">{waterQuality.latest_reading?.chlorine}</div>
                          <div className="gauge-label">Chlorine (mg/L)</div>
                          <div className="gauge-range">Safe: 0.2 - 4.0</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div className="text-muted small mt-3">
              <i className="fas fa-clock me-1"></i>
              Last updated: {waterQuality?.latest_reading?.timestamp ? 
                new Date(waterQuality.latest_reading.timestamp).toLocaleString('en-IN') : 
                'Unknown'
              }
            </div>
          </div>
        </div>
      </div>

      {/* Billing Section */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="billing-card">
            <h3 className="text-dark-teal mb-3">
              <i className="fas fa-receipt me-2"></i>
              Billing Information
            </h3>
            
            {billingData ? (
              <div className="row">
                <div className="col-md-8">
                  <div className="row">
                    <div className="col-sm-6 mb-3">
                      <h5 className="text-muted mb-1">Household ID</h5>
                      <p className="h6">{billingData.user_id}</p>
                    </div>
                    <div className="col-sm-6 mb-3">
                      <h5 className="text-muted mb-1">Zone</h5>
                      <p className="h6">{billingData.zone_id}</p>
                    </div>
                    <div className="col-sm-6 mb-3">
                      <h5 className="text-muted mb-1">Month</h5>
                      <p className="h6">{billingData.month}</p>
                    </div>
                    <div className="col-sm-6 mb-3">
                      <h5 className="text-muted mb-1">Water Consumed</h5>
                      <p className="h6">{billingData.consumption_litres?.toLocaleString()} litres</p>
                    </div>
                    <div className="col-sm-6 mb-3">
                      <h5 className="text-muted mb-1">Amount Payable</h5>
                      <p className="h4 text-primary">{formatCurrency(billingData.amount_payable)}</p>
                    </div>
                    <div className="col-sm-6 mb-3">
                      <h5 className="text-muted mb-1">Due Date</h5>
                      <p className="h6">{formatDate(billingData.due_date)}</p>
                    </div>
                  </div>
                </div>
                
                <div className="col-md-4 text-center">
                  <div className="mb-3">
                    <button 
                      className="payment-button btn-lg w-100"
                      onClick={handlePayment}
                      disabled={paymentSuccess}
                    >
                      {paymentSuccess ? (
                        <>
                          <i className="fas fa-check me-2"></i>
                          Payment Successful!
                        </>
                      ) : (
                        <>
                          <i className="fas fa-credit-card me-2"></i>
                          Pay Now
                        </>
                      )}
                    </button>
                  </div>
                  
                  {paymentSuccess && (
                    <div className="alert alert-success">
                      <i className="fas fa-check-circle me-2"></i>
                      Payment processed successfully!
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-muted">No billing information available</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="row">
        <div className="col-12">
          <div className="dashboard-card">
            <h3 className="text-dark-teal mb-3">
              <i className="fas fa-bolt me-2"></i>
              Quick Actions
            </h3>
            
            <div className="row">
              <div className="col-md-3 mb-3">
                <button className="btn btn-outline-primary w-100">
                  <i className="fas fa-history me-2"></i>
                  View Usage History
                </button>
              </div>
              <div className="col-md-3 mb-3">
                <button className="btn btn-outline-info w-100">
                  <i className="fas fa-download me-2"></i>
                  Download Bill
                </button>
              </div>
              <div className="col-md-3 mb-3">
                <button className="btn btn-outline-warning w-100">
                  <i className="fas fa-exclamation-triangle me-2"></i>
                  Report Issue
                </button>
              </div>
              <div className="col-md-3 mb-3">
                <button className="btn btn-outline-secondary w-100">
                  <i className="fas fa-cog me-2"></i>
                  Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResidentDashboard;