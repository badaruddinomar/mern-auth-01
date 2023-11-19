import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./updatePassword.scss";
import {
  signoutSuccess,
  deleteAccountStart,
  deleteAccountSuccess,
  successMessage,
  clearSuccessMessage,
} from "../../../redux/userSlice";
import PasswordInputBox from "../../passwordInputBox/PasswordInputBox";
import Toast from "../../toast/Toast";
const UpdatePassword = () => {
  const { successMsg } = useSelector((state) => state.userReducer);

  const [prevPassword, setPrevPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const prevPasswordChangeHandler = (password) => {
    // this password is comming from the child component by props--
    setPrevPassword(password);
  };
  const newPasswordChangeHandler = (password) => {
    setNewPassword(password);
  };
  const confirmPasswordHandler = (password) => {
    setConfirmPassword(password);
  };

  const signoutHandler = async () => {
    try {
      const response = await fetch(`/api/v1/signout`);
      const data = await response.json();
      if (response.ok) {
        dispatch(signoutSuccess());
        navigate("/login");
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
  const deleteAccountHandler = async () => {
    try {
      dispatch(deleteAccountStart());
      const response = await fetch(`/api/v1/deleteAccount`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (response.ok) {
        navigate("/signup");
        dispatch(deleteAccountSuccess());
        dispatch(successMessage(data.message));
        setTimeout(() => {
          dispatch(clearSuccessMessage());
        }, 3000);
      }
    } catch (err) {
      // console.log(err);
    }
  };
  const updatePasswordHandler = async (e) => {
    try {
      e.preventDefault();

      const response = await fetch(`/api/v1/updatePassword`, {
        method: "PATCH",
        body: JSON.stringify({ prevPassword, newPassword, confirmPassword }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (response.ok) {
        dispatch(successMessage(data.message));
        setTimeout(() => {
          dispatch(clearSuccessMessage());
        }, 3000);
        setPrevPassword("");
        setNewPassword("");
        setConfirmPassword("");
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
      {successMsg && <Toast classname={"success"} text={successMsg} />}
      {error && <Toast classname={"error"} text={error} />}

      <form onSubmit={updatePasswordHandler}>
        <h2 className="password-update-heading">Update password</h2>

        <PasswordInputBox
          initialPassword={prevPassword}
          passwordHandler={prevPasswordChangeHandler}
          placeholder={"Enter your previous password"}
          id={"prePassword"}
        />
        <PasswordInputBox
          initialPassword={newPassword}
          passwordHandler={newPasswordChangeHandler}
          placeholder={"Enter your new password"}
          id={"newPassword"}
        />
        <PasswordInputBox
          initialPassword={confirmPassword}
          passwordHandler={confirmPasswordHandler}
          placeholder={"Confirm password"}
          id={"confirmPassword"}
        />

        <button type="submit">Update</button>
        <div className="signout-btns">
          <span onClick={deleteAccountHandler}>Delete account</span>
          <span onClick={signoutHandler}>Signout</span>
        </div>
      </form>
    </>
  );
};

export default UpdatePassword;
