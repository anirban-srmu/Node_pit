const mongoose=require('mongoose');

//define the schema for the collection
const productSchema =new mongoose.Schema({
    name: {type : String, required : true},
    price: {type : Number, require : true},
    category: {type : String},
    stock: {type: Number, default:0},
    createdOn: {type : Date, default : Date.now}
});

//create a model based on the schema
module.exports = mongoose.model('Product',productSchema);