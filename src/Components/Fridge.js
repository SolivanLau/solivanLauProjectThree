// firebase integration
import firebaseDB from './Firebase';
import { getDatabase, ref, onValue } from 'firebase/database';
// hooks
import { useState, useEffect } from "react";

// Components
import Form from "./Form";
import Gallery from './Gallery';


// database details and reference
const database = getDatabase(firebaseDB)
const dbFridgeRef = ref(database, `fridgeList/`)



const Fridge = ({ userSearch, searchError, autoCompleteArr, pushFoodtoDB, handleChange, handleSuggest }) => {

    const fridgeMode = {
        title: 'fridge',
        styleClass: 'fridge',
        firebasePath: 'fridgeList'
    }
    // FRIDGE LIST STATE: contains all items from Firebase db to be rendered
    const [fridgeArr, setFridgeArr] = useState([])


    // SUBMITING FORM: if EVERY item in the autocomplete list does NOT match update error state, OTHERWISE, take the data and push  to firebase + reset input  val
    const handleSubmit = (event) => {
        event.preventDefault();
        console.log('Fridge form is submitted')
        pushFoodtoDB(dbFridgeRef)
    }


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
                    altText: remotefridgeData[item].altText,
                    expDate: remotefridgeData[item].expDate
                }

                localFridgeArr.push(foodStatObj)
            }

            setFridgeArr(localFridgeArr)
        })
    }, [])





    return (
        <section className="listDisplay fridge">
            <Form
                handleSubmit={handleSubmit}
                handleChange={handleChange}
                autoCompleteArr={autoCompleteArr}
                handleSuggest={handleSuggest}
                inputState={userSearch}
                searchError={searchError}
                currentMode={fridgeMode}
            />

            <Gallery
                currentArr={fridgeArr}
                currentMode={fridgeMode}
            />
        </section>
    )
}

export default Fridge;