const mongoose = require('mongoose');

const paymentSchema = mongoose.Schema({
    phoneNumber:{type: Number, required: true},
    price:{type: Number, default: 0},
    quantity:{type: Number, required: true},
    userName:{type: String, required: true},
    userEmail:{type: String, required: true},
    eventtitle:{type: String, required: true},
    eventid:{type: mongoose.Schema.Types.ObjectId, required: true},
    promoterName:{type: String, required: true},
    promoterId:{type: mongoose.Schema.Types.ObjectId, required:true},
    paymentId:{type: mongoose.Schema.Types.ObjectId},
    transactionId:{type: String},
    conversationId:{type: String},
    ticketId:{type:Number, default: 0},
    created:{type: Date, default: Date.now()},
    updated:{type: Date, default: Date.now()}

});

const Payment = module.exports = mongoose.model('Payment', paymentSchema);

module.exports.getPayments = function(){
    return Payment.find().exec();
};

module.exports.savePayment = function(newPayment){
    return newPayment.save();
};

module.exports.getPaymentById = function (id) {
    return Payment.findById(id).exec();
};

module.exports.getPaymentByName = function (name) {
    const query = {name: name};
    return Payment.find(query).exec();
};