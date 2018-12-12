const express = require('express');
const  router = express.Router();

const Event = require('../models/event');
const sendMail = require('../services/email');

router.post('/faleconnosco/email', async function(req, res, next) {
    console.log(req.body);
    let fromEmail = req.body.fromEmail;
    let subjectEmail = req.body.subjectEmail;
    let bodyEmail = req.body.bodyEmail;
    let htmlbody = '<p>'+bodyEmail+'</p>';
    try {
        await sendMail.sendMailer(fromEmail, subjectEmail,htmlbody );
        req.flash('success_msg', 'Email enviado com sucesso');

    }catch (e) {
        console.log(e.message);
        req.flash('error', 'ocorreu um error a enviar o email, tente de novo');
    }
    res.redirect('/');

});

router.post('/falecompromotor/email', async function(req, res, next) {
    console.log(req.body);
    let fromEmail = req.body.fromEmail;
    let subjectEmail = req.body.subjectEmail;
    let bodyEmail = req.body.bodyEmail;
    let htmlbody = '<p>'+bodyEmail+'</p>';
    try {
        await sendMail.sendMailer(fromEmail, subjectEmail,htmlbody );
        req.flash('success_msg', 'Email enviado com sucesso');

    }catch (e) {
        console.log(e.message);
        req.flash('error', 'ocorreu um error a enviar o email, tente de novo');
    }
    res.redirect('/');

});

module.exports = router;