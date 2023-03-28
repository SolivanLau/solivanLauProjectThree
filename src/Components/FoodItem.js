// firebase integration
import firebaseDB from './Firebase';
import { getDatabase, ref, remove, push, update } from 'firebase/database';
import { useEffect, useState } from 'react';

import ExpForm from './ExpForm';

// database details and reference
const database = getDatabase(firebaseDB)

const FoodItem = ({ name, fbId, imgFile, altText, expDate, currentMode }) => {
    // STATES

    // DIFFERENCE  of user set exp date vs. today's date
    const [daysToExpire, setDaysToExpire] = useState('');

    const [expError, setExpError] = useState(false)

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
        if (expDate) {


            const today = new Date()
            const userDate = new Date(expDate)
            // subtract today from exp date, returning it in milisec absolute val (always positive)
            const diffTime = (userDate - today)
            // miliseconds divided by calc for milisec in a day
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

            setDaysToExpire(diffDays)

            if (diffDays < 0) {
                setExpError(true)
            }

        }

    }, [expDate])



    return (
        <>
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

                    <div className="expCalcContainer">
                        <p>
                            {/* displaying daysToExpire NUMBER */}

                            {daysToExpire === false || daysToExpire <= 0 ? null : daysToExpire}


                            {/* displaying PLURAL/SINGULAR 'day' */}

                            {daysToExpire === '' || daysToExpire <= 0 ? null : (daysToExpire > 1 ? ' days left' : ' day left')}

                        </p>
                    </div>
                    {expError === false ? <p className='errorMsg'>Please enter a date <span className="attention">after</span> today's date... otherwise you may have some stinky {name}</p> : null}
                </>
            }


            <button className="symbolBtn removeBtn" onClick={handleRemove}>
                <span className='sr-only'>Delete {name} from {currentMode.title}</span>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 96 960 960" >
                    <path d="M480 618 270 828q-9 9-21 9t-21-9q-9-9-9-21t9-21l210-210-210-210q-9-9-9-21t9-21q9-9 21-9t21 9l210 210 210-210q9-9 21-9t21 9q9 9 9 21t-9 21L522 576l210 210q9 9 9 21t-9 21q-9 9-21 9t-21-9L480 618Z" />
                </svg>
            </button>

        </>
    )
}

export default FoodItem;