import FoodItem from "./FoodItem";

const Gallery = ({ currentArr, currentMode }) => {

    return (
        <>
            <h2>Gallery</h2>
            <ul>
                {currentArr.length <= 0 ? null : currentArr.map((foodItemObj) => {
                    return (
                        <li key={foodItemObj.id}>
                            <FoodItem name={foodItemObj.foodName} fbId={foodItemObj.id} imgFile={foodItemObj.imgLink} altText={foodItemObj.altText} currentMode={currentMode} />
                        </li>)
                })}
            </ul>
        </>

    )
}

export default Gallery;