const mongoose=require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username : {type : String, required : true, unique : true, minlength : 5},
    password : {type : String, required : true, minlength : 8},
    lat : {type : Number, default: 12.527580},//latitute for the place
    lon : {type : Number, default: 76.894669}
});

//Hash passoword before saving
userSchema.pre('save',async function (next) {
    if (this.isModified('password')){
        this.password = await bcrypt.hash(this.password,10);
    }
    next();
});

userSchema.methods.comparePassword = async function (password){
    return bcrypt.compare(password,this.password);
}
module.exports = mongoose.model('User', userSchema);