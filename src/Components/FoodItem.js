// firebase integration
import firebaseDB from './Firebase';
import { getDatabase, ref, remove, update } from 'firebase/database';
import { useEffect, useState } from 'react';

import ExpForm from './ExpForm';

// database details and reference
const database = getDatabase(firebaseDB)

const FoodItem = ({ name, fbId, imgFile, altText, expDate, currentMode }) => {
    // STATES

    // userExp
    const [userExp, setUserExp] = useState('')

    // DIFFERENCE of user selected exp date vs. today's date
    const [daysToExpire, setDaysToExpire] = useState('');

    // ERROR: true when day's to expire is a negative value
    const [expError, setExpError] = useState(false)

    // EXPIRED: when user returns on different day, if number is negative change 

    const [expired, setExpired] = useState(false)

    // FUNCTIONS


    //REMOVE BUTTON: removes item from firebase via id, onvalue updateslocal array, gallery contents rerender
    const handleRemove = () => {
        const foodItemRef = ref(database, `${currentMode.firebasePath}/${fbId}`)
        remove(foodItemRef)
    }

    // control expiry input: 
    const handleUserDate = (event) => {
        setUserExp(event.target.value)
    }


    // when user input changes: check if date is valid (needs to be ahead of todays date)
    useEffect(() => {
        if (userExp !== '') {

            const today = new Date()
            const userDate = new Date(userExp)
            // subtract today from exp date, returning it in milisec absolute val (always positive)
            const diffTime = (userDate - today)
            // miliseconds divided by calc for milisec in a day
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

            if (diffDays < 0) {

                console.log('ERROR - will NOT be sent to DB')
                setExpError(true)
            } else {

                console.log('passed vibe check')

                setExpError(false)
                updateFBExp()
            }
        }



    }, [userExp])

    // ONCHAGE, take user selected date and send to firebase
    const updateFBExp = () => {
        // user selected date
        const date = { expDate: userExp };
        // ref to specific firebase item
        const foodItemExpRef = ref(database, `fridgeList/${fbId}`)
        // take user input and update on firebase 
        update(foodItemExpRef, date)
    }

    // ANY TIME FIREBASE EXP VALUE CHANGES: 
    useEffect(() => {
        // setUserExp(expDate)
        // if user's set exp date is NOT an empty string, calc difference of today's date and user date
        if (expDate) {
            const today = new Date()
            const userDate = new Date(expDate)
            // subtract today from exp date, returning it in milisec absolute val (always positive)
            const diffTime = (userDate - today)
            // miliseconds divided by calc for milisec in a day
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

            setDaysToExpire(diffDays)

            // if the difference is a negative val, create error msg
            if (diffDays < 0) {
                setExpired(true)
            } else {
                setExpired(false)
            }
        }

    }, [expDate])

    // TEMPORARY: to remove error message user can click anywhere on screen to reset
    useEffect(() => {
        const removeExpError = () => {
            if (expError === true) {
                setExpError(false)
                // // ref to specific firebase item
                // const foodItemExpRef = ref(database, `fridgeList/${fbId}`);

                // // creating empty value for expdate property
                // const date = { expDate: '' };
                // // take user input and update on firebase 
                // update(foodItemExpRef, date)
            }
        }
        // adding click event listener to window
        window.addEventListener('click', removeExpError)

        return () => window.removeEventListener('click', removeExpError)
    }, [expError])

    return (
        // FOOD ITEM: parent is li w className= FOODITEM
        <li className={expired ? "foodItem expired" : "foodItem"}>
            {/* FOOD ITEM'S NAME */}
            <h3 className='foodTitle'>{name}</h3>


            {/* FOOD ITEM'S IMG */}

            <div className="foodImgContainer">
                <img src={`https://spoonacular.com/cdn/ingredients_100x100/${imgFile}`} alt={altText} />
            </div>

            {/* FOOD ITEM'S EXPIRY FORM and DISPLAY (SPECIFIC TO FRIDGE GALLERY ONLY)*/}

            {currentMode.title !== 'fridge' ? null :
                <>
                    {/* EXPIRY FORM */}
                    <ExpForm
                        handleUserDate={handleUserDate}
                        expDate={expDate}
                    />
                    {/* EXPIRY DISPLAY (clac difference of user set date and ) */}

                    <div className="expDisplay">

                        {/* displaying daysToExpire NUMBER if number is greater than 0 */}

                        {daysToExpire === false || daysToExpire <= 0 ? null :
                            <p>
                                {daysToExpire}

                                {/* displaying PLURAL/SINGULAR 'day' */}

                                {daysToExpire === '' || daysToExpire <= 0 ? null : (daysToExpire > 1 ? ' days left' : ' day left')}
                            </p>
                        }





                        {/* ERROR MSG IF user enters date before today's date */}

                        {expError === true ?

                            <p className='errorMsg'>
                                Enter a date <span className="attention">after</span> today's date... or you might have some stinky {name}
                            </p> : null}

                    </div>
                </>
            }

            {/* REMOVE FOOD ITEM BUTTON */}
            <button className="symbolBtn removeBtn" onClick={handleRemove}>
                <span className='sr-only'>Delete {name} from {currentMode.title}</span>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 96 960 960" >
                    <path d="M480 618 270 828q-9 9-21 9t-21-9q-9-9-9-21t9-21l210-210-210-210q-9-9-9-21t9-21q9-9 21-9t21 9l210 210 210-210q9-9 21-9t21 9q9 9 9 21t-9 21L522 576l210 210q9 9 9 21t-9 21q-9 9-21 9t-21-9L480 618Z" />
                </svg>
            </button>

        </li>
    )
}

export default FoodItem;