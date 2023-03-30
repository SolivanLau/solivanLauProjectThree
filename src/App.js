import './css/App.css';

// COMPONENT IMPORTS
import ListsInfo from './Components/ListsInfo';

function App() {
  return (
    <div className="appContainer">
      <header>
        <div className="wrapper">
          <h1>Stock My Fridge!</h1>
        </div>
      </header>

      <ListsInfo />

      <footer>
        <div className="wrapper">
          <p>Made by Solivan Lau at JunoCollege 2023</p>
        </div>
      </footer>
    </div>


  )
}

export default App;
