// FIREBASE INTEGRATION
import { push } from 'firebase/database';
// HOOKS
import axios from 'axios';
import { Link, Routes, Route, useLocation } from 'react-router-dom';
import { useState, useEffect } from "react";

// COMPONENTS
import Fridge from './Fridge';
import Grocery from './Grocery';
import About from './About';
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
            setTabActive('about')
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
                            <li>
                                <Link
                                    to='/'
                                    className={tabActive === 'about' ? 'tabItem active' : 'tabItem'}
                                    onClick={handleTabActive}>

                                    <span className='sr-only'>
                                        About
                                    </span>
                                    <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 96 960 960" width="20">
                                        <path d="M483.175 776q12.825 0 21.325-8.625T513 746V566q0-12.75-8.675-21.375-8.676-8.625-21.5-8.625-12.825 0-21.325 8.625T453 566v180q0 12.75 8.675 21.375 8.676 8.625 21.5 8.625Zm-3.193-314q14.018 0 23.518-9.2T513 430q0-14.45-9.482-24.225-9.483-9.775-23.5-9.775-14.018 0-23.518 9.775T447 430q0 13.6 9.482 22.8 9.483 9.2 23.5 9.2Zm.284 514q-82.734 0-155.5-31.5t-127.266-86q-54.5-54.5-86-127.341Q80 658.319 80 575.5q0-82.819 31.5-155.659Q143 347 197.5 293t127.341-85.5Q397.681 176 480.5 176q82.819 0 155.659 31.5Q709 239 763 293t85.5 127Q880 493 880 575.734q0 82.734-31.5 155.5T763 858.316q-54 54.316-127 86Q563 976 480.266 976Zm.234-60Q622 916 721 816.5t99-241Q820 434 721.188 335 622.375 236 480 236q-141 0-240.5 98.812Q140 433.625 140 576q0 141 99.5 240.5t241 99.5Zm-.5-340Z" />
                                    </svg>

                                </Link>
                            </li>
                            <li >
                                <Link
                                    to='/fridge'
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
                        {/* ABOUT PATH */}
                        <Route
                            path='/'
                            element={<About />}
                        />
                        {/* FRIDGE PATH */}
                        <Route
                            path='/fridge'

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