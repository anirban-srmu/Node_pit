const mongoose=require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username : {type : String, required : true, unique : true},
    password : {type : String, required : true},
    role : {type : String, default: 'user'}//role for authorisation
});

//Hash passoword before saving
userSchema.pre('save',async function (next) {
    if (this.isModified('password')){
        this.password = await bcrypt.hash(this.password,10);
    }
    next();
});

userSchema.methods.comparePassword = async function (passoword){
    return bcrypt.compare(password,this.passoword);
}
module.exports = mongoose.model('User', userSchema)


