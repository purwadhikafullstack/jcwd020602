import React from "react";
import {
  useNumberInput,
  Button,
  Center,
  Input,
  Flex,
  ButtonGroup,
} from "@chakra-ui/react";

// You should import the necessary components from Chakra UI or any other library you're using.

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

  const inc = getIncrementButtonProps();
  const dec = getDecrementButtonProps();
  const input = getInputProps();

  return (
    // <Flex>
    <ButtonGroup isAttached size={"sm"}>
      <Button {...dec} border={"1px"}>
        -
      </Button>
      <Input
        {...input}
        textAlign={"center"}
        size={"sm"}
        // h={"30px"}
        w={"40px"}
        borderBlock={"1px"}
      />
      <Button {...inc} border={"1px"}>
        +
      </Button>
    </ButtonGroup>
    // </Flex>
  );
};

export default QtyOption;
