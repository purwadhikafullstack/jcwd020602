import React from "react";
import { useNumberInput, Button, Center, Input } from "@chakra-ui/react"; // You should import the necessary components from Chakra UI or any other library you're using.

const QtyOption = ({ cartItem, onQuantityChange }) => {
  const { getInputProps, getIncrementButtonProps, getDecrementButtonProps } =
    useNumberInput({
      step: 1,
      defaultValue: cartItem.qty,
      min: 1,
      max: cartItem.Shoes.availableStock,
      // precision: 1,
      onChange: (value) => {
        onQuantityChange(cartItem.id, parseInt(value));
      },
    });
  // console.log(cartItem);

  const inc = getIncrementButtonProps();
  const dec = getDecrementButtonProps();
  const input = getInputProps();

  return (
    <>
      <Button {...dec}>-</Button>
      <Center>
        <Input {...input} w={"50px"} />
      </Center>
      <Button {...inc}>+</Button>
    </>
  );
};

export default QtyOption;
