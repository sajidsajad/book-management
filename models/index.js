const Sequelize = require('sequelize');
const sequelize = require('../config/database');

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import models here and add them to db object
db.User = require('./user')(sequelize, Sequelize);
db.Book = require('./book')(sequelize, Sequelize);
db.Review = require('./review')(sequelize, Sequelize);


// Define relationships
db.User.hasMany(db.Review, { foreignKey: 'userId', as: 'reviews' });
db.Book.hasMany(db.Review, { foreignKey: 'bookId', as: 'reviews' });
db.Review.belongsTo(db.User, { foreignKey: 'userId', as: 'user' });
db.Review.belongsTo(db.Book, { foreignKey: 'bookId', as: 'book' });


module.exports = db;
