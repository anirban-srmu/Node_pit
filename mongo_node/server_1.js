const mongoose = require('mongoose');
//mongodb connection string
const dbURI ='mongodb://localhost:27017/test';

//connect to mongodb
mongoose.connect(dbURI,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(()=>console.log('MongoDb sucsessfully connected'))
.catch(err=>console.error('Mongo connection error:',err));

//define the schema for the collection
const userSchema =new mongoose.Schema({
    name:{type:String,required:true},
    age:{type:Number,required:true},
    email:{type:String,required:true}
});

//create a model based on the schema
const User = mongoose.model('User',userSchema);

//create a new user document and save it to the database
const newUser = new User({
    name: 'Anirban',
    age: 38,
    email: 'anirban@xyz.com'
});

newUser.save()
.then(user=>console.log('User saved',user))
.catch(err=>console.error('Error saving the user',err));