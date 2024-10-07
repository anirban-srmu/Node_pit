const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(express.json())

//connect to mongodb

mongoose.connect(process.env.MONGO_URI,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(()=>console.log('MongoDB Connected'))
.catch(err=>console.error(err));

//Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT,()=>console.log(`Server running on port ${PORT}`));

const User = require('./models/User')

app.post('/register', async(req,res)=>{
    const {username,password} = req.body;

    try{
        const newUser = new User({username,password});
        await newUser.save();
        res.status(201).json({message:'User registered!!'});
    }catch (error){
        res.status(500).json({message:'Error creating user',error});
    }
});

const jwt = require('jsonwebtoken');

app.post('/login', async(req,res)=>{
    const {username,password} = req.body;

    try {
        const user = await User.findOne({username});
        if (!user || !(await user.comparePassword(password))){
            return res.status(401).json({message:' Invalid credentials'});
        }

        // Generate JWT token
        const token = jwt.sign({id:user._id,role:user.role},process.env.JWT_SECRET,{expiresIn:'1h'});
        res.json({token});

    }catch (error){
        console.error(error);
        res.status(500).json({message:'Error login in',error});
    }
});