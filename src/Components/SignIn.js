// ******** HOOKS ********
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// ******** FIREBASE INTEGRATION ********
import { firebaseDB, firebaseAuth } from './Firebase';
import { set, getDatabase, ref, get } from 'firebase/database';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
// ******** COMPONENTS AND ASSETS ********
import AuthErrModal from './AuthErrModal';
import { PassInvisIcon, PassVisIcon } from '../assets/icons';
import AuthSuccessModal from './AuthSuccessModal';
const SignIn = () => {
  // ******** STATES AND VARIABLES********

  // sign up OR login mode
  const [signUpMode, setSignUpMode] = useState(false);

  // user cred
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // password input visiblity
  const [passVisible, setPassVisible] = useState(false);

  // error state - triggers auth err modal
  const [authError, setAuthError] = useState('');

  // success state - triggers auth success modal on SIGN UP ONLY
  const [authSuccess, setAuthSuccess] = useState(false);

  // FIREBASE
  // database details and reference
  const database = getDatabase(firebaseDB);

  // REACT ROUTER DOM
  // navigate url
  const navigate = useNavigate();

  // ******** FUNCTIONS ********

  // control generic input
  const controlFormInput = (event, setState) => {
    setState(event.target.value);
  };

  // validate, then create account using email and pass. set up user db
  const signUp = (auth) => {
    email.length === 0 || password.length === 0
      ? setAuthError('Please make sure your email and password is filled in!')
      : createUserWithEmailAndPassword(auth, email, password)
          .then((userCred) => {
            //set up firebase db w a new path
            const newUserUid = userCred.user.uid;
            // create new user space in db
            set(ref(database, 'users/' + newUserUid), { userName: userName });
            setAuthSuccess(true);
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            setAuthError(
              `Having trouble registering: ${errorCode} ${errorMessage}`
            );
          });
  };

  // validate, then create account using email and pass. set up user db IF not found
  const login = (auth) => {
    email.length === 0 || password.length === 0
      ? setAuthError('Please make sure your email and password is filled in!')
      : signInWithEmailAndPassword(auth, email, password)
          .then((userCred) => {
            const userUid = userCred.user.uid;
            const userDBref = ref(database, 'users/' + userUid);
            get(userDBref).then((snapshot) => {
              if (snapshot.exists()) {
                navigate('/fridge');
              } else {
                set(userDBref, { user: 'test' });
                navigate('/fridge');
              }
            });
          })
          .catch((error) => {
            const errorCode = error.code;
            setAuthError(`Having trouble loggin in: ${errorCode}`);
          });
  };

  // ******** HANDLER FUNCTIONS ********

  // // HANDLER: SIGN IN
  const handleSubmit = (event) => {
    event.preventDefault();
    signUpMode ? signUp(firebaseAuth) : login(firebaseAuth);
  };

  const handleCloseModal = () => {
    setAuthError('');
  };

  const handleSignupSuccess = () => {
    login(firebaseAuth);
  };

  return (
    <form action="#" onSubmit={handleSubmit} className="authForm">
      <div className="wrapper">
        <h2>{!signUpMode ? `Login🔐` : `Register📝`}</h2>

        {/* NAME INPUT for SIGN UP */}

        {!signUpMode ? null : (
          <div className="inputContainer">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              type="text"
              name="name"
              onChange={(event) => {
                controlFormInput(event, setUserName);
              }}
            />
          </div>
        )}

        {/* EMAIL INPUT */}

        <div className="inputContainer">
          <label htmlFor="email">Email📧</label>
          <input
            id="email"
            type="email"
            name="email"
            onChange={(event) => {
              controlFormInput(event, setEmail);
            }}
          />
        </div>

        {/* PASSWORD INPUT */}
        <div className="inputContainer">
          <label htmlFor="password">Password🔑</label>

          <div className="passwordContainer">
            <input
              id="password"
              type={passVisible ? 'text' : 'password'}
              name="password"
              onChange={(event) => {
                controlFormInput(event, setPassword);
              }}
            />
            {/* PASSWORD VISIBLE BTN */}
            <button
              type="button"
              onClick={() => {
                setPassVisible(!passVisible);
              }}
              className="signInBtns seePassBtn"
            >
              {passVisible ? (
                <span className="sr-only">Password is visible to users</span>
              ) : (
                <span className="sr-only">Password is hidden to users</span>
              )}

              {passVisible ? <PassVisIcon /> : <PassInvisIcon />}
            </button>
          </div>
        </div>

        {/* FORM SUBMIT AND SETTINGS */}

        <div className="authBtnsContainer">
          {/* FORM SUBMIT BTN */}
          <button type="submit" className="signInBtns submitBtn">
            {!signUpMode ? `Log In` : `Register`}
          </button>

          {/* SWITCH AUTH MODE BUTTON */}
          <div className="altModeContainer">
            <p>
              {!signUpMode ? `Need an account?` : `Already have an account?`}
            </p>

            <button
              type="button"
              className="signInBtns"
              onClick={() => {
                setSignUpMode(!signUpMode);
              }}
            >
              {!signUpMode ? `Register` : `Login`} here
            </button>
          </div>

          {/* DEMO MODE BTN */}
          <div className="demoContainer">
            <p>No time⌚? Try the public demo!</p>

            <button
              type="submit"
              className="signInBtns"
              onClick={() => {
                navigate('/fridge');
              }}
            >
              Try Demo
            </button>
          </div>
        </div>
      </div>

      {authError && (
        <AuthErrModal
          authError={authError}
          handleCloseModal={handleCloseModal}
        />
      )}
      {authSuccess && (
        <AuthSuccessModal
          email={email}
          handleSignupSuccess={handleSignupSuccess}
        />
      )}
    </form>
  );
};

export default SignIn;
