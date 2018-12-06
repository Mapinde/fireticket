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

const Promoter = require('../models/promoter');

/* GET home page. */
router.get('/', async function(req, res, next) {
    try{
        const promoters = await Promoter.getPromoters();
        res.render('promoters/listpromoter', {layout:'layoutPayment', promoters: promoters });
    }catch (e) {
        console.log(e.message);
    }

});

router.get('/new', async function(req, res, next) {
    res.render('promoters/newpromoter', {layout:'layoutPayment', title: 'Express' });
});


router.post('/new', upload.single('mainimage'), async function(req, res, next) {
    let name = req.body.name;
    let description = req.body.description;
    let phoneNumber = req.body.phoneNumber;
    let email = req.body.email;
    let mainimage;
    if(req.file){
        mainimage = req.file.originalname;
    } else {
        mainimage = 'noimage.jpg';
    }

    req.checkBody('name', 'Nome obrigatorio').notEmpty();
    req.checkBody('description', 'Descricao obrigatoria').notEmpty();
    req.checkBody('phoneNumber', 'Numero de telefone obrigatorio').notEmpty();
    req.checkBody('email', 'Porfavor insira um email valido').isEmail();
    req.checkBody('email', 'Deve inserir um email valido').isEmail();

    const errors = req.validationErrors();

    if (errors) {
        console.log(errors);
        res.render('promoters/newpromoter', {errors: errors});
    } else {
        const newPromoter = new Promoter({
            name:name,
            description:description,
            phoneNumber:phoneNumber,
            email:email,
            mainimage:mainimage
        });
        try {
            const promoter = await Promoter.savePromoter(newPromoter);
            console.log(promoter);
        }catch (e) {
            console.log(e.message);
        }
        req.flash('success_msg', 'Promotor criado com sucesso');
        res.redirect('/backend/promoters/');

    }
});

module.exports = router;
