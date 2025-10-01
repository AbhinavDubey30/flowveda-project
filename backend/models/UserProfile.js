const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const UserProfile = sequelize.define('UserProfile', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    userType: {
      type: DataTypes.ENUM('household', 'official'),
      defaultValue: 'household'
    },
    mobileNumber: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    municipalityName: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    location: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    householdSize: {
      type: DataTypes.INTEGER,
      defaultValue: 1
    },
    deviceId: {
      type: DataTypes.STRING(100),
      allowNull: true
    }
  }, {
    tableName: 'user_profiles',
    timestamps: true
  });

  return UserProfile;
};

