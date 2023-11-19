/* eslint-disable react/prop-types */
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useState } from "react";

const PasswordInputBox = ({
  initialPassword,
  passwordHandler,
  placeholder,
  id,
}) => {
  const [password, setPassword] = useState(initialPassword);
  const [showPassword, setShowPassword] = useState(false);

  const passwordChangeHandler = (e) => {
    const currentPassword = e.target.value;
    setPassword(currentPassword);

    passwordHandler(currentPassword);
  };
  const showPasswordHandler = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="input-div">
      <label htmlFor={id}></label>
      <input
        type={showPassword ? "text" : "password"}
        placeholder={placeholder}
        id={id}
        value={password}
        onChange={passwordChangeHandler}
      />
      <i onClick={showPasswordHandler}>
        {showPassword ? (
          <RemoveRedEyeIcon className="eye-open" />
        ) : (
          <VisibilityOffIcon className="eye-close" />
        )}
      </i>
    </div>
  );
};

export default PasswordInputBox;
