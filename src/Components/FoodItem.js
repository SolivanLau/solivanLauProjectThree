// firebase integration
import firebaseDB from './Firebase';
import { getDatabase, ref, remove, update, push } from 'firebase/database';
import { useEffect, useState } from 'react';

import ExpForm from './ExpForm';

// database details and reference
const database = getDatabase(firebaseDB)

const FoodItem = ({ name, fbId, imgFile, altText, expDate, currentMode }) => {

    const foodItemExpRef = ref(database, `fridgeList/${fbId}`)
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

    const switchList = () => {
        // place needed values in a template obj
        const foodItemObj = {
            name: name,
            imageUrl: imgFile,
            altText: `Image of a ${name}`,
            expDate: expDate
        }

        // create firebase reference to opposite list
        const oppositeListRef = ref(database, `${currentMode.switchFirebasePath}/`)

        // push template object to firebase
        push(oppositeListRef, foodItemObj)
        handleRemove()
    }

    // when user input changes: check if date is valid (needs to be ahead of todays date)
    useEffect(() => {
        console.log(userExp)
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

                // user selected date
                const date = { expDate: userExp };
                // take user input and update on firebase 
                update(foodItemExpRef, date)

                setUserExp('')
            }
        }

    }, [userExp, foodItemExpRef])
    console.log(userExp)

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
                        expired={expired}
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

                        {!expired ? null :
                            <div className="attentionContainer">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 96 960 960">
                                    <path d="M479.911 936Q451 936 430.5 915.411q-20.5-20.588-20.5-49.5Q410 837 430.589 816.5q20.588-20.5 49.5-20.5Q509 796 529.5 816.589q20.5 20.588 20.5 49.5Q550 895 529.411 915.5q-20.588 20.5-49.5 20.5Zm0-240Q451 696 430.5 675.438 410 654.875 410 626V286q0-28.875 20.589-49.438Q451.177 216 480.089 216 509 216 529.5 236.562 550 257.125 550 286v340q0 28.875-20.589 49.438Q508.823 696 479.911 696Z" />
                                </svg>
                            </div>
                        }


                        {/* ERROR MSG IF user enters date before today's date */}

                        {expError === true ?

                            <p className='errorMsg'>
                                Enter a date <span className="attention">after</span> today's date... or you might have some stinky {name}
                            </p> : null}

                    </div>
                </>
            }


            <div className="buttonContainer">

                {/* SWITCH LISTS CONTAINER */}

                <button
                    className="symbolBtn"
                    onClick={switchList}>

                    {/* SR ONLY TEXT */}
                    <span className='sr-only'>{`Send ${name} to ${currentMode.switchListTitle}`}</span>

                    {/* OPPOSITE LIST ICON  */}

                    {currentMode.title === 'fridge' ?
                        // sending to grocery list icon
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 96 960 960">
                            <path d="m810 677-71-71 29-29q8.311-8 21.156-8Q802 569 810 577l29 29q8 8.311 8 21.156Q847 640 839 648l-29 29ZM480 936v-71l216-216 71 71-216 216h-71ZM120 726v-60h300v60H120Zm0-165v-60h470v60H120Zm0-165v-60h470v60H120Z" />
                        </svg> :
                        // sending to fridge list
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
                            <g>
                                <path d="M25,13V4.26A2.26,2.26,0,0,0,22.74,2H9.26A2.26,2.26,0,0,0,7,4.26V25.74A2.25,2.25,0,0,0,9,28v1a1,1,0,0,0,2,0V28H21v1a1,1,0,0,0,2,0V28a2.25,2.25,0,0,0,2-2.23V17a1,1,0,0,0-2,0v8.74a.26.26,0,0,1-.26.26H9.26A.26.26,0,0,1,9,25.74V4.26A.26.26,0,0,1,9.26,4H22.74a.26.26,0,0,1,.26.26V12H11a1,1,0,0,0,0,2H24A1,1,0,0,0,25,13Z" />
                                <path d="M11,10a1,1,0,0,0,1-1V8a1,1,0,0,0-2,0V9A1,1,0,0,0,11,10Z" />
                                <path d="M10,17v2a1,1,0,0,0,2,0V17a1,1,0,0,0-2,0Z" />
                            </g>
                        </svg>
                    }
                </button>


                {/* REMOVE FOOD ITEM BUTTON */}

                <button className="symbolBtn removeBtn" onClick={handleRemove}>
                    <span className='sr-only'>{`Delete ${name} from ${currentMode.title}`}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 96 960 960" >
                        <path d="M480 618 270 828q-9 9-21 9t-21-9q-9-9-9-21t9-21l210-210-210-210q-9-9-9-21t9-21q9-9 21-9t21 9l210 210 210-210q9-9 21-9t21 9q9 9 9 21t-9 21L522 576l210 210q9 9 9 21t-9 21q-9 9-21 9t-21-9L480 618Z" />
                    </svg>
                </button>


            </div>




        </li>
    )
}

export default FoodItem;