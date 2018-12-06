const express = require('express');
const router = express.Router();
const axios = require('axios');

const Payment = require('../models/payment');
const sendMail = require('../services/email');

/* GET home page. */
router.get('/:eventId/:price/:title/:promoterName/:promoterId', function(req, res, next) {
    let eventid = req.params.eventId;
    let price = req.params.price;
    let title = req.params.title;
    let promoterName = req.params.promoterName;
    let promoterId = req.params.promoterId;
    res.render('payments/payment', {
        layout:'layoutPayment',
        title: title,
        amount:price,
        eventId: eventid,
        promoterName: promoterName,
        promoterId: promoterId,
        headerTitle: 'Pagamento via M-Pesa'
    });
});

router.post('/mpesa/', async (req, res, next) => {
    let eventid = req.body.event_id;
    let promoterId = req.body.promoter_id;
    let promoterName = req.body.promoter_Name;
    let title = req.body.event_Name;
    let phoneNumber = '25884' + req.body.phoneNumber;
    let price = req.body.amount;
    let quantity = req.body.quantity;
    let userName = req.body.name;
    let email = req.body.email;
    let paymentresult;
    let paymentstatus;
    const htmltxt = '';

    req.checkBody('phoneNumber', 'Telefone obrigatorio').notEmpty();
    req.checkBody('quantity', 'Quantidade obrigatoria').notEmpty();
    req.checkBody('name', 'Nome obrigatorio').notEmpty();
    req.checkBody('email', 'Porfavor insira um email valido').isEmail();
    req.checkBody('email', 'Deve inserir um email valido').isEmail();

    const errors = req.validationErrors();

    if (errors) {
        console.log(errors);
        res.render('payments/payment', {errors: errors});
    } else {

        await axios.post('https://morning-refuge-15908.herokuapp.com/payments', {
                "amount":price,
                "phoneNumber":parseInt(phoneNumber),
                "reference":"T17965A",
                "input_MerchantId":"5bfd9a0d0141632052f45e9a"
            })
            .then(function (response) {
                //console.log(response);
                paymentstatus = response.status;
                paymentresult = response.data.payment;
            })
            .catch(function (error) {
                //console.log(error.response);
                paymentstatus = error.response.status;
            });


        if( paymentstatus == 200 || paymentstatus == 201){


            const newPayment = new Payment({
                phoneNumber: parseInt(phoneNumber),
                price: price,
                quantity: quantity,
                userName: userName,
                userEmail: email,
                eventtitle: title,
                eventid: eventid,
                promoterName:promoterName,
                promoterId: promoterId,
                transactionId: paymentresult.output_TransactionID,
                conversationId:paymentresult.output_ConversationID
            });

            try {
                const payment = await Payment.savePayment(newPayment);

                await sendMail.sendMailer(email, title, htmltxt);
                req.flash('success_msg', 'Pagamento feito com sucesso');
            }catch (e) {
                console.log(e.message);
                req.flash('error', 'ocorreu um error a efectuar o pagamento');
            }
        }else{
            req.flash('error', 'Pagamento nao efectuado, ocorreu um erro ao efectuar o pagamento');
        }

        res.redirect('/');

    }
});




module.exports = router;
