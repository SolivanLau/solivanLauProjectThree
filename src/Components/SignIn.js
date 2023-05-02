import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { firebaseDB, firebaseAuth } from "./Firebase";
import { set, getDatabase, ref, get } from "firebase/database";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
const SignIn = ({ setUserPath }) => {
    // control generic input
    const controlFormInput = (event, setState) => {
        setState(event.target.value)
    }

    // controlled inputs
    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('');
    const [passVisible, setPassVisible] = useState(false)

    // sign up OR login functionality
    const [signUpMode, setSignUpMode] = useState(false)
    // error state
    const [authError, setAuthError] = useState('')

    const navigate = useNavigate()





    // FIREBASE
    // database details and reference
    const database = getDatabase(firebaseDB)

    const signUp = (auth) => {
        console.log('trying to sign up')

        userName.length === 0 || password.length === 0 ? setAuthError('Please make sure your email or password is filled in!') :
            createUserWithEmailAndPassword(auth, email, password)
                .then((userCred) => {
                    console.log(userCred)
                    //set up firebase db w a new path
                    const newUserUid = userCred.user.uid;
                    // create new user space in db
                    set(ref(database, 'users/' + newUserUid), { userName: userName });
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
                const userUid = userCred.user.uid;
                console.log('welcome! ' + userUid)
                const userDBref = ref(database, 'users/' + userUid)

                get(userDBref)
                    .then((snapshot) => {
                        if (snapshot.exists()) {
                            console.log('user db exists')
                            navigate('/fridge')
                        }
                        else {
                            console.log('user db does not exist')
                            set(userDBref, { user: 'test' });
                            console.log('created user db')
                            navigate('/fridge')
                        }
                    })

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
        signUpMode ? signUp(firebaseAuth) : login(firebaseAuth);
    }

    // testing: Error log for auth
    useEffect(() => {
        if (authError) {
            console.log(authError)
        }
    }, [authError])


    useEffect(() => {
        if (signUpMode) {
            console.log('sign up mode')
        } else {
            console.log('log in mode')
        }
    }, [signUpMode])


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
                            className="seePassBtn signInBtns"
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

                <div className="authBtnsContainer">
                    {/* FORM SUBMIT BTN */}
                    <button type="submit" className="signInBtns submitBtn">{!signUpMode ? `Log In` : `Register`}</button>


                    <div className="altModeContainer">
                        <p>{!signUpMode ? `Need an account?` : `Already have an account?`}</p>

                        <button
                            type="button"
                            className="signInBtns"
                            onClick={() => { setSignUpMode(!signUpMode) }}>
                            {!signUpMode ? `Register` : `Login`} here
                        </button>
                    </div>

                    <div className="demoContainer">
                        <p>No time⌚? Try the public demo!</p>

                        <button
                            type="submit"
                            className="signInBtns"
                            onClick={() => { navigate('/fridge') }}>
                            Try Demo
                        </button>
                    </div>

                </div>
            </div>

        </form>
    )
}

export default SignIn;