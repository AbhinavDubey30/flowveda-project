import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const ParameterChart = ({ 
  parameter, 
  data, 
  latestValue, 
  status, 
  unit = '',
  className = '' 
}) => {
  if (!data || data.length === 0) {
    return (
      <div className={`parameter-chart ${className}`}>
        <div className="text-center py-4">
          <p className="text-muted">No data available for {parameter}</p>
        </div>
      </div>
    );
  }

  // Prepare chart data
  const chartData = {
    labels: data.map(item => {
      // Format timestamp for display
      try {
        const date = new Date(item.timestamp);
        return date.toLocaleTimeString();
      } catch (e) {
        return item.timestamp;
      }
    }),
    datasets: [
      {
        label: parameter,
        data: data.map(item => item.value),
        borderColor: getParameterColor(parameter),
        backgroundColor: getParameterColor(parameter) + '20',
        tension: 0.1,
        fill: true,
        pointRadius: 3,
        pointHoverRadius: 5,
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: `${parameter} Over Time`,
        font: {
          size: 16,
          weight: 'bold'
        }
      },
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          title: (context) => {
            const dataIndex = context[0].dataIndex;
            const item = data[dataIndex];
            try {
              const date = new Date(item.timestamp);
              return date.toLocaleString();
            } catch (e) {
              return item.timestamp;
            }
          },
          label: (context) => {
            return `${parameter}: ${context.parsed.y.toFixed(2)}${unit ? ' ' + unit : ''}`;
          }
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Time',
          font: {
            weight: 'bold'
          }
        },
        grid: {
          color: 'rgba(0,0,0,0.1)'
        }
      },
      y: {
        title: {
          display: true,
          text: parameter + (unit ? ` (${unit})` : ''),
          font: {
            weight: 'bold'
          }
        },
        grid: {
          color: 'rgba(0,0,0,0.1)'
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index'
    }
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'ok': return '#28a745';
      case 'attention': return '#ffc107';
      case 'unsafe': return '#dc3545';
      default: return '#6c757d';
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
    <div className={`parameter-chart ${className}`}>
      {/* Latest value readout */}
      <div className="mb-3 p-3 bg-light rounded">
        <div className="row align-items-center">
          <div className="col-md-6">
            <h6 className="mb-1">Latest Value</h6>
            <div className="h4 mb-0">
              {latestValue !== undefined ? latestValue.toFixed(2) : 'N/A'}
              {unit && <small className="text-muted ms-1">{unit}</small>}
            </div>
          </div>
          <div className="col-md-6 text-end">
            <span 
              className={`badge fs-6 ${
                status === 'ok' ? 'bg-success' : 
                status === 'attention' ? 'bg-warning' : 
                status === 'unsafe' ? 'bg-danger' : 'bg-secondary'
              }`}
            >
              {getStatusText(status)}
            </span>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div style={{ height: '400px' }}>
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

// Helper function to get parameter color
function getParameterColor(parameter) {
  const colors = {
    'pH': 'rgb(54, 162, 235)',
    'TDS': 'rgb(75, 192, 192)',
    'turbidity': 'rgb(255, 206, 86)',
    'chlorine': 'rgb(153, 102, 255)',
    'hardness': 'rgb(255, 159, 64)',
    'microbes': 'rgb(255, 99, 132)',
    'microbial proxy': 'rgb(255, 99, 132)',
    'flow_rate': 'rgb(34, 197, 94)',
    'battery': 'rgb(99, 102, 241)'
  };
  return colors[parameter] || 'rgb(54, 162, 235)';
}

export default ParameterChart;
