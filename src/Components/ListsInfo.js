// FIREBASE INTEGRATION
import { push } from 'firebase/database';
// HOOKS
import axios from 'axios';
import { Link, Routes, Route, useLocation } from 'react-router-dom';
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

    // TAB ACTIVE CLASS STATE
    const [tabActive, setTabActive] = useState('')


    // return true/false if current suggestion's name DOES NOT match user input
    const searchEval = (suggestion) => {
        return suggestion.name !== userSearch;
    }


    // evaluates whether user input matches any suggestion, then pushes to db
    const pushFoodtoDB = (reference) => {
        // if no suggestions match user input, return true 
        const matchSuggestionFailed = autoCompleteArr.every(searchEval)

        // IF ALL suggestions does not match user's inputted item, create an error message
        if (matchSuggestionFailed === true) {
            setSearchError(true)
        } else {
            // OTHERWISE remove error msg
            setSearchError(false)

            // find matching item from arrray
            const searchMatch = autoCompleteArr.find((foodItem) => { return foodItem.name === userSearch })

            // place needed values in a template obj
            const foodItemObj = {
                name: searchMatch.name,
                imageUrl: searchMatch.image,
                altText: `Image of a ${searchMatch.name}`,
                expDate: ''
            }

            // push template object to firebase
            push(reference, foodItemObj)
            setUserSearch('')
        }

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


    // AUTOCOMPLETE API CALL: provides list based on text input change
    useEffect(() => {
        axios({
            url: 'https://api.spoonacular.com/food/ingredients/autocomplete',
            params: {
                apiKey: process.env.REACT_APP_API_KEY_ONE,
                query: userSearch,
                number: 20,
                metaInformation: true
            }
        }).then((apiData) => {
            const autoCompleteData = apiData.data;
            setAutocompleteArr(autoCompleteData)
            // console.log(autoCompleteArr)
        })
    }, [userSearch])



    // TAB ACTIVE HANDLER: setsState to tab title (string), if that state is = to string, give class of active

    const handleTabActive = (event) => {
        setTabActive(event.target.textContent.trim().toLowerCase())
    }

    // useLocation returns obj w path information
    const currentPath = useLocation().pathname
    // checking active tab on refresh
    useEffect(() => {

        if (currentPath.length > 1) {
            const currentPathKeyWord = currentPath.split('/')[1]

            setTabActive(currentPathKeyWord)


        } else {
            setTabActive('fridge')
        }
    }, [currentPath])

    return (
        <>
            {/* MAIN CONTENT */}
            <main>
                <div className="wrapper">
                    {/* NAV */}
                    <nav>
                        <ul className='displayTabs'>
                            <li >
                                <Link
                                    to='/'
                                    onClick={handleTabActive}
                                    className={tabActive === 'fridge' ? 'tabItem active' : 'tabItem'}>Fridge
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to='/grocery'
                                    onClick={handleTabActive}
                                    className={tabActive === 'grocery' ? 'tabItem active' : 'tabItem'}>Grocery
                                </Link>
                            </li>
                        </ul>
                    </nav>

                    {/* ROUTING LOGIC */}
                    <Routes>

                        {/* FRIDGE PATH */}
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
                                    setSearchError={setSearchError}
                                />} />

                        {/* GROCERY PATH */}
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
                                    setSearchError={setSearchError}
                                />} />
                        {/* END OF ROUTING LOGIC */}
                    </Routes>

                </div>

            </main>
        </>

    )
}

export default ListsInfo;