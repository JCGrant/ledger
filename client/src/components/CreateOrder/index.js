import { useState } from "react";
import Select from "react-select";
import "./styles.scss";

const CreateOrder = ({ user, items, onCreateOrder }) => {
  const [selectedItem, setSelectedItem] = useState(undefined);
  const [direction, setDirection] = useState("buy");
  const [amount, setAmount] = useState(1);
  const [price, setPrice] = useState(0);

  const onChangeItem = (item) => {
    setSelectedItem(item);
  };

  const onChangeDirection = (e) => {
    setDirection(e.target.value);
  };

  const onChangeRequestedAmount = (e) => {
    const valueStr = e.target.value;
    const value = valueStr === "" ? undefined : parseInt(valueStr, 10);
    setAmount(value);
  };

  const onChangeRequestedPrice = (e) => {
    const valueStr = e.target.value;
    const value = valueStr === "" ? undefined : parseInt(valueStr, 10);
    setPrice(value);
  };

  const onSubmitButton = () => {
    if (selectedItem === undefined) {
      return;
    }
    if (amount === undefined || amount === 0) {
      return;
    }
    if (price === undefined || price === 0) {
      return;
    }
    onCreateOrder({
      itemId: selectedItem.value,
      direction,
      amount,
      price,
    });
    setSelectedItem(undefined);
    setDirection("buy");
    setAmount(1);
    setPrice(0);
  };

  return (
    <div className="create-order container">
      <h1 className="heading-1 bold">Create an Order</h1>
      <p>Num tokens: {user.numTokens}</p>
      <Select
        className="dropdown"
        value={selectedItem ?? null}
        onChange={onChangeItem}
        options={Object.values(items).map(({ id, name }) => ({
          value: id,
          label: name,
        }))}
      />
      <div className="button-wrapper">
        <select value={direction} onChange={onChangeDirection}>
          <option value="buy">Buy</option>
          <option value="sell">Sell</option>
        </select>
      </div>
      <div className="label-wrapper">
        <label>
          Amount:{" "}
          <input
            value={amount ?? ""}
            onChange={onChangeRequestedAmount}
            type="number"
          />
        </label>
        <label>
          Price:{" "}
          <input
            value={price ?? ""}
            onChange={onChangeRequestedPrice}
            type="number"
          />
        </label>
      </div>
      <div className="submit-wrapper">
        <button onClick={onSubmitButton}>Submit</button>
      </div>
    </div>
  );
};

export default CreateOrder;
