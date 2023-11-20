import { useEffect, useState } from "react";
import "./updateProfile.scss";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import { useDispatch, useSelector } from "react-redux";
import { app } from "../../firebase";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import {
  updateStart,
  updateSuccess,
  updateFaill,
  successMessage,
  clearSuccessMessage,
  clearError,
} from "../../../redux/userSlice";
import Toast from "../../toast/Toast";
const UpdateProfile = () => {
  const { currentUser, successMsg, error } = useSelector(
    (state) => state.userReducer
  );

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [file, setFile] = useState(undefined);
  const [imageProgress, setImageProgress] = useState(null);
  const [imageError, setImageError] = useState(null);
  const [imageDownloadUrl, setImageDownloadUrl] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const [userData, setUserdata] = useState(null);
  const dispatch = useDispatch();

  const usernameChangeHandler = (e) => {
    setUsername(e.target.value);
  };
  const emailChangeHandler = (e) => {
    setEmail(e.target.value);
  };

  const fileChangeHandler = (e) => {
    setFile(e.target.files[0]);

    const reader = new FileReader();

    reader.onload = () => {
      if (reader.readyState === 2) {
        setAvatar(reader.result);
      }
    };
    reader.readAsDataURL(e.target.files[0]);
  };

  const handleUpload = async (file) => {
    const storage = getStorage(app);
    const filename = new Date().getTime() + file.name;
    const storageRef = ref(storage, filename);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setImageProgress(progress);
      },
      (error) => setImageError(error),
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) =>
          setImageDownloadUrl(downloadUrl)
        );
      }
    );
  };
  useEffect(() => {
    if (file) {
      handleUpload(file);
    }
  }, [file]);

  useEffect(() => {
    const fetchHandler = async () => {
      const response = await fetch(`/api/v1/profile`);
      const data = await response.json();
      setUserdata(data.data);
      setUsername(data.data.username);
      setEmail(data.data.email);
      if (response.ok) {
        dispatch(updateSuccess(data.data));
      }
    };
    fetchHandler();
  }, [dispatch]);

  const updateHandler = async (e) => {
    try {
      e.preventDefault();
      dispatch(updateStart());
      const response = await fetch(`/api/v1/updateProfile/${currentUser._id}`, {
        method: "PATCH",
        body: JSON.stringify({
          username,
          email,
          profilePicture: imageDownloadUrl
            ? imageDownloadUrl
            : currentUser.profilePicture,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (response.ok) {
        dispatch(updateSuccess(data.userData));
        dispatch(successMessage(data.message));
        setTimeout(() => {
          dispatch(clearSuccessMessage());
        }, 3000);
      } else {
        dispatch(updateFaill(data.message));
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
      {successMsg && <Toast classname={"success"} text={successMsg} />}
      {error && <Toast classname={"error"} text={error} />}

      <form onSubmit={updateHandler} className="update-profile-form">
        <div className="image-div">
          <input
            className="file-input"
            type="file"
            accept="image/*"
            onChange={fileChangeHandler}
          />
          <img
            src={avatar ? avatar : userData?.profilePicture}
            alt="profile-picture"
          />
          <CameraAltIcon className="camera-icon" />
          {imageProgress > 0 && imageProgress < 100 && (
            <p className="image-progress">Image uploading {imageProgress}%</p>
          )}
          {imageProgress == 100 && (
            <p className="image-uploaded">Image uploaded successfully</p>
          )}
          {imageError && <p className="image-error">{imageError}</p>}
        </div>
        <div className="input-div">
          <label htmlFor="username"></label>
          <input
            type="text"
            id="username"
            placeholder={currentUser?.username}
            value={username}
            onChange={usernameChangeHandler}
          />
        </div>
        <div className="input-div">
          <label htmlFor="email"></label>
          <input
            type="email"
            id="email"
            placeholder={currentUser?.email}
            value={email}
            onChange={emailChangeHandler}
          />
        </div>
        <button type="submit">Update</button>
      </form>
    </>
  );
};

export default UpdateProfile;
