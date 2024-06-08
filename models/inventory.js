const { Sequelize, DataTypes, Model } = require('sequelize');

const sequelize=require("../config/database")

const Book = require('./bookModel'); // Import Book model to establish the association

class Inventory extends Model {}

Inventory.init({
    book_id: {
        type: DataTypes.STRING(64),
        primaryKey: true,
        references: {
            model: Book,
            key: 'book_id'
        }
    },
    quantity_available: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    location: {
        type: DataTypes.STRING(256),
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'Inventory',
    tableName: 'Inventory',
    timestamps: false,
    
});

// Establish the association
Book.hasOne(Inventory, { foreignKey: 'book_id' });
Inventory.belongsTo(Book, { foreignKey: 'book_id' });


module.exports = Inventory;