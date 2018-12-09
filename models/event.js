const mongoose = require('mongoose');

const eventSchema = mongoose.Schema({
    title: {type:String, required: [true,'Title Obrigatorio']},
    description: {type:String},
    checkVip: {type: Boolean, default: false},
    priceVip: {type:Number, default: 0},
    quantityVip: {type:Number, default: 0},
    checkPromo: {type: Boolean, default: false},
    pricePromo: {type:Number, default: 0},
    quantitytPromo: {type:Number, default: 0},
    checkNormal: {type: Boolean, default: false},
    priceNormal: {type:Number, default: 0},
    quantityNormal: {type:Number, default: 0},
    checkKid: {type: Boolean, default: false},
    priceKid: {type:Number, default: 0},
    quantityKid: {type:Number, default: 0},
    checkAdult: {type: Boolean, default: false},
    priceAdult: {type:Number, default: 0},
    quantityAdult: {type:Number, default: 0},
    freeTicket: {type: Boolean, default: false},
    quantityFree: {type:Number, default: 0},
    local: {type:String, required: true},
    address: {type:String, required: true},
    startDateTime: {type: String},
    endDateTime: {type: String},
    category: {type:String},
    mainimage: {type: String},
    created: {type: Date, default: Date.now()},
    updated: {type: Date, default: Date.now()},
    promoterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Promoter'
    }

});

const Event = module.exports = mongoose.model('Event', eventSchema);

module.exports.getEvents = function(){
    return Event.find().populate('promoterId').exec();
};

module.exports.saveEvent = function(newEvent){
    return newEvent.save();
};

module.exports.getEventById = function (id) {
    return Event.findById(id).populate('promoterId').exec();
};

module.exports.getEventByName = function (name) {
    const query = {name: name};
    return Event.find(query).exec();
};