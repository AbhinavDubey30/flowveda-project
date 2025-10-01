const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

// Try multiple possible paths for CSV files (for different deployment contexts)
function findCSVPath() {
  const possiblePaths = [
    path.join(__dirname, '../api/data/dataset1.csv'),  // backend/api/data
    path.join(__dirname, '../../backend/api/data/dataset1.csv'),  // from api/ folder
    path.join(__dirname, '../../data/dataset1.csv'),  // root data folder
    path.join(__dirname, '../../dataset1.csv'),  // root level
  ];
  
  for (const csvPath of possiblePaths) {
    if (fs.existsSync(csvPath)) {
      console.log(`✅ Found CSV at: ${csvPath}`);
      return csvPath;
    }
  }
  
  console.error('❌ CSV file not found in any of these locations:');
  possiblePaths.forEach(p => console.error(`  - ${p}`));
  return possiblePaths[0]; // Return first path as fallback
}

const CSV_PATH = findCSVPath();

// Load CSV rows
function loadRows() {
  return new Promise((resolve, reject) => {
    const rows = [];
    
    if (!fs.existsSync(CSV_PATH)) {
      return reject(new Error(`CSV file not found: ${CSV_PATH}`));
    }

    fs.createReadStream(CSV_PATH)
      .pipe(csv())
      .on('data', (row) => {
        // Sanitize keys and values
        const sanitizedRow = {};
        for (const [key, value] of Object.entries(row)) {
          sanitizedRow[key.trim()] = typeof value === 'string' ? value.trim() : value;
        }
        rows.push(sanitizedRow);
      })
      .on('end', () => resolve(rows))
      .on('error', reject);
  });
}

// Detect timestamp column
function detectTimestampColumn(rows) {
  if (!rows || rows.length === 0) return null;

  const columns = Object.keys(rows[0]);
  const timestampCandidates = ['timestamp', 'time', 'datetime', 'ts', 'date'];

  for (const candidate of timestampCandidates) {
    for (const col of columns) {
      if (col.toLowerCase() === candidate.toLowerCase()) {
        return col;
      }
    }
  }

  return null;
}

// Get parameter status
function getParameterStatus(parameter, value) {
  if (value === null || value === undefined || value === '') {
    return 'unknown';
  }

  let numericValue;
  try {
    numericValue = parseFloat(value);
  } catch {
    return 'unknown';
  }

  const safeRanges = {
    'ph': { min: 6.5, max: 8.5 },
    'tds': { min: 0, max: 500 },
    'turbidity': { min: 0, max: 1 },
    'chlorine': { min: 0.2, max: 4.0 },
    'hardness': { min: 0, max: 300 },
    'microbes': { min: 0, max: 0.1 },
    'microbial proxy': { min: 0, max: 0.1 },
    'flow_rate': { min: 0, max: Infinity },
    'battery': { min: 0, max: 100 }
  };

  const paramKey = Object.keys(safeRanges).find(
    key => key.toLowerCase() === parameter.toLowerCase()
  );

  if (!paramKey) return 'unknown';

  const { min, max } = safeRanges[paramKey];

  if (numericValue >= min && numericValue <= max) {
    return 'ok';
  }

  const margin = (max - min) * 0.1;
  if (numericValue >= min - margin && numericValue <= max + margin) {
    return 'attention';
  }

  return 'unsafe';
}

class CSVReader {
  constructor(csvFilePath = null) {
    this.csvFilePath = csvFilePath || CSV_PATH;
    this.dataCache = null;
    this.schemaCache = null;
  }

  async loadData() {
    if (this.dataCache !== null) {
      return this.dataCache;
    }

    this.dataCache = await loadRows();
    return this.dataCache;
  }

  getSchema() {
    if (this.schemaCache !== null) {
      return this.schemaCache;
    }

    // For synchronous schema access, we need cached data
    if (!this.dataCache || this.dataCache.length === 0) {
      return { columns: [], timestamp_column: null, total_rows: 0 };
    }

    const columns = Object.keys(this.dataCache[0]);
    const timestampColumn = detectTimestampColumn(this.dataCache);

    this.schemaCache = {
      columns,
      timestamp_column: timestampColumn,
      total_rows: this.dataCache.length
    };

    return this.schemaCache;
  }

  getParameterData(parameter, limit = 200) {
    if (!this.dataCache) {
      throw new Error('Data not loaded. Call loadData() first.');
    }

    const schema = this.getSchema();

    if (!schema.columns.includes(parameter)) {
      throw new Error(`Parameter '${parameter}' not found in CSV columns`);
    }

    if (parameter === schema.timestamp_column) {
      throw new Error('Cannot get data for timestamp column');
    }

    const result = [];
    const timestampCol = schema.timestamp_column;

    this.dataCache.forEach((row, index) => {
      if (row[parameter] !== null && row[parameter] !== undefined) {
        let timestampStr;
        
        if (timestampCol && row[timestampCol]) {
          timestampStr = row[timestampCol];
        } else {
          timestampStr = `1970-01-01T00:00:${String(index).padStart(2, '0')}Z`;
        }

        result.push({
          timestamp: timestampStr,
          value: row[parameter]
        });
      }
    });

    // Sort by timestamp and apply limit
    result.sort((a, b) => a.timestamp.localeCompare(b.timestamp));
    return limit ? result.slice(-limit) : result;
  }

  getLatestTelemetry() {
    if (!this.dataCache || this.dataCache.length === 0) {
      return {
        timestamp: null,
        values: {},
        status: {}
      };
    }

    const schema = this.getSchema();
    const latestRow = this.dataCache[this.dataCache.length - 1];
    const timestampCol = schema.timestamp_column;

    const timestamp = timestampCol && latestRow[timestampCol] 
      ? latestRow[timestampCol] 
      : `Row ${this.dataCache.length - 1}`;

    const values = {};
    const status = {};

    schema.columns.forEach(column => {
      if (column !== timestampCol) {
        const value = latestRow[column];
        values[column] = value;
        status[column] = getParameterStatus(column, value);
      }
    });

    return {
      timestamp,
      values,
      status
    };
  }

  clearCache() {
    this.dataCache = null;
    this.schemaCache = null;
  }
}

// Create and initialize global instance
const csvReader = new CSVReader();

// Initialize data on module load
(async () => {
  try {
    await csvReader.loadData();
    console.log('✅ CSV data loaded successfully');
  } catch (error) {
    console.warn('⚠️ CSV data not available:', error.message);
  }
})();

module.exports = { CSVReader, csvReader };

