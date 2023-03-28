import FoodItem from "./FoodItem";

const Gallery = ({ currentArr, currentMode }) => {
    return (
        // FOOT GALLERY
        <ul className={`foodList ${currentMode.styleClass}`}>

            {/* MAPPING FOOD OBJECT FROM FIREBASE */}

            {currentArr.length <= 0 ? null : currentArr.map((foodItemObj) => {
                return (
                    <li
                        key={foodItemObj.id}
                        className="foodItem">

                        <FoodItem
                            name={foodItemObj.foodName}
                            fbId={foodItemObj.id}
                            imgFile={foodItemObj.imgLink}
                            altText={foodItemObj.altText}
                            expDate={foodItemObj.expDate}
                            currentMode={currentMode} />
                    </li>)
            })}
        </ul>

    )
}

export default Gallery;