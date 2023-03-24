// firebase integration
import firebaseDB from './Firebase';
import { getDatabase, ref, onValue, push } from 'firebase/database';
// hooks
import { useState, useEffect } from "react";
import axios from 'axios';

// Components
import Form from "./Form";
import Gallery from './Gallery';

const secondaryApiKey = 'b2b9ba71b80745c19b07bc43b138f85e'

// database details and reference
const database = getDatabase(firebaseDB)
const dbRef = ref(database)
const dbFridgeRef = ref(database, `fridgeList/`)
const dbGroceryRef = ref(database, `groceryList/`)

const ListsInfo = () => {
    return (
        // nav
        <>
            <nav>
                <ul className="displayTabs">
                    <li className="tab">

                    </li>
                    <li className="tab">

                    </li>
                </ul>
            </nav>
        </>

    )
}

export default ListsInfo;