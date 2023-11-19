import Toast from "../toast/Toast";
import "./home.scss";
import { useSelector } from "react-redux";
const Home = () => {
  const { successMsg } = useSelector((state) => state.userReducer);
  return (
    <>
      {successMsg && <Toast classname={"success"} text={successMsg} />}

      <div className="home-page">
        <h1>Home page</h1>
        <p>
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ducimus
          rerum consequatur libero quasi doloremque eos eveniet obcaecati
          consectetur nobis perferendis.
          <br /> Lorem ipsum dolor sit amet consectetur adipisicing elit.
          Aliquid, molestias molestiae. Consequuntur, placeat adipisci at
          exercitationem maxime voluptatem reprehenderit quas.
        </p>
      </div>
    </>
  );
};

export default Home;
