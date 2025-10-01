const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const config = require('../config');

class S3DataAccess {
  constructor() {
    this.s3Client = null;
    this.bucketName = config.AWS.S3_BUCKET_NAME;
    this.regionName = config.AWS.REGION;
    this.cacheTimeout = 300000; // 5 minutes in ms
    this.cache = {};

    // Initialize S3 client if credentials are available
    if (config.AWS.ACCESS_KEY_ID && config.AWS.SECRET_ACCESS_KEY) {
      try {
        this.s3Client = new AWS.S3({
          region: this.regionName,
          accessKeyId: config.AWS.ACCESS_KEY_ID,
          secretAccessKey: config.AWS.SECRET_ACCESS_KEY
        });
      } catch (error) {
        console.warn('S3 client initialization failed:', error.message);
      }
    }
  }

  async getCSVFromS3(fileKey) {
    try {
      // Try local file first
      const projectRoot = path.join(__dirname, '../..');
      const localPath = path.join(projectRoot, 'data', fileKey);

      if (fs.existsSync(localPath)) {
        return await this.readLocalCSV(localPath);
      }

      // If S3 client is available, try S3
      if (this.s3Client) {
        const params = {
          Bucket: this.bucketName,
          Key: fileKey
        };

        const data = await this.s3Client.getObject(params).promise();
        const csvString = data.Body.toString('utf-8');
        return await this.parseCSVString(csvString);
      }

      throw new Error(`File ${fileKey} not found locally and S3 client not available`);
    } catch (error) {
      console.error(`Error fetching ${fileKey}:`, error.message);
      throw error;
    }
  }

  async readLocalCSV(filePath) {
    return new Promise((resolve, reject) => {
      const rows = [];
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (row) => rows.push(row))
        .on('end', () => resolve(rows))
        .on('error', reject);
    });
  }

  async parseCSVString(csvString) {
    const { parse } = require('csv-parse/sync');
    const records = parse(csvString, {
      columns: true,
      skip_empty_lines: true
    });
    return records;
  }

  getCachedData(cacheKey) {
    const cached = this.cache[cacheKey];
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }
    return null;
  }

  setCachedData(cacheKey, data) {
    this.cache[cacheKey] = {
      data,
      timestamp: Date.now()
    };
  }

  async getWaterQualityData() {
    const cacheKey = 'water_quality_zone1';
    const cached = this.getCachedData(cacheKey);
    if (cached) return cached;

    try {
      const data = await this.getCSVFromS3('water_quality_zone1.csv');
      this.setCachedData(cacheKey, data);
      return data;
    } catch (error) {
      console.error('Error getting water quality data:', error.message);
      return [];
    }
  }

  async getBillingData() {
    const cacheKey = 'billing_zone1';
    const cached = this.getCachedData(cacheKey);
    if (cached) return cached;

    try {
      const data = await this.getCSVFromS3('final_billing_zone1.csv');
      this.setCachedData(cacheKey, data);
      return data;
    } catch (error) {
      console.error('Error getting billing data:', error.message);
      return [];
    }
  }

  async getZoneConsumptionData() {
    const cacheKey = 'zone_consumption_zone1';
    const cached = this.getCachedData(cacheKey);
    if (cached) return cached;

    try {
      const data = await this.getCSVFromS3('final_zone_consumption_zone1.csv');
      this.setCachedData(cacheKey, data);
      return data;
    } catch (error) {
      console.error('Error getting zone consumption data:', error.message);
      return [];
    }
  }

  async getTamperingData() {
    const cacheKey = 'tampering_zone1';
    const cached = this.getCachedData(cacheKey);
    if (cached) return cached;

    try {
      const data = await this.getCSVFromS3('final_tampering_zone1_daily.csv');
      this.setCachedData(cacheKey, data);
      return data;
    } catch (error) {
      console.error('Error getting tampering data:', error.message);
      return [];
    }
  }

  async getLatestWaterQuality() {
    const data = await this.getWaterQualityData();
    if (!data || data.length === 0) return null;

    // Sort by timestamp and get latest
    const sorted = data.sort((a, b) => {
      const timeA = a.timestamp || '';
      const timeB = b.timestamp || '';
      return timeB.localeCompare(timeA);
    });

    return sorted[0];
  }

  async getHouseholdBilling(householdId) {
    const data = await this.getBillingData();
    return data.find(record => record.user_id === householdId) || null;
  }

  async getMonthlyConsumptionTrend() {
    const data = await this.getZoneConsumptionData();
    if (!data || data.length === 0) return [];

    // Sort by month
    return data.sort((a, b) => {
      const monthA = a.month || '';
      const monthB = b.month || '';
      return monthA.localeCompare(monthB);
    });
  }

  async checkTamperingAlert(thresholdPercent = 10) {
    const data = await this.getTamperingData();
    if (!data || data.length === 0) return [false, null];

    // Get latest reading
    const sorted = data.sort((a, b) => {
      const dateA = a.date || '';
      const dateB = b.date || '';
      return dateB.localeCompare(dateA);
    });

    const latest = sorted[0];
    const waterReleased = parseFloat(latest.water_released_litres) || 0;
    const waterDelivered = parseFloat(latest.water_delivered_litres) || 0;

    if (waterDelivered === 0) return [false, null];

    const differencePercent = Math.abs(waterReleased - waterDelivered) / waterDelivered * 100;

    if (differencePercent > thresholdPercent) {
      return [true, {
        difference_percent: differencePercent,
        water_released: waterReleased,
        water_delivered: waterDelivered,
        timestamp: latest.date,
        threshold: thresholdPercent
      }];
    }

    return [false, null];
  }
}

// Global instance
const s3DataAccess = new S3DataAccess();

module.exports = { S3DataAccess, s3DataAccess };

