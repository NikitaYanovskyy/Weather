import React, {useState, useRef, useEffect} from 'react'
import {getCitySuggestions} from '../../api/index'
import Suggestions from './Suggestions'
import {useHistory} from 'react-router-dom'
import axios from 'axios'
import SmallLoader from './SmallLoader'
import {useQuery} from '../../hooks'

const Form = (props) => {
    const [cities, setCities] = useState(null)
    const [inputValue, setInputValue] = useState("")
    const [areSuggestionsVisible, setIsSuggestionsVisible] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const history = useHistory()
    const sourseRef = useRef();
    const throttle = useRef(false);
    const handleSelect = (city, country) =>{
        history.push(`/Weather/city?q=${city}&country=${country}`)
    }
    const handleChange = async (e) =>{
        setInputValue(e.target.value)
        if (throttle.current) {
            return
        }
        const fetchData = ()=>{
            if(e.target.value.length >= 4){
                setIsLoading(true)
                throttle.current = true;
                if(typeof sourseRef.current !== 'undefined'){
                    sourseRef.current.cancel()
                }
                sourseRef.current = axios.CancelToken.source();
                setTimeout( async()=>{
                    throttle.current = false
                    let response = await getCitySuggestions(e.target.value, sourseRef.current.token)
                    if(response){
                        setIsSuggestionsVisible(true)   
                        setCities(response.data)
                        setIsLoading(false)
                    }
                },800) 
            }    
            if(e.target.value.length === 3){
                if(typeof sourseRef.current !== 'undefined'){
                    sourseRef.current.cancel()
                }
                setIsLoading(false)
                setIsSuggestionsVisible(false)   
            }
        }
        fetchData()
    }
    const handleFocus = () =>{
        setIsSuggestionsVisible(true)
    }
    const handleBlur = () =>{  
        setIsSuggestionsVisible(false)
    }
    const handleSubmit = (e) =>{
        e.preventDefault()  
    }

    return(
        <form onSubmit={(e) => handleSubmit(e)} className={"form "+props.locationClass}>
            <div className="text_input_block">
                <SmallLoader isLoading={isLoading}/>
                <input type="text" placeholder="Type and select city from list" onFocus={handleFocus} onBlur={handleBlur} onChange={handleChange} value={inputValue}/> 
                {<Suggestions areSuggestionsVisible={areSuggestionsVisible} handleSelect={handleSelect} suggestions={cities}/>}
            </div>
        </form>
    )
}

export default Form;
