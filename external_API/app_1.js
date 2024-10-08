const axios = require('axios');

axios.get('https://api.openweathermap.org/data/2.5/weather',{
    params:{
        lat:12.527580,
        lon:76.894669,
        appid:'09aa41a19eac8bd7fb5bc4c992ebc7ab'
    }
})
.then(response =>{
    console.log('Weather Data:',response.data);
})
.catch(error =>{
    if (error.response){
        console.log('Error Status:', error.response.status);
        console.log('Error Message:',error.response.data.message);
    }
    else{
        console.log('Network error:', error.message);
    }

});

// const fetch = require('node-fetch');

// fetch('https://api.github.com/users/github')
//     .then(response=>response.json())
//     .then(data =>{
//         console.log('User data', data)
//     })
//     .catch(error=>{
//         console.error('Error fetching user data:',error);
//     });

