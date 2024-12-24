const { body, validationResult } = require('express-validator');
const EmailSubscriber = require('../models/emailSubscriberModel');

const validateEmailMiddleware = [
    body('email')
        .isEmail()
        .withMessage('Email must be valid')
        .isLength({ max: 64 })
        .withMessage('Email must be at most 64 characters long')
        .notEmpty()
        .withMessage('Email is required'),
    // the email should also not already be in the system
    async(req, res, next) => {
        const { email } = req.body;
        const subscriber = await EmailSubscriber.findOne({ where: { email } });
        if (subscriber) {
            return res.status(400).json({ error: 'Email already subscribed' });
        };
        next();
    },
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

/** create a middleware that checks that a provided subscriber id was found */

const subscriber_id_found = async (req, res, next) => {
    const { subscriber_id } = req.params;
    const subscriber = await EmailSubscriber.findOne({ where: { subscriber_id } });
    if (!subscriber) {
        return res.status(404).json({ error: 'Subscriber not found' });
    }
    res.locals.subscriber = subscriber;
    next();
}


module.exports = {
    validateEmailMiddleware,
    subscriber_id_found
};