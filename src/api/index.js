import axios from 'axios';

const config = {
    bigDataCloudBaseUrl: `https://api.bigdatacloud.net/data/reverse-geocode?`,
    bigDataAPIKey: `b6b6e1d9f9a14cfb95889b6900b0b8ff`,
    openWeatherBaseUrl: `https://api.openweathermap.org/data/2.5/weather?`,
    geoDBBaseUrl: `http://geodb-free-service.wirefreethought.com/v1/geo/cities?`,
}

export const CitySuggestions = axios.create()

export const getCurrentLocation = async (lat,long, cancelToken)=>{
    try{
        let response = await axios.get(`${config.bigDataCloudBaseUrl}latitude=${lat}&longitude=${long}&localityLanguage=en&key=${config.bigDataAPIKey}`,{cancelToken: cancelToken})
        return response.data
    }catch(error){
        console.log(`error`)
    }   
}
export const  getCityWeather = async (id, cancelToken)=>{
    try{
        let response = await axios.get(`${config.openWeatherBaseUrl}id=${id}&units=metric&APPID=${process.env.REACT_APP_OPEN_WEATHER_API_KEY}`,{cancelToken: cancelToken})
        return response.data
    }catch(error){
        console.log(`error`)
    } 
}
 /* export const getCitySuggestions = async (city, cancelToken)=>{
    try{
        let response = await CitySuggestions.get(`${config.geoDBBaseUrl}limit=5&offset=0&namePrefix=${city}&minPopulation=40000`, {cancelToken})
        return response.data
    }catch(error){
        
    }  
} */
  
export const getCitySuggestions = async(city, cancelToken) =>{
    const options = {
        method: 'GET',
        url: 'https://wft-geo-db.p.rapidapi.com/v1/geo/cities',
        params: {limit: '5', minPopulation: '30000', namePrefix: city},
        headers: {
          'x-rapidapi-key': '73684db7a1msh8b685a8e80dea2ap10cbdejsn3b4ff31b5e1c',
          'x-rapidapi-host': 'wft-geo-db.p.rapidapi.com'
        },
        cancelToken
      };
    try{
        let response = await CitySuggestions.request(options)
        return response.data
    }catch{

    }
    
}
