// models/country.js
const { DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const {Md5Rand}=require("../utilities/functions")
const sequelize = require('../config/database');

const Country = sequelize.define('Country', {
    country_code: {
        type: DataTypes.STRING(4),
        primaryKey: true,
    },
    country_name: {
        type: DataTypes.STRING(128),
        allowNull: false,
    },
}, {
    timestamps: false,
    tableName: 'Countries'
});

module.exports = Country;
