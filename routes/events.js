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

router.get('/:eventId', async function(req, res, next) {
    const id = req.params.eventId;
    try{
        const event = await Event.getEventById(id);
        res.render('events/viewevent', {layout:'layoutEvent', event: event });
    }catch (e) {
        console.log(e.message);
    }

});

router.post('/newevent/:promoterId', upload.single('mainimage'), async function(req, res, next) {
    console.log(req.body);
    let title = req.body.title;
    let description = req.body.description;
    let local = req.body.local;

    let promoterId = req.params.promoterId;
    let address = req.body.address;
    let category = req.body.category;
    let startDateTime = req.body.startDataTime;
    let endDateTime = req.body.endDataTime;
    let mainimage;

    let freeticket = 0;
    let freequantity = 0;
    let kidcheck = false;
    let kidprice = 0;
    let kidquantity = 0;
    let adultcheck = false;
    let adultprice = 0;
    let adultquantity = 0;
    let promocheck = false;
    let promoprice = 0;
    let promoquantity = 0;
    let normalcheck = false;
    let normalprice = 0;
    let normalquantity = 0;
    let vipcheck = false;
    let vipprice = 0;
    let vipquantity = 0;

    if(req.file){
        mainimage = req.file.originalname;
    } else {
        mainimage = 'noimage.jpg';
    }


    if (req.body.freeCheck ==='on'){
        freeticket = true;
        freequantity = req.body.freeQuantity;
    }
    if (req.body.kidCheck ==='on'){
        kidcheck = true;
        kidprice = req.body.kidPrice;
        kidquantity = req.body.kidQuantity;
    }
    if (req.body.adultCheck ==='on'){
        adultcheck = true;
        adultprice = req.body.adultPrice;
        adultquantity = req.body.adultQuantity;
    }
    if (req.body.promoCheck ==='on'){
        promocheck = true;
        promoprice = req.body.promoPrice;
        promoquantity = req.body.promoQuantity;
    }
    if (req.body.normalCheck ==='on'){
        normalcheck = true;
        normalprice = req.body.normalPrice;
        normalquantity = req.body.normalQuantity;
    }
    if (req.body.vipCheck ==='on'){
        vipcheck = true;
        vipprice = req.body.vipPrice;
        vipquantity = req.body.vipQuantity;
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
            title: title,
            description: description,
            local: local,
            checkVip:vipcheck,
            priceVip: vipprice,
            quantityVip: vipquantity,
            checkPromo:promocheck,
            pricePromo: promoprice,
            quantitytPromo: promoquantity,
            checkNormal: normalcheck,
            priceNormal: normalprice,
            quantityNormal: normalquantity,
            checkKid: kidcheck,
            priceKid: kidprice,
            quantityKid: kidquantity,
            checkAdult: adultcheck,
            priceAdult: adultprice,
            quantityAdult: adultquantity,
            freeTicket: freeticket,
            freeQuantity: freequantity,
            address:address,
            promoterId:promoterId,
            category: category,
            startDateTime: startDateTime.toString(),
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
