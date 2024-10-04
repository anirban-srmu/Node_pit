//import express library
const express =require('express');
// create an express application by calling express()
const app =express()
//port as 3000
const port = 3000;
app.use((req,res,next)=>{
    console.log(`${req.method} ${req.url}`);
    next();//moves to the next middleware or route handeller  
})
//defined a route for home page
app.get('/',(req,res)=>{
    res.send("Hello, World!");//responsed as hello world
});
app.get('/v1/about',(req,res)=>{
    res.send("About Page");//responsed as hello world
});
app.get('/v2/about',(req,res)=>{
    res.send("About Page");//responsed as hello world
});
app.get('/contact',(req,res)=>{
    res.send("Contact Us Page");//responsed as hello world
});

//listen to port 3000 and log the msg
app.listen(port,()=>{
    console.log(`Server is running at http://localhost:${port} `);
});