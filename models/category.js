const mongoose = require('mongoose');

// Category Schema
const CategorySchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    }
});

const Category = module.exports = mongoose.model('Category', CategorySchema);

module.exports.getCategories = function(){
    return Category.find().exec();
}

module.exports.saveYears = function(newCategory){
    return newCategory.save();
}