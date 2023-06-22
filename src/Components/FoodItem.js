// firebase integration
import { firebaseDB } from './Firebase';
import { getDatabase, ref, remove, update, push, get } from 'firebase/database';
import { useEffect, useState } from 'react';

import ExpForm from './ExpForm';
import {
  AttentionIcon,
  RemoveIcon,
  ToFridgeIcon,
  ToGroceryIcon,
} from '../assets/icons';

// database details and reference
const database = getDatabase(firebaseDB);

const FoodItem = ({ name, fbId, imgFile, altText, expDate, currentMode }) => {
  const foodItemExpRef = ref(database, `${currentMode.firebasePath}/${fbId}`);
  // STATES

  // userExp
  const [userExp, setUserExp] = useState('');

  // DIFFERENCE of user selected exp date vs. today's date
  const [daysToExpire, setDaysToExpire] = useState('');

  // ERROR: true when day's to expire is a negative value
  const [expError, setExpError] = useState(false);

  // EXPIRED: when user returns on different day, if number is negative change

  const [expired, setExpired] = useState(false);

  // FUNCTIONS

  //REMOVE BUTTON: removes item from firebase via id, onvalue updateslocal array, gallery contents rerender
  const handleRemove = () => {
    const foodItemRef = ref(database, `${currentMode.firebasePath}/${fbId}`);
    get(foodItemExpRef, (snapshot) => {
      if (snapshot.exists()) {
        console.log(snapshot.val());
      }
    });
    remove(foodItemRef);
  };

  // control expiry input:
  const handleUserDate = (event) => {
    setUserExp(event.target.value);
  };

  const switchList = () => {
    // place needed values in a template obj
    const foodItemObj = {
      name: name,
      imageUrl: imgFile,
      altText: `Image of a ${name}`,
      expDate: expDate,
    };

    // create firebase reference to opposite list
    const oppositeListRef = ref(database, `${currentMode.switchFirebasePath}/`);

    // push template object to firebase
    push(oppositeListRef, foodItemObj);
    handleRemove();
  };

  // when user input changes: check if date is valid (needs to be ahead of todays date)
  useEffect(() => {
    if (userExp !== '') {
      const today = new Date();
      const userDate = new Date(userExp);
      // subtract today from exp date, returning it in milisec absolute val (always positive)
      const diffTime = userDate - today;
      // miliseconds divided by calc for milisec in a day
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays < 0) {
        setExpError(true);
      } else {
        setExpError(false);

        // user selected date
        const date = { expDate: userExp };
        // take user input and update on firebase
        update(foodItemExpRef, date);

        setUserExp('');
      }
    }
  }, [userExp, foodItemExpRef]);

  // ANY TIME FIREBASE EXP VALUE CHANGES:
  useEffect(() => {
    // setUserExp(expDate)
    // if user's set exp date is NOT an empty string, calc difference of today's date and user date
    if (expDate) {
      const today = new Date();
      const userDate = new Date(expDate);
      // subtract today from exp date, returning it in milisec absolute val (always positive)
      const diffTime = userDate - today;
      // miliseconds divided by calc for milisec in a day
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      setDaysToExpire(diffDays);

      // if the difference is a negative val, create error msg
      if (diffDays < 0) {
        setExpired(true);
      } else {
        setExpired(false);
      }
    }
  }, [expDate]);

  return (
    <li className={expired ? 'foodItem expired' : 'foodItem'}>
      <h3 className="foodTitle">{name}</h3>

      <div className="foodImgContainer">
        <img
          src={`https://spoonacular.com/cdn/ingredients_100x100/${imgFile}`}
          alt={altText}
        />
      </div>

      {/*  EXPIRY DATE FORM and DISPLAY (SPECIFIC TO FRIDGE GALLERY ONLY)*/}

      {currentMode.title !== 'fridge' ? null : (
        <>
          {/* EXPIRY FORM */}
          <ExpForm
            handleUserDate={handleUserDate}
            expDate={expDate}
            expired={expired}
          />
          {/* EXPIRY DISPLAY (clac difference of user set date and ) */}

          <div className="expDisplay">
            {/* displaying daysToExpire NUMBER if number is greater than 0 */}

            {daysToExpire === false || daysToExpire <= 0 ? null : (
              <p>
                {daysToExpire}

                {/* displaying PLURAL/SINGULAR 'day' */}

                {daysToExpire === '' || daysToExpire <= 0
                  ? null
                  : daysToExpire > 1
                  ? ' days left'
                  : ' day left'}
              </p>
            )}

            {!expired ? null : (
              <div className="attentionContainer">
                <AttentionIcon />
              </div>
            )}

            {/* ERROR MSG IF user enters date before today's date */}

            {expError === true ? (
              <p className="errorMsg">
                Enter a date <span className="attention">after</span> today's
                date... or you might have some stinky {name}
              </p>
            ) : null}
          </div>
        </>
      )}

      <div className="buttonContainer">
        {/* SWITCH LISTS CONTAINER */}

        <button className="symbolBtn" onClick={switchList}>
          {/* SR ONLY TEXT */}
          <span className="sr-only">{`Send ${name} to ${currentMode.switchListTitle}`}</span>

          {/* OPPOSITE LIST ICON  */}

          {currentMode.title === 'fridge' ? (
            // sending to grocery list icon
            <ToGroceryIcon />
          ) : (
            // sending to fridge list
            <ToFridgeIcon />
          )}
        </button>

        {/* REMOVE FOOD ITEM BUTTON */}

        <button className="symbolBtn removeBtn" onClick={handleRemove}>
          <span className="sr-only">{`Delete ${name} from ${currentMode.title}`}</span>
          <RemoveIcon />
        </button>
      </div>
    </li>
  );
};

export default FoodItem;
