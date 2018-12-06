const mongoose = require('mongoose');

const promoterSchema = mongoose.Schema({
    name:{type:String, required: [true,'Nome e Obrigatorio']},
    description:{type:String},
    phoneNumber:{type:String, required: true},
    email:{type:String, required: true},
    mainimage:{type: String},
    events:[{
        event_id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Event'
        }
    }],
    created:{type: Date, default: Date.now()},
    updated:{type: Date, default: Date.now()}

});

const Promoter = module.exports = mongoose.model('Promoter', promoterSchema);

module.exports.getPromoters = function(){
    return Promoter.find().exec();
};

module.exports.savePromoter = function(newPromoter){
    return newPromoter.save();
};

module.exports.getPromoterById = function (id) {
    return Promoter.findById(id).exec();
};

module.exports.getPromoterByName = function (name) {
    const query = {name: name};
    return Promoter.find(query).exec();
};