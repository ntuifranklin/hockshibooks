const express = require('express');
const { subscribe, unsubscribe } = require('./controller');
const { validateEmailMiddleware, subscriber_id_found} = require('./middleware');
const router = express.Router();

module.exports = () => {
    router.post("/subscribe", validateEmailMiddleware, subscribe);
    router.post("/unsubscribe:subscriber_id",subscriber_id_found, unsubscribe);   

    return router;
}