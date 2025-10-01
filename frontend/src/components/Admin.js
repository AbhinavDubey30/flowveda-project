import React, { useState, useEffect } from 'react';

export default function Admin() {
  const [households, setHouseholds] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Sample household water usage data
  const sampleData = [
    { id: 1, deviceId: 'DEV001', householdName: 'Sharma Family', address: 'Sector 15, House No. 123', mobile: '+91 9876543210', currentUsage: 450, limit: 500, status: 'Normal' },
    { id: 2, deviceId: 'DEV002', householdName: 'Verma Residence', address: 'Sector 22, House No. 456', mobile: '+91 9876543211', currentUsage: 520, limit: 500, status: 'Exceeded' },
    { id: 3, deviceId: 'DEV003', householdName: 'Patel House', address: 'Sector 18, House No. 789', mobile: '+91 9876543212', currentUsage: 380, limit: 500, status: 'Normal' },
    { id: 4, deviceId: 'DEV004', householdName: 'Kumar Family', address: 'Sector 25, House No. 321', mobile: '+91 9876543213', currentUsage: 600, limit: 500, status: 'Exceeded' },
    { id: 5, deviceId: 'DEV005', householdName: 'Singh Residence', address: 'Sector 12, House No. 654', mobile: '+91 9876543214', currentUsage: 420, limit: 500, status: 'Normal' },
  ];

  useEffect(() => {
    // In real app, this would be an API call
    setHouseholds(sampleData);
  }, []);

  const filteredHouseholds = households.filter(household =>
    household.householdName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    household.deviceId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    household.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status) => {
    return status === 'Normal' ? 'badge bg-success' : 'badge bg-danger';
  };

  const getUsagePercentage = (usage, limit) => {
    return Math.min((usage / limit) * 100, 100);
  };

  const getProgressBarColor = (usage, limit) => {
    const percentage = (usage / limit) * 100;
    if (percentage <= 70) return 'bg-success';
    if (percentage <= 90) return 'bg-warning';
    return 'bg-danger';
  };

  const logout = () => {
    window.location.href = '/';
  };

  return (
    <div className="container-fluid">
      {/* Header */}
      <div className="row bg-primary text-white p-3 align-items-center">
        <div className="col-md-6">
          <h2 className="mb-0">
            <i className="fas fa-tachometer-alt me-2"></i>
            Authority Dashboard - Water Monitoring System
          </h2>
          <small>Municipal Water Board Administration Panel</small>
        </div>
        <div className="col-md-6 text-end">
          <button className="btn btn-light" onClick={logout}>
            <i className="fas fa-sign-out-alt me-2"></i>Logout
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="row mt-4">
        <div className="col-md-3 mb-3">
          <div className="card bg-info text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h4>{households.length}</h4>
                  <p>Total Households</p>
                </div>
                <i className="fas fa-home fa-3x"></i>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card bg-success text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h4>{households.filter(h => h.status === 'Normal').length}</h4>
                  <p>Within Limit</p>
                </div>
                <i className="fas fa-check-circle fa-3x"></i>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card bg-danger text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h4>{households.filter(h => h.status === 'Exceeded').length}</h4>
                  <p>Limit Exceeded</p>
                </div>
                <i className="fas fa-exclamation-triangle fa-3x"></i>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card bg-warning text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h4>{households.reduce((sum, h) => sum + h.currentUsage, 0)} L</h4>
                  <p>Total Water Usage</p>
                </div>
                <i className="fas fa-tint fa-3x"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="row mt-4">
        <div className="col-md-6">
          <div className="input-group">
            <span className="input-group-text">
              <i className="fas fa-search"></i>
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Search by household name, device ID, or address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="col-md-6 text-end">
          <button className="btn btn-primary me-2">
            <i className="fas fa-download me-2"></i>Export Report
          </button>
          <button className="btn btn-success">
            <i className="fas fa-sync-alt me-2"></i>Refresh Data
          </button>
        </div>
      </div>

      {/* Households Table */}
      <div className="row mt-4">
        <div className="col-12">
          <div className="card">
            <div className="card-header bg-dark text-white">
              <h5 className="mb-0">
                <i className="fas fa-list me-2"></i>
                Household Water Usage Monitoring
              </h5>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-striped table-hover">
                  <thead className="table-dark">
                    <tr>
                      <th>Device ID</th>
                      <th>Household Name</th>
                      <th>Address</th>
                      <th>Mobile</th>
                      <th>Current Usage (L)</th>
                      <th>Limit (L)</th>
                      <th>Usage %</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredHouseholds.map(household => (
                      <tr key={household.id}>
                        <td>
                          <strong>{household.deviceId}</strong>
                        </td>
                        <td>{household.householdName}</td>
                        <td>{household.address}</td>
                        <td>{household.mobile}</td>
                        <td>
                          <strong>{household.currentUsage}L</strong>
                        </td>
                        <td>{household.limit}L</td>
                        <td>
                          <div className="progress" style={{height: '8px'}}>
                            <div 
                              className={`progress-bar ${getProgressBarColor(household.currentUsage, household.limit)}`}
                              style={{width: `${getUsagePercentage(household.currentUsage, household.limit)}%`}}
                            ></div>
                          </div>
                          <small>{Math.round(getUsagePercentage(household.currentUsage, household.limit))}%</small>
                        </td>
                        <td>
                          <span className={getStatusBadge(household.status)}>
                            {household.status}
                          </span>
                        </td>
                        <td>
                          <button className="btn btn-sm btn-outline-primary me-1" title="Send Alert">
                            <i className="fas fa-bell"></i>
                          </button>
                          <button className="btn btn-sm btn-outline-warning me-1" title="View Details">
                            <i className="fas fa-eye"></i>
                          </button>
                          <button className="btn btn-sm btn-outline-danger" title="Cut Supply">
                            <i className="fas fa-ban"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="row mt-4">
        <div className="col-12 text-center">
          <p className="text-muted">
            &copy; 2024 Municipal Water Board - FlowVeda Water Management System
          </p>
        </div>
      </div>
    </div>
  );
}