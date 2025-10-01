import React from 'react';

const ParameterGauge = ({ 
  parameter, 
  value, 
  status, 
  minValue = 0, 
  maxValue = 100, 
  unit = '',
  className = '' 
}) => {
  // Convert value to number for gauge
  const numericValue = parseFloat(value);
  
  // Handle non-numeric values
  if (isNaN(numericValue)) {
    return (
      <div className={`parameter-gauge ${className}`}>
        <div className="gauge-container">
          <div className="gauge-value">N/A</div>
          <div className="gauge-label">{unit}</div>
          <div className="gauge-status text-muted">No data</div>
        </div>
      </div>
    );
  }

  // Calculate percentage for gauge (0-100)
  const percentage = Math.max(0, Math.min(100, ((numericValue - minValue) / (maxValue - minValue)) * 100));
  
  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'ok': return '#28a745'; // green
      case 'attention': return '#ffc107'; // amber
      case 'unsafe': return '#dc3545'; // red
      default: return '#6c757d'; // gray
    }
  };

  // Get status text
  const getStatusText = (status) => {
    switch (status) {
      case 'ok': return 'Normal';
      case 'attention': return 'Attention';
      case 'unsafe': return 'Unsafe';
      default: return 'Unknown';
    }
  };

  return (
    <div className={`parameter-gauge ${className}`}>
      <div className="gauge-container">
        {/* Custom CSS Gauge */}
        <div className="custom-gauge" style={{ 
          width: '120px', 
          height: '120px', 
          margin: '0 auto',
          position: 'relative'
        }}>
          <svg width="120" height="120" viewBox="0 0 120 120" style={{ transform: 'rotate(-90deg)' }}>
            {/* Background circle */}
            <circle
              cx="60"
              cy="60"
              r="50"
              fill="none"
              stroke="#e9ecef"
              strokeWidth="8"
            />
            {/* Progress circle */}
            <circle
              cx="60"
              cy="60"
              r="50"
              fill="none"
              stroke={getStatusColor(status)}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${percentage * 3.14} 314`}
              style={{ transition: 'stroke-dasharray 0.5s ease' }}
            />
          </svg>
          {/* Center text */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#333' }}>
              {numericValue.toFixed(1)}
            </div>
            <div style={{ fontSize: '12px', color: '#666' }}>
              {unit}
            </div>
          </div>
        </div>
        
        <div className="gauge-value mt-2">
          {numericValue.toFixed(2)}
        </div>
        <div className="gauge-label">{unit}</div>
        <div className={`gauge-status ${status === 'ok' ? 'text-success' : status === 'attention' ? 'text-warning' : status === 'unsafe' ? 'text-danger' : 'text-muted'}`}>
          {getStatusText(status)}
        </div>
        <div className="gauge-range">{minValue} - {maxValue}</div>
      </div>
    </div>
  );
};

export default ParameterGauge;
