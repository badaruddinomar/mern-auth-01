import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import {
  clearError,
  clearSuccessMessage,
  loginFaill,
  loginSuccess,
  successMessage,
} from "../../redux/userSlice";
import { useNavigate } from "react-router-dom";
const OAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const googleAuthHandler = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);
      const result = await signInWithPopup(auth, provider);
      const response = await fetch(`/api/v1/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: result.user.displayName,
          email: result.user.email,
          profilePicture: result.user.photoURL,
        }),
      });
      const data = await response.json();

      if (response.ok) {
        dispatch(loginSuccess(data.userData));
        navigate("/");
        dispatch(successMessage(data.message));
        setTimeout(() => {
          dispatch(clearSuccessMessage());
        }, 3000);
      } else {
        dispatch(loginFaill(data.message));
        setTimeout(() => {
          dispatch(clearError());
        }, 3000);
      }
    } catch (err) {
      // console.log(err);
    }
  };
  return (
    <button style={{ background: "#EA4335" }} onClick={googleAuthHandler}>
      Continue with google
    </button>
  );
};

export default OAuth;
