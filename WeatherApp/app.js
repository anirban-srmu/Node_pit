const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');//to connect with the env variable in .env file
const cors = require('cors');
const jwt = require('jsonwebtoken');
const axios = require('axios');

dotenv.config()

const app = express();
app.use(express.json())
app.use(cors());

//connect to mongodb
mongoose.connect(process.env.MONGO_URI,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(()=>console.log('MongoDB Connected'))
.catch(err=>console.error(err));

//Start server
const PORT = process.env.PORT || 5000;
const APP_URI = process.env.APP_URI;
app.listen(PORT,()=>console.log(`Server is running at ${APP_URI}:${PORT}`));

//import model User
const User = require('./models/User')

//register user API
app.post('/register',async(req,res)=>{
    const {username,password,lat,lon,role} = req.body;

    try{
        const newUser = new User({username,password,lat,lon,role});
        await newUser.save();
        res.status(201).json({message:'User registered!!'});
    }catch (error){
        res.status(500).json({message:'Error creating user',error});
    }
});

// login API requires JWT

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

//authentication function
const authenticateJWT = (req,res,next)=>{
    const token = req.header('Authorization');
    console.log(token);
    if (token){
        jwt.verify(token,process.env.JWT_SECRET,(err,user)=>{
            if(err){
                return res.status(403).json({message:'Invalid token'});
            }
            req.user =user;
            next();
        });
    } else{
        res.status(401).json({message: 'No token provided'});
    }
};

//athorization function
const authorize = (roles)=>{
    return (req,res,next)=>{
        if (!roles.includes(req.user.role)){
            return res.status(403).json({message: 'Access denied!'});
        }
        next();
    };
};

let cache = {};

async function getWeather(lat,lon){
    if (cache[lat,lon]){
        console.log('Returning cached data');
        return cache[lat,lon];
    }
    const response =await axios.get('https://api.openweathermap.org/data/2.5/weather',{
        params:{
            lat:lat,
            lon:lon,
            appid:'09aa41a19eac8bd7fb5bc4c992ebc7ab'
        }    
    });
    //Store the response in cache
    cache[lat,lon]= response.data;
    //cache expires after 10 min
    setTimeout(()=>delete cache[lat,lon],60000);
    return response.data;
}
let cacheForcast={}
async function getWeatherForcast(lat,lon){
    if (cacheForcast[lat,lon]){
        console.log('Returning cached data');
        return cacheForcast[lat,lon];
    }
    const response =await axios.get('https://api.openweathermap.org/data/2.5/forecast',{
        params:{
            lat:lat,
            lon:lon,
            appid:'09aa41a19eac8bd7fb5bc4c992ebc7ab'
        }
    });
    //Store the response in cache
    cacheForcast[lat,lon]= response.data;
    //cache expires after 10 min
    setTimeout(()=>delete cacheForcast[lat,lon],60000);
    return response.data;
}

app.get('/weather/:lat/:lon',authenticateJWT,authorize(['superuser']),async(req,res)=>{
    try{
        //console.log(getWeather(req.params.lat,req.params.lon));
        getWeather(req.params.lat,req.params.lon).then(data=>res.status(201).json(data));
    }catch(error){
        res.status(500).json({message:'Error retriving the Weather'});
    }
});

app.get('/weather/:username',authenticateJWT,authorize(['user','superuser']),async(req,res)=>{
    try{
        const user = await User.findOne({username: req.params.username});

        getWeather(user.lat,user.lon).then(data=>res.status(201).json(data));
    }catch(error){
        res.status(500).send('Error retriving the Weather');
    }
});

app.get('/weather-forcast/:username',authenticateJWT,authorize(['user','superuser']),async(req,res)=>{
    try{
        const user = await User.findOne({username: req.params.username});
        console.log(user);
        getWeatherForcast(user.lat,user.lon).then(data=>res.status(201).json(data));
    }catch(error){
        res.status(500).send('Error retriving the Weather');
    }
});

app.get('/weather-forcast/:lat/:lon',authenticateJWT,authorize(['superuser']),async(req,res)=>{
    try{
        //console.log(getWeather(req.params.lat,req.params.lon));
        getWeatherForcast(req.params.lat,req.params.lon).then(data=>res.status(201).json(data));
    }catch(error){
        res.status(500).json({message:'Error retriving the Weather'});
    }
});