/**
 * Frontend Integration Code for Water Quality Sensor Data API
 * This code can be integrated into your existing website
 */

class WaterQualityAPI {
    constructor(apiEndpoint) {
        this.apiEndpoint = apiEndpoint;
        this.cache = new Map();
        this.cacheTimeout = 5 * 60 * 1000; // 5 minutes cache
    }

    /**
     * Fetch sensor data from the API
     * @param {Object} options - Query options
     * @param {number} options.limit - Number of records to fetch
     * @param {number} options.offset - Number of records to skip
     * @param {boolean} options.useCache - Whether to use cached data
     * @returns {Promise<Object>} Sensor data response
     */
    async fetchSensorData(options = {}) {
        const { limit, offset, useCache = true } = options;
        const cacheKey = `sensor-data-${limit || 'all'}-${offset || 0}`;

        // Check cache first
        if (useCache && this.cache.has(cacheKey)) {
            const cached = this.cache.get(cacheKey);
            if (Date.now() - cached.timestamp < this.cacheTimeout) {
                console.log('Using cached sensor data');
                return cached.data;
            }
        }

        try {
            // Build query parameters
            const params = new URLSearchParams();
            if (limit) params.append('limit', limit);
            if (offset) params.append('offset', offset);

            const url = `${this.apiEndpoint}/sensor-data${params.toString() ? '?' + params.toString() : ''}`;
            
            console.log('Fetching sensor data from:', url);
            
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            // Cache the response
            this.cache.set(cacheKey, {
                data: data,
                timestamp: Date.now()
            });

            return data;
        } catch (error) {
            console.error('Error fetching sensor data:', error);
            throw error;
        }
    }

    /**
     * Get latest sensor readings (most recent data)
     * @param {number} count - Number of latest readings to fetch
     * @returns {Promise<Array>} Array of latest sensor readings
     */
    async getLatestReadings(count = 10) {
        const data = await this.fetchSensorData({ limit: count });
        return data.data;
    }

    /**
     * Get sensor data for a specific time range
     * @param {Date} startDate - Start date
     * @param {Date} endDate - End date
     * @returns {Promise<Array>} Filtered sensor data
     */
    async getDataByDateRange(startDate, endDate) {
        const data = await this.fetchSensorData();
        
        return data.data.filter(reading => {
            const readingDate = new Date(reading.timestamp);
            return readingDate >= startDate && readingDate <= endDate;
        });
    }

    /**
     * Get average values for all parameters
     * @param {Array} data - Sensor data array
     * @returns {Object} Average values for each parameter
     */
    calculateAverages(data) {
        if (!data || data.length === 0) return {};

        const parameters = ['ph', 'tds', 'turbidity', 'chlorine', 'hardness', 'microbes', 'flow_rate', 'battery'];
        const averages = {};

        parameters.forEach(param => {
            const values = data.map(reading => reading[param]).filter(val => val !== null && val !== undefined);
            if (values.length > 0) {
                averages[param] = values.reduce((sum, val) => sum + val, 0) / values.length;
            }
        });

        return averages;
    }

    /**
     * Clear the cache
     */
    clearCache() {
        this.cache.clear();
        console.log('Cache cleared');
    }
}

// Example usage and integration code
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the API client
    // Replace with your actual API Gateway endpoint
    const API_ENDPOINT = 'https://your-api-id.execute-api.your-region.amazonaws.com/dev';
    const waterQualityAPI = new WaterQualityAPI(API_ENDPOINT);

    // Example: Display latest sensor readings
    async function displayLatestReadings() {
        try {
            const data = await waterQualityAPI.getLatestReadings(5);
            console.log('Latest sensor readings:', data);
            
            // Update your HTML elements here
            updateSensorDisplay(data);
        } catch (error) {
            console.error('Failed to fetch latest readings:', error);
            showError('Failed to load sensor data');
        }
    }

    // Example: Update sensor display in HTML
    function updateSensorDisplay(readings) {
        const container = document.getElementById('sensor-readings');
        if (!container) return;

        container.innerHTML = readings.map(reading => `
            <div class="sensor-reading">
                <h4>${new Date(reading.timestamp).toLocaleString()}</h4>
                <div class="sensor-values">
                    <span>pH: ${reading.ph?.toFixed(2) || 'N/A'}</span>
                    <span>TDS: ${reading.tds || 'N/A'}</span>
                    <span>Turbidity: ${reading.turbidity?.toFixed(2) || 'N/A'}</span>
                    <span>Chlorine: ${reading.chlorine?.toFixed(2) || 'N/A'}</span>
                    <span>Hardness: ${reading.hardness || 'N/A'}</span>
                    <span>Flow Rate: ${reading.flow_rate?.toFixed(2) || 'N/A'}</span>
                    <span>Battery: ${reading.battery || 'N/A'}%</span>
                </div>
            </div>
        `).join('');
    }

    // Example: Show error message
    function showError(message) {
        const errorDiv = document.getElementById('error-message');
        if (errorDiv) {
            errorDiv.textContent = message;
            errorDiv.style.display = 'block';
        }
    }

    // Example: Auto-refresh data every 5 minutes
    setInterval(displayLatestReadings, 5 * 60 * 1000);

    // Initial load
    displayLatestReadings();

    // Make API available globally for other scripts
    window.waterQualityAPI = waterQualityAPI;
});

// Example HTML structure to add to your website:
/*
<div id="sensor-readings">
    <!-- Sensor readings will be populated here -->
</div>

<div id="error-message" style="display: none; color: red;">
    <!-- Error messages will be shown here -->
</div>

<button onclick="window.waterQualityAPI.clearCache()">Refresh Data</button>
*/
