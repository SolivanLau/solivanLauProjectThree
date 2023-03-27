// firebase integration
import firebaseDB from './Firebase';
import { getDatabase, ref, remove, push, update } from 'firebase/database';
import { useEffect, useState } from 'react';

import ExpForm from './ExpForm';

// database details and reference
const database = getDatabase(firebaseDB)

const FoodItem = ({ name, fbId, imgFile, altText, expDate, currentMode }) => {
    // STATES
    // user set expiry date
    const [exp, setExp] = useState('');
    // calc DIFFERENCE  of user set exp date vs. today's date
    const [daysToExpire, setDaysToExpire] = useState('');



    //REMOVE BUTTON: removes item from firebase via id, onvalue updateslocal array, gallery contents rerender
    const handleRemove = () => {
        const foodItemRef = ref(database, `fridgeList/${fbId}`)
        remove(foodItemRef)
    }

    // control expiry input: ONCHAGE, take user selected date and send to firebase
    const handleExp = (event) => {
        // user selected date
        const date = { expDate: event.target.value };
        // ref to specific firebase item
        const foodItemExpRef = ref(database, `fridgeList/${fbId}`)
        // take user input and update on firebase 
        update(foodItemExpRef, date)
    }

    // ANY TIME USER CHANGES DATE INPUT VAL: calc difference and display to page
    useEffect(() => {
        if (expDate !== '') {
            const today = new Date()
            const userDate = new Date(expDate)
            // subtract today from exp date, returning it in milisec absolute val (always positive)
            const diffTime = Math.abs(userDate - today)
            // miliseconds divided by calc for milisec in a day
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

            setDaysToExpire(diffDays)
        }

    }, [expDate])



    return (
        <div className='foodItemContainer'>
            <h3>{name}</h3>
            <div className="foodImgContainer">
                <img src={`https://spoonacular.com/cdn/ingredients_100x100/${imgFile}`} alt={altText} />
            </div>
            {currentMode.title !== 'fridge' ? null :
                <>
                    <ExpForm
                        handleExp={handleExp}
                        expDate={expDate}
                    />

                    <div className="expCalContainer">
                        <p>{daysToExpire} {daysToExpire === '' ? null : (daysToExpire > 1 ? 'days left' : 'day left')}</p>
                    </div>
                </>
            }


            <button onClick={handleRemove}>
                <span>delete current food item</span>
            </button>
        </div>
    )
}

export default FoodItem;