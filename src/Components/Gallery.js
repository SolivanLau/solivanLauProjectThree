import FoodItem from "./FoodItem";

const Gallery = ({ fridgeArr }) => {

    return (
        <>
            <h2>Gallery</h2>
            <ul>
                {fridgeArr.length <= 0 ? null : fridgeArr.map((foodItemObj) => {
                    return (
                        <li key={foodItemObj.id}>
                            <FoodItem name={foodItemObj.foodName} fbId={foodItemObj.id} imgFile={foodItemObj.imgLink} altText={foodItemObj.altText} />
                        </li>)


                })}
            </ul>
        </>

    )
}

export default Gallery;