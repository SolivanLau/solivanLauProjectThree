// hook imports
import { useState, useEffect } from 'react';
import axios from 'axios';

// component imports
import Form from './Form';

const FridgeDisplay = () => {
    // users search value via text input
    const [searchQuery, setSearchQuery] = useState('lettuce')

    const apiKey = 'ded5c74380c9499a9c4afe36760a8eb2'
    const secondaryApiKey = 'b2b9ba71b80745c19b07bc43b138f85e'

    const sampleCall = () => {
        axios({
            url: 'https://api.spoonacular.com/food/ingredients/autocomplete',
            params: {
                apiKey: process.env.API_KEY_ONE,
                query: searchQuery,
                number: 10,
                metaInformation: true
            }
        }).then((apiData) => {
            console.log(apiData)
        })
    }

    // FORM HANDLE SUBMIT
    const handleSearch = (event) => {
        //prevent default state
        event.preventDefault();

    }


    return (
        <section>
            <h2>testing</h2>
            <Form handleSearch={handleSearch} />
        </section>
    );

}

export default FridgeDisplay;