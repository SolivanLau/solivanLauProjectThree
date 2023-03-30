import { useEffect, useRef, useState } from "react"

const Form = ({ handleChange, autoCompleteArr, handleSuggest, inputState, handleSubmit, searchError, currentMode, setSearchError }) => {


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

        // adding click event listener to window
        window.addEventListener('click', handleWindowClick)

        return () => window.removeEventListener('click', handleWindowClick)
    }, [])


    // On component mount: when searchError is false, next click will remove the error
    useEffect(() => {

        const removeError = () => {
            if (searchError === true) {
                setSearchError(false)
            }
        }
        // adding click event listener to window
        window.addEventListener('click', removeError)

        return () => window.removeEventListener('click', removeError)

    }, [searchError, setSearchError])

    // WHEN SUGGESTION IS IN FOCUS: listen for enter key to fill suggestion
    const handleFocus = (event) => {
        event.target.addEventListener("keyup", (event) => {
            if (event.keyCode === 13) {
                handleSuggest(event)
            }
        })
    }

    return (
        <form onSubmit={handleSubmit} className={`listForm ${currentMode.title}`} autoComplete="off">


            <label htmlFor="fridgeStock">Update {currentMode.title.toLowerCase()}</label>

            <div className="autoCompleteContainer">

                {/* USER TEXT INPUT */}
                <input
                    type="text"
                    name="fridgeStock"
                    id="fridgeStock"
                    placeholder={`Add food to your ${currentMode.title.toLowerCase()}`}
                    className={` ${currentMode.title}input`}
                    onChange={handleChange}
                    value={inputState}
                    ref={inputRef}

                />

                {/* autoComplete arr maps here */}
                <ul tabIndex="-1" className={inputActive === false ? 'suggestionList hidden' : 'suggestionList'}>

                    {autoCompleteArr < 1 ? null : autoCompleteArr.map((suggestion) => {
                        return (
                            <li
                                key={suggestion.id}
                                onClick={handleSuggest}
                                onFocus={handleFocus}
                                tabIndex="0"
                                className="suggestion">

                                {suggestion.name}

                            </li>)
                    })}
                </ul>

                {searchError === true ?
                    <div className="errorMsg">
                        <p>Add an item that matches a suggestion!</p>
                        <div className="attentionContainer">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 96 960 960">
                                <path d="M479.911 936Q451 936 430.5 915.411q-20.5-20.588-20.5-49.5Q410 837 430.589 816.5q20.588-20.5 49.5-20.5Q509 796 529.5 816.589q20.5 20.588 20.5 49.5Q550 895 529.411 915.5q-20.588 20.5-49.5 20.5Zm0-240Q451 696 430.5 675.438 410 654.875 410 626V286q0-28.875 20.589-49.438Q451.177 216 480.089 216 509 216 529.5 236.562 550 257.125 550 286v340q0 28.875-20.589 49.438Q508.823 696 479.911 696Z" />
                            </svg>
                        </div>
                    </div> : null
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