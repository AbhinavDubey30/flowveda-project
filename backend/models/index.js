const { Sequelize } = require('sequelize');
const config = require('../config');

// Initialize Sequelize
const sequelize = new Sequelize(config.DATABASE);

// Import models
const User = require('./User')(sequelize);
const UserProfile = require('./UserProfile')(sequelize);
const Device = require('./Device')(sequelize);
const SensorReading = require('./SensorReading')(sequelize);
const Subscription = require('./Subscription')(sequelize);
const Bill = require('./Bill')(sequelize);
const Notification = require('./Notification')(sequelize);

// Define associations
User.hasOne(UserProfile, { foreignKey: 'userId', as: 'profile', onDelete: 'CASCADE' });
UserProfile.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Device, { foreignKey: 'ownerId', as: 'devices', onDelete: 'CASCADE' });
Device.belongsTo(User, { foreignKey: 'ownerId', as: 'owner' });

Device.hasMany(SensorReading, { foreignKey: 'deviceId', as: 'readings', onDelete: 'CASCADE' });
SensorReading.belongsTo(Device, { foreignKey: 'deviceId', as: 'device' });

User.hasMany(Subscription, { foreignKey: 'userId', as: 'subscriptions', onDelete: 'CASCADE' });
Subscription.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(Bill, { foreignKey: 'userId', as: 'bills', onDelete: 'CASCADE' });
Bill.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(Notification, { foreignKey: 'userId', as: 'notifications', onDelete: 'CASCADE' });
Notification.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Device.hasMany(Notification, { foreignKey: 'deviceId', as: 'notifications', onDelete: 'CASCADE' });
Notification.belongsTo(Device, { foreignKey: 'deviceId', as: 'device' });

module.exports = {
  sequelize,
  User,
  UserProfile,
  Device,
  SensorReading,
  Subscription,
  Bill,
  Notification
};

