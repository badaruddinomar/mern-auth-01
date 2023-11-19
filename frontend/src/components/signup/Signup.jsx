import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./signup.scss";
import {
  loginFaill,
  loginStart,
  loginSuccess,
  clearError,
  successMessage,
  clearSuccessMessage,
} from "../../redux/userSlice";
import Toast from "./../toast/Toast";
import { useDispatch, useSelector } from "react-redux";
import OAuth from "../oAuth/OAuth";
import PasswordInputBox from "../passwordInputBox/PasswordInputBox";
const Signup = () => {
  const { loading, error, successMsg } = useSelector(
    (state) => state.userReducer
  );

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const usernameChangeHandler = (e) => {
    setUsername(e.target.value);
  };
  const emailChangeHandler = (e) => {
    setEmail(e.target.value);
  };
  const passwordChangeHandler = (currentPassword) => {
    setPassword(currentPassword);
  };
  const submitHandler = async (e) => {
    try {
      e.preventDefault();
      dispatch(loginStart());
      const response = await fetch(`/api/v1/signup`, {
        method: "POST",
        body: JSON.stringify({ username, email, password }),
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();

      if (response.ok) {
        dispatch(loginSuccess(data?.newUser));
        navigate("/");
        dispatch(successMessage(data.message));
        setTimeout(() => {
          dispatch(clearSuccessMessage());
        }, 3000);
      } else {
        dispatch(loginFaill(data?.message));
        setTimeout(() => {
          dispatch(clearError());
        }, 3000);
      }
    } catch (err) {
      // console.log(err);
    }
  };
  return (
    <>
      {error && <Toast classname={"error"} text={error} />}
      {successMsg && <Toast classname={"success"} text={successMsg} />}

      <div className="signup-page">
        <h1>Sign Up</h1>
        <form onSubmit={submitHandler}>
          <div className="input-div">
            <label htmlFor="username"></label>
            <input
              type="text"
              id="username"
              placeholder="Enter your name"
              value={username}
              onChange={usernameChangeHandler}
            />
          </div>
          <div className="input-div">
            <label htmlFor="email"></label>
            <input
              type="email"
              placeholder="Enter your email"
              id="email"
              value={email}
              onChange={emailChangeHandler}
            />
          </div>
          <PasswordInputBox
            initialPassword={password}
            passwordHandler={passwordChangeHandler}
            placeholder={"Enter your password"}
            id={password}
          />

          <button type="submit">{loading ? `Proccessing...` : `Submit`}</button>
          <OAuth />
          <div className="have-account">
            <p>Have an account?</p>
            <Link className="link" to={"/login"}>
              Login
            </Link>
          </div>
        </form>
      </div>
    </>
  );
};

export default Signup;
