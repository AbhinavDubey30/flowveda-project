# Real-Time Water Quality Monitoring Implementation

## Overview
This implementation adds real-time water quality monitoring capabilities to the FlowVeda dashboard using CSV data from `dataset1.csv`. The system displays live parameter values with aesthetic gauges and provides time-series charts for detailed analysis.

## Files Created/Modified

### Backend
- **backend/api/csv_reader.py** - Updated with new functions:
  - `load_rows()` - Loads CSV data with sanitized column names
  - `detect_timestamp_column()` - Auto-detects timestamp column
  - `get_parameter_status()` - Calculates parameter status based on safe ranges
  - `get_latest_telemetry()` - Returns latest values and status for all parameters

- **backend/api/views.py** - Added new endpoints:
  - `TelemetryLatestView` - GET `/api/telemetry/latest/` - Latest values and status
  - `TelemetrySeriesView` - GET `/api/telemetry/series/` - Time-series data

- **backend/api/urls.py** - Added URL patterns for new endpoints

- **backend/api/data/dataset1.csv** - CSV data file moved to proper location

### Frontend
- **frontend/src/services/api.js** - Added functions:
  - `getLatest()` - Fetch latest telemetry data
  - `getSeries()` - Fetch time-series data for charts

- **frontend/src/components/ParameterGauge.js** - New component:
  - Visual gauge using react-gauge-chart
  - Shows parameter value, status, and range
  - Handles non-numeric values gracefully

- **frontend/src/components/ParameterChart.js** - New component:
  - Time-series line chart using Chart.js
  - Responsive design with tooltips
  - Latest value readout with status badge

- **frontend/src/components/Dashboard.js** - Updated:
  - Real-time parameter cards with gauges
  - 5-second polling for live updates
  - Modal charts for detailed analysis
  - Maintains existing device functionality

- **frontend/package.json** - Added dependency:
  - `react-gauge-chart` - For visual gauges

## API Endpoints

### GET /api/telemetry/latest/
Returns latest values and status for all parameters:
```json
{
  "timestamp": "2024-01-01T08:00:00",
  "values": {
    "pH": 7.4,
    "TDS": 238,
    "turbidity": 0.2,
    "chlorine": 2.1,
    "hardness": 114,
    "microbes": 0.08
  },
  "status": {
    "pH": "ok",
    "TDS": "ok",
    "turbidity": "ok",
    "chlorine": "ok",
    "hardness": "ok",
    "microbes": "ok"
  }
}
```

### GET /api/telemetry/series/?parameter=pH&limit=200
Returns time-series data for a specific parameter:
```json
[
  {
    "timestamp": "2024-01-01T00:00:00",
    "value": 7.2
  },
  {
    "timestamp": "2024-01-01T01:00:00",
    "value": 7.1
  }
]
```

## Safe Ranges & Status Logic

Parameters are evaluated against these safe ranges:
- **pH**: 6.5 - 8.5 (optimal range)
- **TDS**: 0 - 500 ppm (good quality)
- **Turbidity**: 0 - 1 NTU (clear water)
- **Chlorine**: 0.2 - 4.0 mg/L (safe disinfection)
- **Hardness**: 0 - 300 mg/L (soft water)
- **Microbes**: 0 - 0.1 (safe levels)

Status levels:
- **ok**: Within safe range
- **attention**: Within 10% margin outside safe range
- **unsafe**: Significantly outside safe range
- **unknown**: Non-numeric or missing data

## Features

### Real-Time Monitoring
- Dashboard polls `/api/telemetry/latest/` every 5 seconds
- Values update automatically without page refresh
- Visual gauges show current parameter status

### Visual Gauges
- Color-coded gauges (red/yellow/green)
- Shows current value, unit, and status
- Responsive design for mobile devices

### Time-Series Charts
- Click "View Chart" to open modal with detailed chart
- Shows last 200 data points by default
- Interactive tooltips with timestamp and value
- Responsive chart that adapts to screen size

### Accessibility
- ARIA labels for screen readers
- Keyboard navigation support
- High contrast status indicators

## Running the Application

### Backend
```bash
cd backend
python manage.py runserver
```
Backend runs on http://127.0.0.1:8000

### Frontend
```bash
cd frontend
npm install  # Install dependencies
npm start
```
Frontend runs on http://localhost:3000

## Dependencies Added
- `react-gauge-chart` - For visual parameter gauges
- `chart.js` and `react-chartjs-2` - Already present for charts

## CSV Data Location
The CSV file is located at: `backend/api/data/dataset1.csv`

The system automatically detects the timestamp column and sanitizes column names for consistent API responses.
