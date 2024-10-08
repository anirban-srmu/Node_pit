const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');//to connect with the env variable in .env file
const cors = require('cors');

dotenv.config();

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
app.listen(PORT,()=>console.log(`Server running on port ${PORT}`));

//import model User
const User = require('./models/User')

// register user API
app.post('/register', async(req,res)=>{
    const {username,password,role} = req.body;

    try{
        const newUser = new User({username,password,role});
        await newUser.save();
        res.status(201).json({message:'User registered!!'});
    }catch (error){
        res.status(500).json({message:'Error creating user',error});
    }
});

// login API requires JWT
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


//CRUD setup
//product model import
const Product = require('./models/Product')

//create a product with POST request and auth function for route protection
app.post('/products',authenticateJWT,authorize(['admin','super-admin']),async(req,res)=>{
    
    try{
        const product = new Product({
            name:req.body.name,
            price:req.body.price,
            category: req.body.category,
            stock: req.body.stock
        });
        
        const saveProduct =await product.save();
        res.status(201).json(saveProduct);
    }
    catch(error){
        console.error('Error creating product:', error);
        res.status(500).send('Error creating product');
    }
});

//read all products with GET request and auth function for route protection
app.get('/products',authenticateJWT,authorize(['admin','user']),async(req,res)=>{
    try{
        const products= await Product.find();
        res.json(products);
    } catch(error){
    res.status(500).send('Error retriving products');
    }
});

//Update a product with PUT request and auth function for route protection
app.put('/products/:id',authenticateJWT,authorize(['admin']),async(req,res)=>{
    try{
        const product =await Product.findByIdAndUpdate(req.params.id,{
            name: req.body.name,
            price: req.body.price,
            category: req.body.category,
            stock: req.body.stock
        },{new:true});
        if(!product) return res.status(404).send('Product not foud');
        res.json(product);
    }catch(error){
        res.status(500).send('error updating the product');
    }
});

//delete the product and auth function for route protection
app.delete('/products/:id',authenticateJWT, authorize(['admin']),async(req,res)=>{
    try{
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) return res.status(404).send('Product not found');
        res.status(204).send('Product is Deleted!');
    }catch (error){
        res.status(500).send('Error deleting product');
    }
});