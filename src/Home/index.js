import React, {useState, useEffect} from 'react';
import Form from '../shared/Form'
import Burger from '../shared/Burger'
import Weather from './Weather'
import WeatherPhoto from '../shared/WeatherPhoto'
import Photo from './Photo'
import Loader from './Loader'
import {getCurrentLocation,getCityWeather} from '../api/index'
import axios from 'axios'

const Home = () => {
    const [isLoaderVisible, setIsLoaderVisible] = useState(true)
    const [currentPlace , setCurrentPlace] = useState('')
    const [county , setCountry] = useState('')
    const [weatherData, setWeatherData] = useState({temperature: '', weather: '', description: ''})
    useEffect(() => {
        let getCurrentLocation_CancelToken = axios.CancelToken.source()
        let getCityWeather_CancelToken = axios.CancelToken.source()
        
        navigator.geolocation.getCurrentPosition( async (position) => {

            //Get current Location
            const lat = position.coords.latitude
            const long = position.coords.longitude
            let locationResponse = await getCurrentLocation(lat,long, getCurrentLocation_CancelToken.token)
            locationResponse.city !== '' ? setCurrentPlace(locationResponse.city) : setCurrentPlace(locationResponse.locality)
            setCountry(locationResponse.countryName)


            // Get current city id
            let cityId;
            locationResponse.localityInfo.administrative.map((elem) =>{
                if((elem.name === locationResponse.city || elem.name === locationResponse.locality) && elem.hasOwnProperty('geonameId')){
                    cityId = elem.geonameId
                }
            })

            let WeatherResponse = await getCityWeather(cityId, getCityWeather_CancelToken.token)
            if(WeatherResponse){
                setWeatherData({
                    temperature: Math.round(WeatherResponse.main.temp),
                    weather: WeatherResponse.weather[0].main,
                    description: WeatherResponse.weather[0].description
                })
            }
        })
        return ()=>{
            getCurrentLocation_CancelToken.cancel()
            getCityWeather_CancelToken.cancel()
        }
    },[])
        return(
            <div className="home_wrapper">
                <Loader isLoaderVisible={isLoaderVisible} temperature={weatherData.temperature}/> 
                <WeatherPhoto setIsLoaderVisible={setIsLoaderVisible} weather={weatherData.weather} weatherDescription={weatherData.description}>
                    <Photo isLoaderVisible={isLoaderVisible} temperature={weatherData.temperature}/>
                </WeatherPhoto>

                <div className="burger_block">
                    <Burger locationClass="home"/>
                </div>

                <div className="side_offset home">
                    <p className="home_logo">Weather logo.</p>
                    <Weather 
                        currentPlace={currentPlace} 
                        county={county}
                        weatherData={weatherData} 
                    />
                    <Form locationClass="home" />
                </div> 
            </div>
        )
}
export default Home