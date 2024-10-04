const express = require('express');
const app = express();
const port =3000;

//mock data
let books =[
    {id:1,title: 'The Great Gatsby',author: 'Fitzgerald'},
    {id:2,title: 'To kill a Mockingbird',author: 'Lee'},
    {id:3,title: '1984',author: 'Orwell'},
]
app.use(express.json());//to handle json data

//basic server setup
app.listen(port,()=>{
    console.log(`server running at https://localhost:${port}`);
});

app.get('/books',(req,res)=>{
    res.json(books);
});

app.get('/books/:id',(req,res)=>{
    const bookId= parseInt(req.params.id);
    const book = books.find(b=>b.id === bookId);

    if (!book){
        return res.status(404).send('Book not found');
    };
    res.json(book);
});

app.post('/books',(req,res)=>{
    const newBook ={
        id:books.length+1,
        title: req.body.title,
        author: req.body.author,
    };
    books.push(newBook);
    res.status(201).json(newBook);
});