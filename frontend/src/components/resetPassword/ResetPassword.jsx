import "./resetPassword.scss";
import PasswordInputBox from "./../passwordInputBox/PasswordInputBox";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { clearSuccessMessage, successMessage } from "../../redux/userSlice";
import Toast from "../toast/Toast";

const ResetPassword = () => {
  const dispatch = useDispatch();

  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const passwordChangeHandler = (initialPassword) => {
    setPassword(initialPassword);
  };
  const confirmPasswordChangeHandler = (initialPassword) => {
    setConfirmPassword(initialPassword);
  };
  const emailChangeHandler = (e) => {
    setEmail(e.target.value);
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`/api/v1/resetPassword/${token}`, {
        method: "PATCH",
        body: JSON.stringify({
          email,
          password,
          confirmPassword,
          token,
        }),
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      if (response.ok) {
        navigate("/");
        dispatch(successMessage(data.message));
        setTimeout(() => {
          dispatch(clearSuccessMessage());
        }, 3000);
      } else {
        setError(data.message);
        setTimeout(() => {
          setError(null);
        }, 3000);
      }
    } catch (err) {
      // console.log(err);
    }
  };
  return (
    <>
      {error && <Toast classname={"error"} text={error} />}

      <div className="reset-password-page">
        <h1>Reset your Password</h1>
        <form onSubmit={submitHandler}>
          <div className="input-div">
            <label htmlFor="email"></label>
            <input
              type="email"
              placeholder="Enter your email"
              required
              value={email}
              onChange={emailChangeHandler}
            />
          </div>

          <PasswordInputBox
            initialPassword={password}
            passwordHandler={passwordChangeHandler}
            placeholder={"Enter your new password"}
            id={"newPassword"}
          />
          <PasswordInputBox
            initialPassword={confirmPassword}
            passwordHandler={confirmPasswordChangeHandler}
            placeholder={"Confirm password"}
            id={"confimrPassword"}
          />
          <button type="submit">Submit</button>
        </form>
      </div>
    </>
  );
};

export default ResetPassword;
