// FIREBASE INTEGRATION
import { push } from 'firebase/database';
// HOOKS
import axios from 'axios';
import { Link, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from "react";

// COMPONENTS
import Fridge from './Fridge';
import Grocery from './Grocery';

const ListsInfo = () => {
    // SEARCH INPUT STATES
    // input value
    const [userSearch, setUserSearch] = useState('')
    // match error
    const [searchError, setSearchError] = useState(false)

    // AUTO COMPLETE STATE
    const [autoCompleteArr, setAutocompleteArr] = useState([])



    const pushFoodtoDB = (reference) => {

        // // IF EVERY suggestion does not match user's inputted item, create an error message
        // autoCompleteArr.every((suggestion) => {
        //     if (suggestion.name !== userSearch) {
        //         setSearchError(true)
        //     } else {
        //         setSearchError(false)

        //         const foodItemObj = {
        //             name: suggestion.name,
        //             imageUrl: suggestion.image,
        //             altText: `Image of a ${suggestion.name}`,
        //             expDate: ''
        //         }

        //         // push object to firebase
        //         push(reference, foodItemObj)
        //         setUserSearch('')
        //     }
        // })
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
                apiKey: process.env.REACT_APP_API_KEY_ONE,
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
            <main>
                <nav>
                    <div className="wrapper">
                        <ul className='displayTabs'>
                            <li >
                                <Link
                                    to='/' className='tabItem'>Fridge</Link>
                            </li>
                            <li>
                                <Link
                                    to='/grocery'
                                    className='tabItem'>Grocery</Link>
                            </li>
                        </ul>
                    </div>
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
            </main>
        </>

    )
}

export default ListsInfo;