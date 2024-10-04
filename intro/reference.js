// let greeting ='Hello World!'
// //arrow function
// const add =(a,b)=>a+b;
// console.log(greeting)
// console.log(add(2,3));
// // template literals
// const student_name = 'Kishore';
// console.log(`Student name is ${student_name}.`);
// //destructuring
// const person ={person_name:'Kishore',age:25};
// const {person_name,age} = person;
// console.log(person_name,age);
// console.log(person_name);

//promises and async/await
// const promise = new Promise((resolve, reject)=>{
//     setTimeout(()=>resolve('Success'),2000);
// });
//promise.then(data=>console.log(data));

//async/await
// const fetchData =async()=>{
//     const data = await promise;
//     console.log(data);
// };
// fetchData();
//Asynchronus programming in Node.js
//non-blocking
//callback
const fs = require('fs');
fs.readFile('note.txt','utf8', (err,data)=>{
    if (err) throw err;
    console.log(data);
});
console.log("hello")

//adding promises
// const fetchData=()=>{
//     return new Promise((resovle,reject)=>{
//         setTimeout(()=>resovle('Data recieved'),1000);
//     });
// };

// function1().then(fetchData().then(data=>console.log(data)));

//async/await

const fetchData =async()=>{
    let response = await fetch("https:/api.example.com/data");
    let data = await response.json();
    console.log(data);
};
fetchData();





