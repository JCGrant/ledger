import { useParams } from "react-router-dom";

const UserProfile = ({ userMap }) => {
  let { userId } = useParams();
  const { name, numTokens } = userMap[userId];
  return (
    <div>
      <h1>{name}'s Profile</h1>
      <p>Tokens: {numTokens}</p>
    </div>
  );
};

export default UserProfile;
