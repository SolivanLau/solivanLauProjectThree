import FoodItem from "./FoodItem";

const Gallery = ({ currentArr, currentMode }) => {
    return (
        // FOOT GALLERY
        <ul className={`foodList ${currentMode.styleClass}`}>

            {/* MAPPING FOOD OBJECT FROM FIREBASE */}

            {currentArr.length <= 0 ? null : currentArr.map((foodItemObj) => {
                return (
                    <FoodItem
                        key={foodItemObj.id}

                        name={foodItemObj.foodName}
                        fbId={foodItemObj.id}
                        imgFile={foodItemObj.imgLink}
                        altText={foodItemObj.altText}
                        expDate={foodItemObj.expDate}
                        currentMode={currentMode} />
                )
            })}
        </ul>

    )
}

export default Gallery;