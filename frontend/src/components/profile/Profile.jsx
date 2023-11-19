import "./profile.scss";
import UpdatePassword from "./updatePassword/UpdatePassword";
import UpdateProfile from "./updateProfile/UpdateProfile";
const Profile = () => {
  return (
    <div className="profile-page">
      <h1>Profile</h1>
      <UpdateProfile />
      <UpdatePassword />
    </div>
  );
};

export default Profile;
