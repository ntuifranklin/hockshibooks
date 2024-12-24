/*
CREATE TABLE Email_Subscribers (
    subscriber_id VARCHAR(64) PRIMARY KEY, -- Unique identifier for each subscriber
    email VARCHAR(255) NOT NULL UNIQUE, -- Email address of the subscriber
    full_name VARCHAR(255), -- Full name of the subscriber
    signup_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, -- Date and time of signup
    subscription_status ENUM('Active', 'Unsubscribed', 'Pending') NOT NULL DEFAULT 'Pending', -- Status of the subscription
    preferred_frequency ENUM('Daily', 'Weekly', 'Monthly') DEFAULT 'Weekly', -- Frequency of email notifications
    preferred_genres VARCHAR(255), -- Subscriber's preferred book genres (e.g., 'Fiction, Mystery, Sci-Fi')
    language_preference VARCHAR(50) DEFAULT 'English', -- Preferred language for emails
    last_email_sent DATETIME, -- Timestamp of the last email sent
    open_rate FLOAT DEFAULT 0.0, -- Percentage of emails opened by the subscriber
    click_rate FLOAT DEFAULT 0.0, -- Percentage of links clicked in emails
    bounce_status ENUM('None', 'Soft Bounce', 'Hard Bounce') DEFAULT 'None', -- Email bounce status
    ip_address_signup VARCHAR(45), -- IP address from which the user signed up
    signup_source VARCHAR(255), -- Source of the signup (e.g., website, social media, ad campaign)
    unsubscribe_reason VARCHAR(255), -- Reason provided by the subscriber for unsubscribing
    gdpr_consent BOOLEAN DEFAULT FALSE, -- Whether the subscriber has provided GDPR consent
    tags VARCHAR(255) -- Additional tags for categorizing the subscriber (e.g., 'VIP', 'Frequent Buyer')
);
*/

const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

/* create a model using the sql table in comment above */
class EmailSubscriber extends Model {}

EmailSubscriber.init({
    subscriber_id: {
        type: DataTypes.STRING(64),
        primaryKey: true,
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
    },
    full_name: {
        type: DataTypes.STRING(255),
    },
    signup_date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    },
    subscription_status: {
        type: DataTypes.ENUM('Active', 'Unsubscribed', 'Pending'),
        allowNull: false,
        defaultValue: 'Pending',
    },
    preferred_frequency: {
        type: DataTypes.ENUM('Daily', 'Weekly', 'Monthly'),
        defaultValue: 'Weekly',
    },
    preferred_genres: {
        type: DataTypes.STRING(255),
    },
    language_preference: {
        type: DataTypes.STRING(50),
        defaultValue: 'English',
    },
    last_email_sent: {
        type: DataTypes.DATE,
    },
    open_rate: {
        type: DataTypes.FLOAT,
        defaultValue: 0.0,
    },
    click_rate: {
        type: DataTypes.FLOAT,
        defaultValue: 0.0,
    },
    bounce_status: {
        type: DataTypes.ENUM('None', 'Soft Bounce', 'Hard Bounce'),
        defaultValue: 'None',
    },
    ip_address_signup: {
        type: DataTypes.STRING(45),
    },
    signup_source: {
        type: DataTypes.STRING(255),
    },
    unsubscribe_reason: {
        type: DataTypes.STRING(255),
    },
    gdpr_consent: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    tags: {
        type: DataTypes.STRING(255),
    },
}, {
    sequelize,
    modelName: 'EmailSubscriber',
    tableName: 'Email_Subscriber',
    timestamps: false,
    hooks: {
        
        /* How do I make sure the id created is unique and does nto exist yet ? */
        beforeCreate: async (subscriber) => {
            let isUnique = false;
            while (!isUnique) {
                const id = crypto.createHash('md5').update(Math.random().toString()).digest('hex').substring(0, 64);
                const existingSubscriber = await EmailSubscriber.findOne({ where: { subscriber_id: id } });
                if (!existingSubscriber) {
                    subscriber.subscriber_id = id;
                    isUnique = true;
                }
            }
        },
    },
});

module.exports = EmailSubscriber;