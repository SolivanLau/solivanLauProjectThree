import { useEffect, useRef, useState } from "react"

const Form = ({ handleChange, autoCompleteArr, handleSuggest, inputState, handleSubmit, searchError, currentMode }) => {


    const [inputActive, setInputActive] = useState(false)



    // useRef gives direct access to DOM node via ref prop -> INPUT
    const inputRef = useRef(null)


    // On component render: check user click is on input via useRef -> if false, add hidden class to hide autoComplete list
    useEffect(() => {
        // handler that checks if clicked event matches input ref
        const handleWindowClick = (event) => {
            if (inputRef.current.contains(event.target)) {
                setInputActive(true)
            } else {
                setInputActive(false)
            }
        }

        // addind click event listener to window
        window.addEventListener('click', handleWindowClick)
        return () => window.removeEventListener('click', handleWindowClick)
    }, [])


    return (
        <form onSubmit={handleSubmit} className="listForm" autoComplete="off">


            <label htmlFor="fridgeStock">Update your {currentMode.title.toLowerCase()}</label>

            <div className="autoCompleteContainer">

                {/* USER TEXT INPUT */}
                <input
                    type="text"
                    name="fridgeStock"
                    id="fridgeStock"
                    placeholder={`Add food to your ${currentMode.title.toLowerCase()}`}
                    onChange={handleChange}
                    value={inputState}
                    ref={inputRef}
                />

                {/* autoComplete arr maps here */}
                <ul className={inputActive === false ? 'suggestionList hidden' : 'suggestionList'}>

                    {autoCompleteArr < 1 ? null : autoCompleteArr.map((suggestion) => {
                        return (
                            <li
                                key={suggestion.id}
                                onClick={handleSuggest}
                                className="suggestion">

                                {suggestion.name}

                            </li>)
                    })}
                </ul>

                {searchError === true ?
                    <p className="errorMsg">please submit an food item that matches a suggestion!</p> : null
                }
                <button className="symbolBtn addBtn">
                    <span className="sr-only">
                        Add to {currentMode.title.toLowerCase()}
                    </span>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 96 960 960" >
                        <path d="M479.825 856Q467 856 458.5 847.375T450 826V606H230q-12.75 0-21.375-8.675-8.625-8.676-8.625-21.5 0-12.825 8.625-21.325T230 546h220V326q0-12.75 8.675-21.375 8.676-8.625 21.5-8.625 12.825 0 21.325 8.625T510 326v220h220q12.75 0 21.375 8.675 8.625 8.676 8.625 21.5 0 12.825-8.625 21.325T730 606H510v220q0 12.75-8.675 21.375-8.676 8.625-21.5 8.625Z" />
                    </svg>
                </button>
            </div>



        </form>
    )
}

export default Form;