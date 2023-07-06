// FIREBASE INTEGRATION
import { push } from 'firebase/database';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { firebaseAuth } from './Firebase';

// HOOKS
import axios from 'axios';
import {
  Link,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import { useState, useEffect } from 'react';

// COMPONENTS
import Fridge from './Fridge';
import Grocery from './Grocery';
import About from './About';
import SignIn from './SignIn';
import { Info } from '../assets/icons';
const ListsInfo = () => {
  // SEARCH INPUT STATES

  // controlled input value
  const [userSearch, setUserSearch] = useState('');

  // match error: must match one of the results
  const [searchError, setSearchError] = useState(false);
  // auto complete result
  const [autoCompleteArr, setAutocompleteArr] = useState([]);

  // TAB ACTIVE CLASS STATE
  const [tabActive, setTabActive] = useState('');

  // router
  const navigate = useNavigate();

  // USER DB PATH INFO

  // return true/false if current suggestion's name DOES NOT match user input
  const searchEval = (suggestion) => {
    return suggestion.name !== userSearch;
  };

  // evaluates whether user input matches any suggestion, then pushes to db
  const pushFoodtoDB = (reference) => {
    // if no suggestions match user input, return true
    const matchSuggestionFailed = autoCompleteArr.every(searchEval);

    // IF ALL suggestions does not match user's inputted item, create an error message
    if (matchSuggestionFailed === true) {
      setSearchError(true);
    } else {
      // OTHERWISE remove error msg
      setSearchError(false);

      // find matching item from arrray
      const searchMatch = autoCompleteArr.find((foodItem) => {
        return foodItem.name === userSearch;
      });

      // place needed values in a template obj
      const foodItemObj = {
        name: searchMatch.name,
        imageUrl: searchMatch.image,
        altText: `Image of a ${searchMatch.name}`,
        expDate: '',
      };

      // push template object to firebase
      push(reference, foodItemObj);
      setUserSearch('');
    }
  };

  // handle and control user text input
  const handleChange = (event) => {
    const userInput = event.target.value.toLowerCase();
    setUserSearch(userInput);
  };

  // handle autocomplete items: sets userSearch(text input) to clicked value
  const handleSuggest = (event) => {
    setUserSearch(event.target.textContent);
  };

  // AUTOCOMPLETE API CALL: provides list based on text input change
  useEffect(() => {
    axios({
      url: 'https://api.spoonacular.com/food/ingredients/autocomplete',
      params: {
        apiKey: process.env.REACT_APP_API_KEY_ONE,
        query: userSearch,
        number: 20,
        metaInformation: true,
      },
    })
      .then((apiData) => {
        const autoCompleteData = apiData.data;
        setAutocompleteArr(autoCompleteData);
        // console.log(autoCompleteArr)
      })
      .catch((error) => {
        console.log(error.statusText);
      });
  }, [userSearch]);

  // TAB ACTIVE HANDLER: setsState to tab title (string)

  const handleTabActive = (event) => {
    setTabActive(event.target.textContent.trim().toLowerCase());
  };

  // useLocation returns obj w path information
  const currentPath = useLocation().pathname;
  // checking active tab on refresh
  useEffect(() => {
    if (currentPath.length > 1) {
      const currentPathKeyWord = currentPath.split('/')[1];
      setTabActive(currentPathKeyWord);
    } else {
      setTabActive('about');
    }
  }, [currentPath]);

  const [userPath, setUserPath] = useState('');

  useEffect(() => {
    onAuthStateChanged(firebaseAuth, (user) => {
      if (user) {
        const userId = user.uid;
        setUserPath(userId);
      } else {
        setUserPath('demo');
      }
    });
  }, []);

  const handleSignOut = () => {
    signOut(firebaseAuth).then(() => {
      navigate('/');
    });
  };

  return (
    <>
      {/* MAIN CONTENT */}
      <main>
        <div className="wrapper">
          {/* NAV */}
          <nav>
            <ul className="displayTabs">
              {/* ABOUT TAB */}
              <li>
                <Link
                  to="/"
                  className={
                    tabActive === 'about' ? 'tabItem active' : 'tabItem'
                  }
                  onClick={handleTabActive}
                >
                  <span className="sr-only">About</span>

                  <Info />
                </Link>
              </li>

              {/* FRIDGE TAB */}
              <li>
                <Link
                  to="/fridge"
                  onClick={handleTabActive}
                  className={
                    tabActive === 'fridge' ? 'tabItem active' : 'tabItem'
                  }
                >
                  Fridge
                </Link>
              </li>

              {/* GROCERY TAB */}
              <li>
                <Link
                  to="/grocery"
                  onClick={handleTabActive}
                  className={
                    tabActive === 'grocery' ? 'tabItem active' : 'tabItem'
                  }
                >
                  Grocery
                </Link>
              </li>
              {/* LOGIN TAB */}
              {userPath !== 'demo' ? null : (
                <li>
                  <Link
                    to="/logIn"
                    onClick={handleTabActive}
                    className={
                      tabActive === 'logIn' ? 'tabItem active' : 'tabItem'
                    }
                  >
                    Login
                  </Link>
                </li>
              )}

              {/* SIGN OUT TAB*/}

              {userPath !== 'demo' ? (
                <li>
                  <button
                    onClick={handleSignOut}
                    className="tabItem signOutTab"
                  >
                    Sign Out
                  </button>
                </li>
              ) : null}
            </ul>
          </nav>

          {/* ROUTING LOGIC */}
          <Routes>
            {/* ABOUT PATH */}
            <Route path="/" element={<About />} />

            {/* SIGN IN PATH */}
            <Route
              path="/logIn"
              element={
                <div className="tabDisplay">
                  <SignIn setUserPath={setUserPath} />
                </div>
              }
            />
            {/* FRIDGE PATH */}
            <Route
              path="/fridge"
              element={
                <Fridge
                  userSearch={userSearch}
                  searchError={searchError}
                  autoCompleteArr={autoCompleteArr}
                  pushFoodtoDB={pushFoodtoDB}
                  handleChange={handleChange}
                  handleSuggest={handleSuggest}
                  setSearchError={setSearchError}
                  userPath={userPath}
                />
              }
            />

            {/* GROCERY PATH */}
            <Route
              path="/grocery"
              element={
                <Grocery
                  userSearch={userSearch}
                  searchError={searchError}
                  autoCompleteArr={autoCompleteArr}
                  pushFoodtoDB={pushFoodtoDB}
                  handleChange={handleChange}
                  handleSuggest={handleSuggest}
                  setSearchError={setSearchError}
                  userPath={userPath}
                />
              }
            />
            {/* END OF ROUTING LOGIC */}
          </Routes>
        </div>
      </main>
    </>
  );
};

export default ListsInfo;
