import { Info } from '../assets/icons';
const AuthSuccessModal = ({ email, handleSignupSuccess }) => {
  return (
    // MODAL BACKGROUND
    <aside className="authModalContainer">
      {/* MODAL */}
      <div className="modal">
        {/* STATUS ICON */}
        <div className="status statusSuccess">
          <Info />
        </div>
        {/* ERROR MESSAGE */}
        <div className="authError">
          <h3>All Set 🛒</h3>
          <p>
            Successfully created account with <strong>{email}</strong>!
          </p>

          <button
            type="button"
            className="signInBtns"
            onClick={handleSignupSuccess}
          >
            Log in and Begin!
          </button>
        </div>
      </div>
    </aside>
  );
};
export default AuthSuccessModal;
