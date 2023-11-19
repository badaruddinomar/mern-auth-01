import { Link } from "react-router-dom";
import "./navbar.scss";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { loginSuccess, signoutSuccess } from "../../redux/userSlice";
const Navbar = () => {
  const { isAuthenticated, currentUser } = useSelector(
    (state) => state.userReducer
  );
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchHandler = async () => {
      try {
        const response = await fetch(`/api/v1/profile`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        const data = await response.json();
        if (response.ok) {
          dispatch(loginSuccess(data?.data));
        }
        if (data.success === false) {
          dispatch(signoutSuccess());
        }
      } catch (err) {
        // console.log(err.message);
      }
    };
    fetchHandler();
  }, [dispatch]);
  return (
    <nav>
      <Link to={"/"} className="logo">
        Logo
      </Link>
      <ul>
        <li>
          <Link className="link" to={"/"}>
            Home
          </Link>
        </li>
        <li>
          <Link className="link" to={"/about"}>
            About
          </Link>
        </li>
        <li>
          {isAuthenticated ? (
            <Link to={"/profile"}>
              <img src={currentUser?.profilePicture} />
            </Link>
          ) : (
            <Link className="link" to="/signup">
              Sing up
            </Link>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
