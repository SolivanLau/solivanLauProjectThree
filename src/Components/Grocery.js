// firebase integration
import { firebaseDB } from './Firebase';
import { getDatabase, ref, onValue } from 'firebase/database';
// hooks
import { useState, useEffect } from "react";

// Components
import Form from "./Form";
import Gallery from './Gallery';


// database details and reference
const database = getDatabase(firebaseDB)

const Grocery = ({ userSearch, searchError, autoCompleteArr, pushFoodtoDB, handleChange, handleSuggest, setSearchError, userPath }) => {

    const dbGroceryRef = ref(database, `users/${userPath}/groceryList/`)

    const groceryMode = {
        title: 'Grocery List',
        styleClass: 'grocery',
        firebasePath: `users/${userPath}/groceryList`,
        switchFirebasePath: `users/${userPath}/fridgeList`,
        switchListTitle: `users/${userPath}/fridge`
    }

    // GROCERY LIST STATE: contains all items from Firebase db to be rendered
    const [groceryArr, setGroceryArr] = useState([])

    const handleSubmit = (event) => {
        event.preventDefault();
        pushFoodtoDB(dbGroceryRef)
    }

    useEffect(() => {
        onValue(dbGroceryRef, (groceryData) => {
            const remoteGroceryData = groceryData.val()

            const localGroceryArr = []

            for (let item in remoteGroceryData) {
                const foodStatObj = {
                    id: item,
                    foodName: remoteGroceryData[item].name,
                    imgLink: remoteGroceryData[item].imageUrl,
                    altText: remoteGroceryData[item].altText,
                    expDate: remoteGroceryData[item].expDate
                }

                localGroceryArr.push(foodStatObj)
            }

            setGroceryArr(localGroceryArr)
        })
    }, [])

    return (
        <section className='listDisplay grocery'>
            <Form
                handleSubmit={handleSubmit}
                handleChange={handleChange}
                autoCompleteArr={autoCompleteArr}
                handleSuggest={handleSuggest}
                inputState={userSearch}
                searchError={searchError}
                currentMode={groceryMode}
                setSearchError={setSearchError}
            />

            <Gallery
                currentArr={groceryArr}
                currentMode={groceryMode}
            />

        </section>
    )
}

export default Grocery;