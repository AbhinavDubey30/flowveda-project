"""
Configuration settings for FlowVeda Water Management System
"""

# Django Settings
SECRET_KEY = 'django-insecure-flowveda-water-management-system-2024'
DEBUG = True
ALLOWED_HOSTS = ['localhost', '127.0.0.1', '0.0.0.0']

# Water Quality Thresholds
WATER_QUALITY_THRESHOLDS = {
    'ph': {
        'min': 6.5,
        'max': 8.5,
        'unit': 'pH'
    },
    'tds': {
        'min': 0,
        'max': 500,
        'unit': 'mg/L'
    },
    'turbidity': {
        'min': 0,
        'max': 1,
        'unit': 'NTU'
    },
    'chlorine': {
        'min': 0.2,
        'max': 4.0,
        'unit': 'mg/L'
    }
}

# Contamination Levels
CONTAMINATION_LEVELS = {
    1: {
        'status': 'safe',
        'message': 'Safe',
        'color': 'green',
        'description': 'Water is safe for consumption'
    },
    2: {
        'status': 'unsafe',
        'message': 'Unsafe – Check Advisory',
        'color': 'yellow',
        'description': 'Water quality issues detected, check advisory'
    },
    3: {
        'status': 'critical',
        'message': 'Water Supply Shut Off – Critical Contamination',
        'color': 'red',
        'description': 'Critical contamination detected, water supply shut off'
    }
}

# Tampering Detection Settings
TAMPERING_SETTINGS = {
    'default_threshold_percent': 10,
    'min_threshold_percent': 1,
    'max_threshold_percent': 50,
    'alert_message': '⚠ Possible Tampering Detected in Zone-1'
}

# Zone Configuration
ZONE_CONFIG = {
    'zone_1': {
        'name': 'Zone 1',
        'coordinates': [28.6139, 77.2090],  # Delhi coordinates as example
        'zoom_level': 13,
        'total_households': 250,
        'active_sensors': 12
    }
}

# Dashboard Settings
DASHBOARD_SETTINGS = {
    'cache_timeout_minutes': 5,
    'chart_height': 256,
    'map_height': 384,
    'refresh_interval_seconds': 30
}

# Authentication Settings
AUTH_SETTINGS = {
    'admin_credentials': {
        'email': 'admin@municipality.gov.in',
        'password': 'admin123'
    },
    'session_timeout_minutes': 60
}

# CSV File Configuration
CSV_CONFIG = {
    'water_quality_file': 'water_quality_zone1.csv',
    'billing_file': 'final_billing_zone1.csv',
    'consumption_file': 'final_zone_consumption_zone1.csv',
    'tampering_file': 'final_tampering_zone1_daily.csv'
}

# API Settings
API_SETTINGS = {
    'default_limit': 200,
    'max_limit': 1000,
    'rate_limit_per_minute': 100
}

# Notification Settings
NOTIFICATION_SETTINGS = {
    'water_quality_alerts': True,
    'tampering_alerts': True,
    'billing_reminders': True,
    'system_maintenance': True
}

# System Statistics (Mock data for demo)
SYSTEM_STATS = {
    'avg_response_time_seconds': 2.3,
    'system_uptime_percent': 99.8,
    'total_zones': 1,
    'total_sensors': 12,
    'total_households': 250
}