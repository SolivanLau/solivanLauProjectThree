import './css/App.css';

// COMPONENT IMPORTS
import ListsInfo from './Components/ListsInfo';
import Footer from './Components/Footer';

function App() {
  return (
    <div className="appContainer">
      {/* HEADER */}
      <header>
        <div className="wrapper">
          <h1>Stock My Fridge!</h1>
        </div>
      </header>

      {/* MAIN DISPLAY */}
      <ListsInfo />

      {/* FOOTER */}
      <Footer />
    </div>
  );
}

export default App;
