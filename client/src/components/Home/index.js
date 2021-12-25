import { Link } from "react-router-dom";

const Home = ({ user }) => {
  return (
    <div>
      <h1>Hello, {user.name}!</h1>
      <div>
        <p>
          <Link to={"/orders/new"}>Create an Order</Link>
        </p>
        <p>
          <Link to={"/orders"}>View existing Orders</Link>
        </p>
      </div>
    </div>
  );
};

export default Home;
