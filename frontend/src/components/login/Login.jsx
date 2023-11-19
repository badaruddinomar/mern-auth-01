import { useState } from "react";
import "./login.scss";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  clearError,
  clearSuccessMessage,
  loginFaill,
  loginStart,
  loginSuccess,
  successMessage,
} from "../../redux/userSlice";
import OAuth from "../oAuth/OAuth";
import Toast from "./../toast/Toast";
import PasswordInputBox from "../passwordInputBox/PasswordInputBox";

const Login = () => {
  const { loading, error, successMsg } = useSelector(
    (state) => state.userReducer
  );
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

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
      const response = await fetch(`/api/v1/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      console.log(data);
      if (response.ok) {
        dispatch(loginSuccess(data?.userData));
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
      console.log(err);
    }
  };
  return (
    <>
      {successMsg && <Toast classname={"success"} text={successMsg} />}
      {error && <Toast classname={"error"} text={error} />}

      <div className="login-page">
        <h1>Login</h1>
        <form onSubmit={submitHandler}>
          <div className="input-div">
            <label htmlFor="email"></label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
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

          <button type="submit">{loading ? `Processing...` : `login`}</button>
          <OAuth />
          <div className="have-account">
            <p>{`Don't have an account?`}</p>
            <Link className="link" to={"/signup"}>
              Signup
            </Link>
          </div>
          <Link className="forgot-password-link" to={"/forgotPassword"}>
            Forgot password?
          </Link>
        </form>
      </div>
    </>
  );
};

export default Login;
