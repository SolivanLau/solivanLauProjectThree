// firebase integration
import firebaseDB from './Firebase';
import { getDatabase, ref, remove } from 'firebase/database';
import { useEffect, useState } from 'react';

// database details and reference
const database = getDatabase(firebaseDB)

const FoodItem = ({ name, fbId, imgFile, altText, currentMode }) => {
    // STATES
    const [expDate, setExpDate] = useState('');
    const [daysToExpire, setDaysToExpire] = useState('');
    const [dateToday, setDateToday] = useState('')



    //REMOVE BUTTON: removes item from firebase via id, onvalue updateslocal array, gallery contents rerender
    const handleRemove = () => {
        const foodItemRef = ref(database, `fridgeList/${fbId}`)
        remove(foodItemRef)
    }

    // control exp input
    const handleExp = (event) => {
        const date = event.target.value;
        setExpDate(date)

    }

    const todayFull = new Date();
    const todayDate = todayFull.getDate();
    const todayMonth = todayFull.getMonth() + 1;
    const todayYear = todayFull.getFullYear();




    useEffect(() => {
        if (expDate !== '') {
            const dateArr = expDate.split('-');

            console.log(dateArr.map(Number))



        }
    }, [expDate])
    return (
        <div className='foodItem'>
            <h3>{name}</h3>
            <div className="foodImgContainer">
                <img src={`https://spoonacular.com/cdn/ingredients_100x100/${imgFile}`} alt={altText} />
            </div>
            {currentMode.title !== 'fridge' ? null :
                <form action="" className="expForm">
                    <label htmlFor="expDate">Expires in: </label>
                    <input
                        type="date"
                        name="expDate"
                        id="expDate"
                        onChange={handleExp}
                        value={expDate}
                    />
                </form>
            }

            <button onClick={handleRemove}>
                <span>delete current food item</span>
            </button>
        </div>
    )
}

export default FoodItem;