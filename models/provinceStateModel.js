// models/province_state.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Country = require('./countryModel');

const ProvinceState = sequelize.define('ProvinceState', {
    province_state_id: {
        type: DataTypes.STRING(64),
        primaryKey: true,
    },
    country_code: {
        type: DataTypes.STRING(4),
        allowNull: false,
        references: {
            model: Country,
            key: 'country_code'
        }
    },
    province_state_name: {
        type: DataTypes.STRING(128),
        allowNull: false,
    },
    province_state_code: {
        type: DataTypes.STRING(8),
        allowNull: false,
    }
}, {
    timestamps: false,
    tableName: 'Provinces_States'
});

Country.hasMany(ProvinceState, { foreignKey: 'country_code' });
ProvinceState.belongsTo(Country, { foreignKey: 'country_code' });

module.exports = ProvinceState;

