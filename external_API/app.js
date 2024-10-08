const axios = require('axios');

let cache = {};

async function getWeather(lat,lon){
    if (cache[lat,lon]){
        console.log('Returning cached data');
        return cache[lat,lon];
    }
    const response =await axios.get('https://api.openweathermap.org/data/2.5/weather',{
        params:{
            lat:12.527580,
            lon:76.894669,
            appid:'09aa41a19eac8bd7fb5bc4c992ebc7ab'
        }
    });
    //Store the response in cache
    cache[lat,lon]= response.data;
    //cache expires after 10 min
    setTimeout(()=>delete cache[lat,lon],60000);
    return response.data;
}

getWeather(12.527580,76.894669).then(data=>console.log(data));