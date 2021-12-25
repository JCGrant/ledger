import { Link } from "react-router-dom";

const Home = ({ user, users }) => {
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
      <div>
        <h2>User Profiles</h2>
        {users.map((user) => (
          <div key={user.id}>
            <Link to={`/users/${user.id}`}>{user.name}</Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
