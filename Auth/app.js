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

//CRUD setup

const Product = require('./models/Product')

//create a product with POST request
app.post('/products',authenticateJWT,async(req,res)=>{
    
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

//read all products with GET request
app.get('/products',authenticateJWT,async(req,res)=>{
    try{
        const products= await Product.find();
        res.json(products);
    } catch(error){
    res.status(500).send('Error retriving products')
    }
});

//Update a product with PUT request:
app.put('/products/:id',authenticateJWT,async(req,res)=>{
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

//delete the product
app.delete('/products/:id',authenticateJWT, async(req,res)=>{
    try{
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) return res.status(404).send('Product not found');
        res.status(204).send('Product is Deleted!');
    }catch (error){
        res.status(500).send('Error deleting product');
    }
});