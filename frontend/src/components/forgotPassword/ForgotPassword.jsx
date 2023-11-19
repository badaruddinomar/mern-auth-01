import { useState } from "react";
import "./forgotPassword.scss";
import { useDispatch, useSelector } from "react-redux";
import { clearSuccessMessage, successMessage } from "../../redux/userSlice";
import Toast from "../toast/Toast";

const ForgotPassword = () => {
  const { successMsg } = useSelector((state) => state.userReducer);

  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  const emailChangeHandler = (e) => {
    setEmail(e.target.value);
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    const response = await fetch(`/api/v1/forgotPassword`, {
      method: "POST",
      body: JSON.stringify({ email }),
      headers: { "Content-Type": "application/json" },
    });

    const data = await response.json();
    if (response.ok) {
      dispatch(successMessage(data.message));
      setTimeout(() => {
        dispatch(clearSuccessMessage());
      }, 3000);
      setEmail("");
    } else {
      setError(data.message);
      setTimeout(() => {
        setError(null);
      }, 3000);
    }
  };

  return (
    <>
      {successMsg && <Toast classname={"success"} text={successMsg} />}
      {error && <Toast classname={"error"} text={error} />}

      <div className="forgot-password">
        <h1>Forgot Password?</h1>
        <p>If you forgot your password</p>
        <li>Step 1: Send your email.</li>

        <form onSubmit={submitHandler}>
          <div className="input-div">
            <label htmlFor="email"></label>
            <input
              type="email"
              required
              placeholder="Enter your email"
              value={email}
              onChange={emailChangeHandler}
            />
          </div>

          <button type="submit">Send</button>
        </form>
      </div>
    </>
  );
};

export default ForgotPassword;
