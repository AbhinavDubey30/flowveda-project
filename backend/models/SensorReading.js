const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const SensorReading = sequelize.define('SensorReading', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    deviceId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'devices',
        key: 'id'
      }
    },
    ph: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    tds: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    turbidity: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    chlorine: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    hardness: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    microbes: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    flowRate: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    battery: {
      type: DataTypes.FLOAT,
      allowNull: true
    }
  }, {
    tableName: 'sensor_readings',
    timestamps: true,
    updatedAt: false
  });

  // Instance method to check if water is safe
  SensorReading.prototype.isWaterSafe = function() {
    const safeRanges = {
      ph: { min: 6.5, max: 8.5 },
      tds: { min: 0, max: 500 },
      turbidity: { min: 0, max: 1 },
      chlorine: { min: 0.2, max: 4.0 },
      hardness: { min: 0, max: 300 },
      microbes: { min: 0, max: 0.1 }
    };

    const readings = {
      ph: this.ph,
      tds: this.tds,
      turbidity: this.turbidity,
      chlorine: this.chlorine,
      hardness: this.hardness,
      microbes: this.microbes
    };

    for (const [param, value] of Object.entries(readings)) {
      if (value !== null && value !== undefined) {
        const { min, max } = safeRanges[param];
        if (value < min || value > max) {
          return { safe: false, message: `${param.toUpperCase()} out of range` };
        }
      }
    }

    return { safe: true, message: 'Safe to Use' };
  };

  return SensorReading;
};

