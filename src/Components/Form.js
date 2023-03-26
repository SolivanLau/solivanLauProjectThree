
const Form = ({ handleChange, autoCompleteArr, handleSuggest, inputState, handleSubmit, searchError, currentMode }) => {

    // console.log(props)


    // CONTROL TEXT INPUT: USER SEARCH
    return (
        <form onSubmit={handleSubmit}>
            {/* USER TEXT INPUT */}
            <label htmlFor="fridgeStock">Update your {currentMode.title.toLowerCase()}</label>
            <input
                type="text"
                name="fridgeStock"
                id="fridgeStock"
                onChange={handleChange}
                value={inputState}
            />
            <button>Add to {currentMode.title.toLowerCase()}</button>
            {searchError === true ?
                <p className="errorMsg">please submit an food item that matches a suggestion!</p> : null
            }

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