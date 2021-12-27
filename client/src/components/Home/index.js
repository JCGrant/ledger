import { Link } from "react-router-dom";

const Home = ({ user, users }) => {
  return (
    <div>
      <h1>Hello, {user.name}!</h1>
      <p>You have {user.numTokens} tokens</p>
      <div className="users-wrapper">
        <h2 className="heading-2">Other Users</h2>
        {users
          .sort((a, b) => b.numTokens - a.numTokens)
          .map((user) => (
            <div className="user" key={user.id}>
              <Link className="user-link" to={`/users/${user.id}`}>
                {user.name}
              </Link>{" "}
              - {user.numTokens} tokens
            </div>
          ))}
      </div>
    </div>
  );
};

export default Home;
