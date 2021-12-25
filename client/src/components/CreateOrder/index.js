import { useState } from "react";
import Select from "react-select";

const CreateOrder = ({ items, onCreateOrder }) => {
  const [itemId, setItemId] = useState(undefined);
  const [direction, setDirection] = useState("buy");
  const [amount, setAmount] = useState(1);
  const [price, setPrice] = useState(0);

  const onChangeItem = (e) => {
    setItemId(e.value);
  };

  const onChangeDirection = (e) => {
    console.log(e.target.value);
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
    if (itemId === undefined) {
      return;
    }
    if (amount === undefined || amount === 0) {
      return;
    }
    if (price === undefined || price === 0) {
      return;
    }
    onCreateOrder({
      itemId,
      direction,
      amount,
      price,
    });
  };

  return (
    <div>
      <h1>Create an Order</h1>
      <Select
        onChange={onChangeItem}
        options={Object.values(items).map(({ id, name }) => ({
          value: id,
          label: name,
        }))}
      />
      <div>
        <select value={direction} onChange={onChangeDirection}>
          <option value="buy">Buy</option>
          <option value="sell">Sell</option>
        </select>
      </div>
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
      <div>
        <button onClick={onSubmitButton}>Submit</button>
      </div>
    </div>
  );
};

export default CreateOrder;
