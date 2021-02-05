import React, {useState, useRef, useCallback} from 'react'
import {getCitySuggestions} from '../../api/index'
import Suggestions from './Suggestions'
import {useHistory} from 'react-router-dom'
import axios from 'axios'
import SmallLoader from './SmallLoader'

const Form = (props) => {
    const [cities, setCities] = useState(null)
    const [inputValue, setInputValue] = useState("")
    const [areSuggestionsVisible, setIsSuggestionsVisivle] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const history = useHistory()
    const sourseRef = useRef();
    const freshInputValue = useRef("")

    const handleSelect = (city, country) =>{
        history.push(`Weather/city?q=${city}&country=${country}`)
    }

    const handleChange = async (e) =>{
        setInputValue(e.target.value)
        const fetchData = async ()=>{
            if(e.target.value.length >= 4){
                if(typeof sourseRef.current !== 'undefined'){
                    sourseRef.current.cancel()
                }
                sourseRef.current = axios.CancelToken.source();
                setIsLoading(true)
                let response = await getCitySuggestions(e.target.value, sourseRef.current.token)
                if(response){
                    setIsSuggestionsVisivle(true)   
                    setCities(response.data)
                    setIsLoading(false)
                }
            }    
            if(e.target.value.length === 3){
                if(typeof sourseRef.current !== 'undefined'){
                    sourseRef.current.cancel()
                }
                setIsLoading(false)
                setIsSuggestionsVisivle(false)   
            }
        }
        fetchData()
    }
    const handleFocus = () =>{
        setIsSuggestionsVisivle(true)
    }
    const handleBlur = () =>{
        setTimeout(() => {
            setIsSuggestionsVisivle(false)
        }, 200);
    }
    const handleSubmit = (e) =>{
        e.preventDefault()
        history.push(`Weather/city?q=${inputValue}&country=${cities[0] ? cities[0].country : 'unfound'}`)
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
