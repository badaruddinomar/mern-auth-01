/* eslint-disable react/prop-types */
import "./toast.scss";

const Toast = ({ classname, text }) => {
  return (
    <div className={`toast ${classname} }`}>
      <p>{text}</p>
    </div>
  );
};

export default Toast;
