import './App.css';

// COMPONENT IMPORTS

import { Fragment } from 'react';
import ListsInfo from './Components/ListsInfo';

function App() {
  return (
    <div className='App'>
      <header>
        <h1>Stock My Fridge!</h1>
      </header>
      <ListsInfo />
      <footer>
        <p>Solivan Lau at JunoCollege 2023</p>
      </footer>
    </div>
  )
}

export default App;
