const EmailSubscriber = require('../models/emailSubscriberModel');

const subscribe = async (req, res) => {
    try {
        const { email } = req.body;
        
        const subscriber = await EmailSubscriber.create({ email });
        return res.status(201).json(subscriber);
    } catch (error) {
        console.log(`error occured while subscribing: `,JSON.stringify(error, null, 2));
        return res.status(500).json({ error: error.message });
    }
}

const unsubscribe = async (req, res) => {   
    try {
        //The sbscriber should already be found in the res.locals.subscriber object middleware
        let subscriber = res.locals.subscriber;
        await subscriber.destroy();
        return res.status(204).end();
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
}



module.exports = {
    subscribe,
    unsubscribe,
};