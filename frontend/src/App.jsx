import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./components/home/Home";
import "./app.scss";
import Login from "./components/login/Login";
import Signup from "./components/signup/Signup";
import { useSelector } from "react-redux";
import Profile from "./components/profile/Profile";
import ForgotPassword from "./components/forgotPassword/ForgotPassword";
import ResetPassword from "./components/resetPassword/ResetPassword";
import About from "./components/about/About";
const App = () => {
  const { isAuthenticated } = useSelector((state) => state.userReducer);
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/about" element={<About />} />
          {!isAuthenticated && (
            <>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
            </>
          )}

          {isAuthenticated && <Route path="/profile" element={<Profile />} />}
          <Route path={"/forgotPassword"} element={<ForgotPassword />} />
          <Route path="/resetPassword/:token" element={<ResetPassword />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
