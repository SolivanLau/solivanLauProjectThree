import { useEffect, useState } from "react";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
const SignIn = () => {

    // controlled inputs
    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('');
    const [passVisible, setPassVisible] = useState(false)

    // sign up OR login functionality
    const [signUpMode, setSignUpMode] = useState(false)
    // error state
    const [authError, setAuthError] = useState('')

    // control generic input
    const controlFormInput = (event, setState) => {
        setState(event.target.value)
    }



    const signUp = (auth) => {
        console.log('trying to sign up')
        userName.length === 0 || password.length === 0 ? setAuthError('Please make sure your email or password is filled in!') :
            createUserWithEmailAndPassword(auth, email, password)
                .then((userCred) => {
                    console.log(userCred)
                    //set up firebase db w a new path
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    setAuthError(`Having trouble registering: ${errorCode} ${errorMessage}`)
                })
    }

    const login = (auth) => {
        console.log('trying to Login!')
        signInWithEmailAndPassword(auth, email, password)
            .then((userCred) => {
                console.log(userCred)
                console.log(auth.currentUser)

                console.log('welcome!')
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                setAuthError(`Having trouble loggin in: ${errorCode} ${errorMessage}`)
            })
    }

    // // HANDLER: SIGN IN
    const handleSubmit = (event) => {
        event.preventDefault();
        const auth = getAuth();

        signUpMode ? signUp(auth) : login(auth);
    }

    useEffect(() => {
        setUserName('')
        setEmail('')
        setPassword('')
    }, [])

    // testing: Error log for auth
    useEffect(() => {
        if (authError) {
            console.log(authError)
        }

    }, [authError])
    return (

        <form action="#" onSubmit={handleSubmit} className="authForm">
            <div className="wrapper">

                <h2>{!signUpMode ? `Log In` : `Register`}</h2>

                {/* NAME INPUT for SIGN UP */}

                {!signUpMode ? null :
                    <div className="inputContainer">
                        <label htmlFor="name">name</label>
                        <input
                            id="name"
                            type="text"
                            name="name"
                            onChange={(event) => { controlFormInput(event, setUserName) }}
                        />
                    </div>
                }

                {/* EMAIL INPUT */}

                <div className="inputContainer">
                    <label htmlFor="email">email</label>
                    <input
                        id="email"
                        type="email"
                        name="email"
                        onChange={(event) => { controlFormInput(event, setEmail) }}
                    />
                </div>

                {/* PASSWORD INPUT */}
                <div className="inputContainer">
                    <label htmlFor="password">password</label>

                    <div className="passwordContainer">
                        <input
                            id="password"
                            type={passVisible ? "text" : "password"}
                            name="password"
                            onChange={(event) => { controlFormInput(event, setPassword) }}
                        />

                        <button
                            type="button"
                            onClick={() => { setPassVisible(!passVisible) }}
                            className="seePassBtn"
                        >
                            {passVisible ?
                                <span className="sr-only">
                                    Password input is visible to users
                                </span> :
                                <span className="sr-only">
                                    Password input is hidden to users
                                </span>
                            }

                            {passVisible ? '0' : '--'}
                        </button>
                    </div>
                </div>

                {/* BUTTONS */}
                <button type="submit">{!signUpMode ? `Log In` : `Register`}</button>
                <p>{!signUpMode ? `Need an account?` : `Already have an account?`}</p>
                <button
                    type="button"
                    onClick={() => { setSignUpMode(!signUpMode) }}>{!signUpMode ? `Register` : `Login`} here</button>
            </div>

        </form>
    )
}

export default SignIn;