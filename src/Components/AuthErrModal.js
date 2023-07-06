// ******** COMPONENTS AND ASSETS ********
import { Info } from '../assets/icons';

const AuthErrModal = ({ authError, handleCloseModal }) => {
  return (
    // MODAL BACKGROUND
    <aside className="authModalContainer">
      {/* MODAL */}
      <div className="modal">
        {/* STATUS ICON */}
        <div className="status statusError">
          <Info />
        </div>
        {/* ERROR MESSAGE */}
        <div className="authError">
          <h3>Oops...🚒</h3>
          <p>
            <strong>Error:</strong> {`${authError}`}
          </p>

          <button
            type="button"
            className="signInBtns"
            onClick={handleCloseModal}
          >
            Try Again
          </button>
        </div>
      </div>
    </aside>
  );
};
export default AuthErrModal;
