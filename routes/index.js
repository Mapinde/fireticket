const express = require('express');
const  router = express.Router();

const Event = require('../models/event');

/* GET home page. */
router.get('/', async function(req, res, next) {
    try {
        const events = await Event.getEvents();
        res.render('index', {events: events });
    }catch (e) {
        console.log(e.message);
    }

});

module.exports = router;