const express = require('express');
const router = express.Router();
const axios = require('axios');
const uniqueRandom = require('unique-random');
const rand = uniqueRandom(1, 100000000);

const Payment = require('../models/payment');
const Event = require('../models/event');
const sendMail = require('../services/email');
const sendSmsService = require('../services/sms');

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

router.get('/:eventId', async function(req, res, next) {
    let eventid = req.params.eventId;
    try{
        const eventResult = await Event.getEventById(eventid);
        res.render('payments/payment', {
            layout:'layoutPayment',
            event: eventResult,
            headerTitle: 'Pagamento via M-Pesa'
        });
    }catch (e) {
        console.log(e.message);
    }

});

router.post('/mpesa/', async (req, res, next) => {
    console.log(req.body);
    let eventid = req.body.event_id;
    let promoterId = req.body.promoter_id;
    let promoterName = req.body.promoter_Name;
    let title = req.body.event_Name;
    let phoneNumber = req.body.prefix + req.body.phoneNumber;
    let price = req.body.price;
    let quantity = req.body.quantity;
    let userName = req.body.name;
    let email = req.body.email;
    let startdatetime  = req.body.startDateTime;
    let ticketID = rand();
    const smsText = `FireTicket ID: ${ticketID}`;
    let paymentresult;
    let paymentstatus;
    let priceTotal = price * quantity;
    const htmltxt = '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">\n' +
        '<html xmlns="http://www.w3.org/1999/xhtml">\n' +
        '<head>\n' +
        '    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />\n' +
        '    <title>FireTicket - Online Ticket </title>\n' +
        '    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>\n' +
        '</head>\n' +
        '<body style="margin: 0; padding: 0;">\n' +
        '<table align="center" border="0" cellpadding="0" cellspacing="0" width="600">\n' +
        '    <tr>\n' +
        '        <td align="center" bgcolor="#fff" style="padding: 40px 0 30px 0;">\n' +
        '            <img src="https://img.freepik.com/free-vector/cinema-ticket_1459-2366.jpg?size=338&ext=jpg" alt="Fire Ticket E-mail" width="300" height="250" style="display: block;" />\n' +
        '        </td>\n' +
        '    </tr>\n' +
        '    <tr>\n' +
        '        <td bgcolor="#ffffff">\n' +
        '            <table border="0" cellpadding="" cellspacing="0" width="100%">\n' +
        '                <tr>\n' +
        '                    <td style="color: #153643; font-family: Arial, sans-serif; font-size: 24px;">\n' +
        '                        <b>Ola, esse e o seu bilhete de confirmacao para o evento </b><a style="text-decoration: none;color:Tomato;font-size:20px" href="">' +title+'</a>\n' +
        '                    </td>\n' +
        '                </tr>\n' +
        '                <tr>\n' +
        '                    <td style="color: #153643; font-family: Arial, sans-serif; font-size: 14px;">\n' +
        '                        <b>Organizado por '+ promoterName +'</b><hr>\n' +
        '                    </td>\n' +
        '                </tr>\n' +
        '                <tr>\n' +
        '                    <td style="padding: 20px 0px 20px 0px;color: #153643;background-color: #e0e0e0; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px;">\n' +
        '                        <table style= "align="center"; color:#4d90fe;" border="0" cellpadding="5" cellspacing="0" width="100%">\n' +
        '                <tr>\n' +
        '                    <td style="color: #153643; font-family: Arial, sans-serif; font-size: 16px;">\n' +
        '                        <b>Numero do bilhete</b>\n' +
        '                        <hr>\n' +
        '                    </td>\n' +
        '                    <td>\n' +
        '\n' +
        '                    </td>\n' +
        '                    <td style="color: #153643; font-family: Arial, sans-serif; font-size: 16px;">\n' +
        '                        <b>Data e Hora</b>\n' +
        '                        <hr>\n' +
        '                    </td>\n' +
        '                </tr>\n' +
        '                <tr>\n' +
        '                    <td style="color: #153643; font-family: Arial, sans-serif; font-size: 16px;">\n' +
        '                        #:'+ ticketID + '<hr>\n' +
        '                    </td>\n' +
        '                    <td style="color: #153643; font-family: Arial, sans-serif; font-size: 16px;">\n' +
        '\n' +
        '                    </td>\n' +
        '                    <td>\n' + startdatetime +' <hr>\n' +
        '                    </td>\n' +
        '                </tr>\n' +
        '                <tr>\n' +
        '                    <td style="color: #153643; font-family: Arial, sans-serif; font-size: 16px;">\n' +
        '                        <b>Nome</b>\n' +
        '                        <hr>\n' +
        '                    </td>\n' +
        '                    <td style="color: #153643; font-family: Arial, sans-serif; font-size: 16px;">\n' +
        '                        <b>Tipo</b>\n' +
        '                        <hr>\n' +
        '                    </td>\n' +
        '                    <td style="color: #153643; font-family: Arial, sans-serif; font-size: 16px;">\n' +
        '                        <b>Quantidade</b>\n' +
        '                        <hr>\n' +
        '                    </td>\n' +
        '                </tr>\n' +
        '                <tr>\n' +
        '                    <td style="color: #153643; font-family: Arial, sans-serif; font-size: 16px;">' + userName + '</td>\n' +
        '                    <td style="color: #153643; font-family: Arial, sans-serif; font-size: 16px;"> VIP </td>\n' +
        '                    <td style="color: #153643; font-family: Arial, sans-serif; font-size: 16px;">' + quantity +' </td>\n' +
        '                </tr>\n' +
        '\n' +
        '            </table>\n' +
        '\n' +
        '        </td>\n' +
        '    </tr>\n' +
        '</table>\n' +
        '<hr>\n' +
        '</td>\n' +
        '</tr>\n' +
        '<tr>\n' +
        '    <td bgcolor="#ee4c50" style="padding: 30px 30px 30px 30px;">\n' +
        '\n' +
        '        <table border="0" cellpadding="0" cellspacing="0" width="100%">\n' +
        '            <tr>\n' +
        '                <td width="75%" style="color: #ffffff; font-family: Arial, sans-serif; font-size: 14px;">\n' +
        '                    &reg; FireTicket, Maputo-Mozambique 2018<br/>\n' +
        '                    Todos direitos reservados\n' +
        '                </td>\n' +
        '                <td align="right">\n' +
        '                    <table border="0" cellpadding="0" cellspacing="0">\n' +
        '                        <tr>\n' +
        '                            <td>\n' +
        '                                <a href="http://www.twitter.com/">\n' +
        '                                    <img src="https://www.clipartmax.com/png/middle/12-128336_clipart-twitter-bird-free-images-at-clker-com-vector-twitter-logo.png" alt="Twitter" width="38" height="38" style="display: block;" border="0" />\n' +
        '                                </a>\n' +
        '                            </td>\n' +
        '                            <td style="font-size: 0; line-height: 0;" width="20">&nbsp;</td>\n' +
        '                            <td>\n' +
        '                                <a href="http://www.twitter.com/">\n' +
        '                                    <img src="images/fb.gif" alt="Facebook" width="38" height="38" style="display: block;" border="0" />\n' +
        '                                </a>\n' +
        '                            </td>\n' +
        '                        </tr>\n' +
        '                    </table>\n' +
        '                </td>\n' +
        '            </tr>\n' +
        '        </table>\n' +
        '    </td>\n' +
        '</tr>\n' +
        '</table>\n' +
        '</td>\n' +
        '</tr>\n' +
        '</table>\n' +
        '</body>\n' +
        '</html>';

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
             "amount":priceTotal,
             "phoneNumber":parseInt(phoneNumber),
             "merchantId":"5bfd9a0d0141632052f45e9a"
            }).then(function (response) {
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
                paymentId: paymentresult._id,
                transactionId: paymentresult.output_TransactionID,
                conversationId:paymentresult.output_ConversationID,
                ticketId:ticketID
            });

            try {
                await Payment.savePayment(newPayment);
                await sendMail.sendMailer(email, title, htmltxt);
                await sendSmsService.sendSms(smsText,parseInt(phoneNumber));
                req.flash('success_msg', 'Pagamento feito com sucesso');
            }catch (e) {
                console.log(e.message);
                req.flash('error', 'ocorreu um error a efectuar o pagamento, tente de novo');
            }
        }else{
            req.flash('error', 'Pagamento nao efectuado, ocorreu um erro ao efectuar o pagamento, tente de novo');
        }

        res.redirect('/');

    }
});




module.exports = router;
