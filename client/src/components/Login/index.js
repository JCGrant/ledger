import { useState } from "react";
import Select from "react-select";

const Login = ({ users, onLogin }) => {
  const [itemId, setItemId] = useState(undefined);

  const onChangeItem = (e) => {
    setItemId(e.value);
  };

  const onClickLogin = () => {
    onLogin(itemId);
  };

  return (
    <div>
      <h1>Login</h1>
      <Select
        onChange={onChangeItem}
        options={Object.values(users).map(({ id, name }) => ({
          value: id,
          label: name,
        }))}
      />
      <button onClick={onClickLogin}>Login</button>
    </div>
  );
};

export default Login;
