const Form = (props) => {

    // console.log(props)

    return (
        <form onSubmit={props.handleSearch}>
            {/* USER TEXT INPUT */}
            <label htmlFor="fridgeStock">Update your fridge</label>
            <input
                type="text" name="fridgeStock" id="fridgeStock"
            />
            <button>Add item to fridge</button>

            {/* USER TEXT INPUT: map autocomplete arr here */}

            <ul>
                <li>test item for autocomplete</li>
            </ul>
        </form>
    )
}

export default Form;