// firebase integration
import firebaseDB from './Firebase';
import { getDatabase, ref, onValue, push } from 'firebase/database';
// hooks
import { useState, useEffect } from "react";
import axios from 'axios';

// Components
import Form from "./Form";
import Gallery from './Gallery';

const secondaryApiKey = 'b2b9ba71b80745c19b07bc43b138f85e'

// database details and reference
const database = getDatabase(firebaseDB)
const dbRef = ref(database)
const dbFridgeRef = ref(database, `fridgeList/`)
const dbGroceryRef = ref(database, `groceryList/`)



const Fridge = () => {

    // SEARCH INPUT STATE
    // input value
    const [userSearch, setUserSearch] = useState('')
    // match error
    const [searchError, setSearchError] = useState(false)


    // AUTO COMPLETE STATE
    const [autoCompleteArr, setAutocompleteArr] = useState('')


    // FRIDGE LIST STATE: contains all items from Firebase db to be rendered
    const [fridgeArr, setFridgeArr] = useState([])

    // SUBMITING FORM: if EVERY item in the autocomplete list does NOT match update error state, OTHERWISE, take the data and push  to firebase + reset input  val
    const handleSubmit = (event) => {
        event.preventDefault();
        console.log('form is submitted')
        // objective: match between autocomplete array and submitted answer. if match, copy its contents into foodItem obj, and send it to firebase

        // eval each value in autoCompleteArr (forEach(suggestion)=>{})
        // // userSearch === suggestion.name
        // // 
        //



        autoCompleteArr.every((suggestion) => {
            if (suggestion.name !== userSearch) {
                setSearchError(true)
            } else {
                setSearchError(false)

                const foodItemObj = {
                    name: suggestion.name,
                    imageUrl: suggestion.image,
                    altText: `Image of a ${suggestion.name}`
                }

                // push object to firebase
                push(dbFridgeRef, foodItemObj)
                setUserSearch('')
            }
        })

    }
    // handle and control user text input
    const handleChange = (event) => {
        const userInput = event.target.value.toLowerCase()
        setUserSearch(userInput)
    }

    // handle autocomplete items: sets userSearch(text input) to clicked value
    const handleSuggest = (event) => {
        setUserSearch(event.target.textContent)
    }

    // AUTOCOMPLETE API CALL: when text input change === api call made
    useEffect(() => {
        axios({
            url: 'https://api.spoonacular.com/food/ingredients/autocomplete',
            params: {
                apiKey: secondaryApiKey,
                query: userSearch,
                number: 10,
                metaInformation: true
            }
        }).then((apiData) => {
            const autoCompleteData = apiData.data;
            setAutocompleteArr(autoCompleteData)
            // console.log(autoCompleteArr)
        })
    }, [userSearch])

    // FIREBASE check: on page load, onValue listens for changes in firebase => updates local fridgeArr state
    useEffect(() => {
        onValue(dbFridgeRef, (fridgeData) => {
            const remotefridgeData = fridgeData.val()
            // console.log(remotefridgeData)

            const localFridgeArr = []

            for (let item in remotefridgeData) {
                const foodStatObj = {
                    id: item,
                    foodName: remotefridgeData[item].name,
                    imgLink: remotefridgeData[item].imageUrl,
                    altText: remotefridgeData[item].altText
                }

                localFridgeArr.push(foodStatObj)
            }

            setFridgeArr(localFridgeArr)
        })
    }, [])

    return (
        <div>
            <h2>Fridge Display</h2>

            <Form
                handleSubmit={handleSubmit}
                handleChange={handleChange}
                autoCompleteArr={autoCompleteArr}
                handleSuggest={handleSuggest}
                inputState={userSearch}
                searchError={searchError}
            />

            <Gallery
                fridgeArr={fridgeArr}
            />
        </div>
    )
}

export default Fridge;