// FIREBASE INTEGRATION
import firebaseDB from './Firebase';
import { getDatabase, ref, onValue, push } from 'firebase/database';
// HOOKS
import { useState, useEffect } from "react";
import axios from 'axios';
import { Link, Routes, Route } from 'react-router-dom';

// COMPONENTS
import Fridge from './Fridge';
import Grocery from './Grocery';

const secondaryApiKey = 'b2b9ba71b80745c19b07bc43b138f85e'

// database details and reference
const database = getDatabase(firebaseDB)
const dbRef = ref(database)
const dbFridgeRef = ref(database, `fridgeList/`)
const dbGroceryRef = ref(database, `groceryList/`)

const ListsInfo = () => {
    // SEARCH INPUT STATES
    // input value
    const [userSearch, setUserSearch] = useState('')
    // match error
    const [searchError, setSearchError] = useState(false)

    // AUTO COMPLETE STATE
    const [autoCompleteArr, setAutocompleteArr] = useState([])


    // objective: match between autocomplete array and submitted answer. if match, copy its contents into foodItem obj, and send it to firebase
    const pushFoodtoDB = (reference) => {
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
                push(reference, foodItemObj)
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

    const secondaryApiKey = 'b2b9ba71b80745c19b07bc43b138f85e'

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


    return (
        // nav
        <>
            <nav>
                <ul className='displayTabs'>
                    <li className='tab'>
                        <Link to='/'>Fridge</Link>
                    </li>
                    <li className='tab'>
                        <Link to='/grocery'>Grocery</Link>
                    </li>
                </ul>
            </nav>
            <Routes>
                <Route
                    path='/'

                    element={
                        <Fridge
                            userSearch={userSearch}
                            searchError={searchError}
                            autoCompleteArr={autoCompleteArr}
                            pushFoodtoDB={pushFoodtoDB}
                            handleChange={handleChange}
                            handleSuggest={handleSuggest}
                        />} />
                <Route
                    path='/grocery'
                    element={
                        <Grocery
                            userSearch={userSearch}
                            searchError={searchError}
                            autoCompleteArr={autoCompleteArr}
                            pushFoodtoDB={pushFoodtoDB}
                            handleChange={handleChange}
                            handleSuggest={handleSuggest}

                        />} />
            </Routes>
        </>

    )
}

export default ListsInfo;