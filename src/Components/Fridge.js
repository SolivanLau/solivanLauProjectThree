// firebase integration
import firebaseDB from './Firebase';
import { getDatabase, ref, onValue } from 'firebase/database';
// hooks
import { useState, useEffect } from "react";
import axios from 'axios';

// Components
import Form from "./Form";

const secondaryApiKey = 'b2b9ba71b80745c19b07bc43b138f85e'

const Fridge = () => {

    const [userSearch, setUserSearch] = useState('')
    const [autoCompleteArr, setAutocompleteArr] = useState('')


    const handleSubmit = (event) => {
        event.preventDefault();
        console.log('form is submitted')
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
        })
    }, [userSearch])


    useEffect(() => {
        // database details and reference
        const database = getDatabase(firebaseDB)
        const dbRef = ref(database)
        const dbFridgeRef = ref(database, `fridgeList/`)
        const dbGroceryRef = ref(database, `groceryList/`)
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

            />
        </div>
    )
}

export default Fridge;