# FlowVeda Water Management Dashboard

A comprehensive two-role web dashboard system for water quality monitoring, billing management, and administrative oversight in Zone-1 water distribution systems.

## 🌊 Features

### Resident Dashboard (`/user`)
- **Water Quality Badge**: Real-time contamination level indicators
  - 🟢 Safe (Level 1)
  - 🟡 Unsafe – Check Advisory (Level 2) 
  - 🔴 Water Supply Shut Off – Critical Contamination (Level 3)
- **Billing Section**: Monthly consumption, amount payable, due dates
- **Payment Processing**: One-click bill payment with success confirmation
- **Mobile-friendly**: Responsive design optimized for all devices

### Admin Dashboard (`/admin`)
- **Contamination Map**: Interactive Leaflet.js map showing Zone-1 status
- **Monthly Usage & Forecast**: Recharts visualization with trend analysis
- **Tampering Detection**: Configurable alerts for water_released vs water_delivered discrepancies
- **System Statistics**: Real-time monitoring of sensors and system health

## 🏗️ Architecture

### Tech Stack
- **Backend**: Django REST Framework
- **Frontend**: React.js with Tailwind CSS
- **Charts**: Recharts for data visualization
- **Maps**: Leaflet.js with React-Leaflet
- **Data**: CSV files (ready for AWS S3 integration)

### Data Sources
- `water_quality_zone1.csv` - Hourly water quality readings
- `final_billing_zone1.csv` - Monthly household billing data
- `final_zone_consumption_zone1.csv` - Zone consumption trends
- `final_tampering_zone1_daily.csv` - Tampering detection data

## 🚀 Quick Start

### Prerequisites
- Python 3.9+
- Node.js 16+
- pip and npm

### Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Create and activate virtual environment**:
   ```bash
   python -m venv venv
   # Windows
   venv\Scripts\activate
   # macOS/Linux
   source venv/bin/activate
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Run database migrations**:
   ```bash
   python manage.py migrate
   ```

5. **Start Django server**:
   ```bash
   python manage.py runserver
   ```

The backend API will be available at `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start React development server**:
   ```bash
   npm start
   ```

The frontend will be available at `http://localhost:3000`

## 🔐 Authentication

### Admin Access
- **Email**: `admin@municipality.gov.in`
- **Password**: `admin123`
- **Dashboard**: `/admin` - Full administrative access

### Resident Access
- **Device ID**: Any valid device ID from billing data
- **Mobile**: Any mobile number (demo mode)
- **Dashboard**: `/user` - Household user interface

## 📊 Data Configuration

### Water Quality Thresholds
Configure thresholds in `backend/config.py`:

```python
WATER_QUALITY_THRESHOLDS = {
    'ph': {'min': 6.5, 'max': 8.5},
    'tds': {'min': 0, 'max': 500},
    'turbidity': {'min': 0, 'max': 1},
    'chlorine': {'min': 0.2, 'max': 4.0}
}
```

### Tampering Detection
```python
TAMPERING_SETTINGS = {
    'default_threshold_percent': 10,
    'min_threshold_percent': 1,
    'max_threshold_percent': 50
}
```

## 🗂️ Project Structure

```
flowveda_project/
├── backend/
│   ├── api/
│   │   ├── models.py          # Django models
│   │   ├── views.py           # API endpoints
│   │   ├── s3_data_access.py # Data access layer
│   │   └── urls.py           # URL routing
│   ├── config.py             # Configuration settings
│   ├── manage.py             # Django management
│   └── requirements.txt      # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ResidentDashboard.js  # User dashboard
│   │   │   ├── AdminDashboard.js     # Admin dashboard
│   │   │   └── Login.js              # Authentication
│   │   ├── styles.css        # Tailwind + custom styles
│   │   └── App.js            # Main app component
│   ├── package.json          # Node dependencies
│   └── tailwind.config.js   # Tailwind configuration
├── data/
│   ├── water_quality_zone1.csv
│   ├── final_billing_zone1.csv
│   ├── final_zone_consumption_zone1.csv
│   └── final_tampering_zone1_daily.csv
└── README_WATER_DASHBOARD.md
```

## 🔌 API Endpoints

### Water Quality
- `GET /api/water-quality/` - Latest water quality data

### Billing
- `GET /api/billing/{household_id}/` - Household billing info
- `POST /api/pay-bill/` - Process payment

### Consumption
- `GET /api/zone-consumption/` - Monthly consumption with forecast

### Tampering
- `GET /api/tampering-alert/?threshold=10` - Tampering detection

## 🎨 UI Components

### Water Quality Badge
```jsx
<div className="water-quality-badge water-quality-safe">
  <span className="status-indicator status-safe"></span>
  Safe
</div>
```

### Dashboard Cards
```jsx
<div className="dashboard-card">
  <h3>Section Title</h3>
  {/* Content */}
</div>
```

### Interactive Map
```jsx
<MapContainer center={coordinates} zoom={13}>
  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
  <CircleMarker center={coordinates} radius={20} />
</MapContainer>
```

## 🔧 Customization

### Adding New Zones
1. Update `ZONE_CONFIG` in `backend/config.py`
2. Add corresponding CSV files in `data/` directory
3. Update map coordinates and zone references

### Modifying Thresholds
Edit `backend/config.py` to adjust:
- Water quality parameters
- Tampering detection sensitivity
- Alert thresholds

### Styling Changes
- Modify `frontend/src/styles.css` for custom styles
- Update `frontend/tailwind.config.js` for theme changes
- Use Tailwind utility classes for rapid styling

## 🚀 Production Deployment

### Environment Variables
Create `.env` file in backend directory:

```env
AWS_S3_BUCKET_NAME=your-bucket-name
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=us-east-1
CSV_CACHE_TIMEOUT=300
```

### Database
- Configure PostgreSQL for production
- Update `backend/flowveda/settings.py` with production database settings

### Static Files
```bash
cd frontend
npm run build
# Serve build/ directory with your web server
```

### AWS S3 Integration
1. Upload CSV files to S3 bucket
2. Configure IAM permissions
3. Update `backend/api/s3_data_access.py` with production settings

## 🐛 Troubleshooting

### Common Issues

**Frontend not loading data**:
- Check if backend server is running on port 8000
- Verify API endpoints in browser network tab
- Check CORS settings in Django

**Map not displaying**:
- Ensure Leaflet CSS is imported
- Check console for JavaScript errors
- Verify map container has proper dimensions

**CSV data not loading**:
- Check file paths in `data/` directory
- Verify CSV file format and headers
- Check Django logs for file access errors

### Debug Mode
Enable Django debug mode in `backend/flowveda/settings.py`:
```python
DEBUG = True
```

## 📈 Performance Optimization

### Caching
- CSV data is cached for 5 minutes by default
- Adjust `CSV_CACHE_TIMEOUT` in configuration
- Use Redis for production caching

### Data Loading
- Implement pagination for large datasets
- Use database indexing for frequent queries
- Consider data aggregation for historical data

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the troubleshooting section
- Review API documentation

---

**FlowVeda Water Management Dashboard** - Ensuring clean water for all communities 🌊