const express = require('express');
const  router = express.Router();
const multer = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/images')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
});
const upload = multer({ storage: storage });

const Event = require('../models/event');
const Promoter = require('../models/promoter');

/* GET home page. */
router.get('/', async function(req, res, next) {
    try {
        const events = await Event.getEvents();
        res.render('index', {events: events });
    }catch (e) {
        console.log(e.message);
    }

});

router.get('/newevent/:promoterId', function(req, res, next) {
    const id = req.params.promoterId;
    res.render('events/newevent', {layout:'layoutPayment', promoterId: id });
});

router.post('/newevent/:promoterId', upload.single('mainimage'), async function(req, res, next) {
    console.log(req.body);
    let title = req.body.title;
    let description = req.body.description;
    let local = req.body.local;
    let price = req.body.price;
    let promoterId = req.params.promoterId;
    let address = req.body.address;
    let category = req.body.category;
    let startDateTime = req.body.startDataTime;
    let endDateTime = req.body.endDataTime;
    let mainimage;
    if(req.file){
        mainimage = req.file.originalname;
    } else {
        mainimage = 'noimage.jpg';
    }
    req.checkBody('title', 'Titulo e obrigatorio').notEmpty();
    req.checkBody('description', 'Descricao e obrigatoria').notEmpty();
    req.checkBody('local', 'local obrigatorio').notEmpty();
    req.checkBody('category', 'Deve selecionar uma categoria').notEmpty();
    req.checkBody('startDataTime', 'Deve selecionar data e Hora do inicio do evento').notEmpty();
    req.checkBody('endDataTime', 'Deve selecionar data e Hora do Fim do evento').notEmpty();
    const errors = req.validationErrors();

    if (errors) {
        console.log(errors);
        res.render('events/newevent', {errors: errors});
    } else {
        const newEvent = new Event({
            title:title,
            description:description,
            local:local,
            price:price,
            address:address,
            promoterId:promoterId,
            category: category,
            startDataTime: startDateTime.toString(),
            endDateTime:endDateTime.toString(),
            mainimage:mainimage
        });
        try {
            const event = await Event.saveEvent(newEvent);
            console.log(event);
            let query = {_id: promoterId};

            await Promoter.findOneAndUpdate(query, {$push: {"events": {event_id: event._id}}},
                {safe: true, upsert: true});
        }catch (e) {
            console.log(e.message);
        }
        req.flash('success_msg', 'Evento criado com sucesso');
        res.redirect('/');

    }
});

module.exports = router;
