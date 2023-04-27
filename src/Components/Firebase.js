// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from "firebase/auth";

// Firebase configuration

const firebaseConfig = {

    apiKey: "AIzaSyCV5T4IZZWECGQXTzfffqesKn0xbHb4D2s",

    authDomain: "stock-my-fridge.firebaseapp.com",

    projectId: "stock-my-fridge",

    storageBucket: "stock-my-fridge.appspot.com",

    messagingSenderId: "454781847048",

    appId: "1:454781847048:web:2f7c6ce1c069ffd92df3bd"

};


// Initialize Firebase

// init db
export const firebaseDB = initializeApp(firebaseConfig);
// init auth
export const firebaseAuth = getAuth(firebaseDB);
// export default firebaseDB;