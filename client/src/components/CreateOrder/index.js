import { useState } from "react";
import Select from "react-select";

const CreateOrder = ({ options, onCreateOrder }) => {
  const [selectedItem, setSelectedItem] = useState(undefined);
  const [direction, setDirection] = useState("buy");
  const [requestedAmount, setRequestedAmount] = useState(1);
  const [requestedPrice, setRequestedPrice] = useState(0);

  const onChangeSelectedItem = (e) => {
    setSelectedItem(e.value);
  };

  const onChangeDirection = (e) => {
    console.log(e.target.value);
    setDirection(e.target.value);
  };

  const onChangeRequestedAmount = (e) => {
    const valueStr = e.target.value;
    const value = valueStr === "" ? undefined : parseInt(valueStr, 10);
    setRequestedAmount(value);
  };

  const onChangeRequestedPrice = (e) => {
    const valueStr = e.target.value;
    const value = valueStr === "" ? undefined : parseInt(valueStr, 10);
    setRequestedPrice(value);
  };

  const onSubmitButton = () => {
    if (selectedItem === undefined) {
      return;
    }
    if (requestedAmount === undefined || requestedAmount === 0) {
      return;
    }
    if (requestedPrice === undefined || requestedPrice === 0) {
      return;
    }
    onCreateOrder({ selectedItem, direction, requestedAmount, requestedPrice });
  };

  return (
    <div>
      <Select onChange={onChangeSelectedItem} options={options} />
      <div>
        <select value={direction} onChange={onChangeDirection}>
          <option value="buy">Buy</option>
          <option value="sell">Sell</option>
        </select>
      </div>
      <label>
        Amount:{" "}
        <input
          value={requestedAmount ?? ""}
          onChange={onChangeRequestedAmount}
          type="number"
        />
      </label>
      <label>
        Price:{" "}
        <input
          value={requestedPrice ?? ""}
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
