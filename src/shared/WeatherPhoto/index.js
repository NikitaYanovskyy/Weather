import React ,{useState,useRef, useEffect} from 'react'
import clearImg from '../../assets/images/clear.jpg'
import cloudyImg from '../../assets/images/cloudy.jpg'
import rainImg from '../../assets/images/rain.jpg'
import drizzleImg from '../../assets/images/drizzle.jpg'
import thunderImg from '../../assets/images/storm.png'
import clearCloudy from '../../assets/images/clearAndCloudy.png'
import snowImg from '../../assets/images/snow.jpg'
import mistImg from '../../assets/images/mist.jpg'

const WeatherPhoto = (props) =>{
    const [imageLoading, setImageLoading] = useState(true)
    const imageRef = useRef({current: {src: ''}})
    
    useEffect(()=>{
            if(imageLoading && props.weather){
                imageRef.current = new Image()
                switch (props.weather) {
                    case "Clouds":
                        imageRef.current.src = cloudyImg
                    break;
                    case "Mist":
                        props.weatherDescription === 'few clouds' ? imageRef.current.src = clearCloudy : imageRef.current.src = cloudyImg
                        break;
                    case "Clear":
                        imageRef.current.src = clearImg
                        break;
                    case "Snow":
                        imageRef.current.src = snowImg
                        break;
                    case "Rain":
                        props.weatherDescription === 'light rain' ? imageRef.current.src = drizzleImg : imageRef.current.src = rainImg
                        break;
                    case "Drizzle":
                        break;
                    case "Thunderstorm":
                        imageRef.current.src = thunderImg
                        break;
                    default:
                        imageRef.current.src = mistImg
                        break;
                }
                imageRef.current.onload = () =>{
                    setImageLoading(false)
                    props.setIsLoaderVisible(false)
                }  
            }    
    }, [props.weather])

    const backgroundImageStyles={
        backgroundImage: `linear-gradient(rgba(1, 2, 11, 0.4), rgba(1, 2, 11, 0.4)), url(${imageRef.current.src})`,
        backgroundPosition: "center",
        backgroundSize: "cover"
    }
        return React.cloneElement(props.children, {props, backgroundImageStyles: backgroundImageStyles, src: imageRef.current.src})
}

export default WeatherPhoto


