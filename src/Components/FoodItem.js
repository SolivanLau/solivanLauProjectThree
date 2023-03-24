// firebase integration
import firebaseDB from './Firebase';
import { getDatabase, ref, remove } from 'firebase/database';

// database details and reference
const database = getDatabase(firebaseDB)

const FoodItem = ({ name, fbId, imgFile, altText }) => {

    //REMOVE BUTTON: removes item from firebase via id, onvalue updateslocal array, gallery contents rerender
    const handleRemove = () => {
        const foodItemRef = ref(database, `fridgeList/${fbId}`)
        remove(foodItemRef)
    }

    return (
        <div className='foodItem'>

            <div className="foodImgContainer">
                <img src={`https://spoonacular.com/cdn/ingredients_100x100/${imgFile}`} alt={altText} />
            </div>
            <h3>{name}</h3>
            <button onClick={handleRemove}>
                <span>delete current food item</span>
            </button>
        </div>
    )
}

export default FoodItem;