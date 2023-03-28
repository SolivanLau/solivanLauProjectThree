import FoodItem from "./FoodItem";

const Gallery = ({ currentArr, currentMode }) => {
    return (
        <article className={`gallery ${currentMode.styleClass}`}>
            <h2>Gallery</h2>
            <ul className="foodList">
                {currentArr.length <= 0 ? null : currentArr.map((foodItemObj) => {
                    return (
                        <li key={foodItemObj.id} className="foodItem">
                            <FoodItem name={foodItemObj.foodName} fbId={foodItemObj.id} imgFile={foodItemObj.imgLink} altText={foodItemObj.altText} expDate={foodItemObj.expDate} currentMode={currentMode} />
                        </li>)
                })}
            </ul>
        </article>

    )
}

export default Gallery;