
const Form = ({ handleChange, autoCompleteArr, handleSuggest, inputState, handleSubmit }) => {

    // console.log(props)
    // console.log()


    // CONTROL TEXT INPUT: USER SEARCH
    return (
        <form onSubmit={handleSubmit}>
            {/* USER TEXT INPUT */}
            <label htmlFor="fridgeStock">Update your fridge</label>
            <input
                type="text"
                name="fridgeStock"
                id="fridgeStock"
                onChange={handleChange}
                value={inputState}
            />
            <button>Add item to fridge</button>

            {/* USER TEXT INPUT: map autocomplete arr here */}

            <ul>
                {autoCompleteArr < 1 ? null : autoCompleteArr.map((suggestion) => {
                    return (
                        <li
                            key={suggestion.id}
                            onClick={handleSuggest}>

                            {suggestion.name}
                        </li>)
                })}
            </ul>
        </form>
    )
}

export default Form;