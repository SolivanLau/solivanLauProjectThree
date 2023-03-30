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
          <p>
            Made by <a href="https://www.solivanlau.com" target="_blank" rel="noopener noreferrer" className="connectLink">Solivan Lau</a> at <a href="https://www.junocollege.com/" target="_blank" rel="noopener noreferrer" className="connectLink">JunoCollege</a> 2023</p>
        </div>
      </footer>
    </div>


  )
}

export default App;
