const express = require('express');
const multer = require('multer');
const app = express();

//multer storage setup
const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null, 'File_up_multipart_form/uploads/');
    },
    filename:(req, file, cb)=>{
        cb(null, file.originalname);//save the file with original name
    }
});

const upload = multer({storage:storage});

//File upload route
app.post('/upload',upload.single('file'),(req,res)=>{
    res.send('File uploaded sucessfully');
})

//start the server
app.listen(3000,()=>{
    console.log('Server started on http://localhost:3000');
});