import {
  Flex,
  Heading,
  Text,
  Input,
  InputGroup,
  InputRightElement,
  Checkbox,
  Center,
  Box,
  VStack,
  Container,
  useNumberInput,
  HStack,
  Button,
  Select,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { BsSearch } from "react-icons/bs";
import DeleteProductAlert from "../components/cart/DeleteProductAlert";
import CheckoutBox from "../components/cart/checkOutBox";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { api } from "../api/api";
import axios from "axios";

export default function Cart() {
  const [carts, setCarts] = useState([]);

  async function fetchCart() {
    try {
      let token = localStorage.getItem("user");
      token = JSON.parse(token);
      console.log(token);
      const response = await api.get("/carts/getCart", {
        headers: { Authorization: token },
      });

      console.log(response?.data?.data);

      setCarts(response?.data?.data);
      console.log(carts);
    } catch (error) {
      console.log(error);
    }
  }
  console.log(carts);
  useEffect(() => {
    fetchCart();
  }, []);

  let item;

  const numbers = Array.from({ length: 10 }, (_, index) => index + 1);

  return (
    <Flex flexDir={"row"} w={"100vw"} h={"100vh"}>
      <VStack w={"60vw"} h={"100%"} ml={"10px"} mt={"100px"} mr={"50px"}>
        <Flex
          w={"100%"}
          h={"100px"}
          justify={"space-between"}
          align={"center"}
          borderBottom={"1px"}
          borderBottomColor={"gray.400"}
        >
          <Flex w={"250px"} justify={"space-between"} align={"center"}>
            <Heading>YOUR BAG</Heading>
            {carts.map((val, idx) => {
              item = 1 + idx;
            })}
            {carts.length > 1 ? (
              <Text>{item} ITEMS</Text>
            ) : (
              <Text>{item} ITEM</Text>
            )}
          </Flex>
          <Text textDecoration="underline">Continue Shopping</Text>
        </Flex>

        {carts.length > 0 ? (
          carts.map((val, idx) => {
            const totalPrice = val.Shoes.price * val.qty;
            console.log(totalPrice);
            return (
              <HStack
                w={"100%"}
                h={"220px"}
                borderBottom={"1px"}
                borderBottomColor={"gray.400"}
              >
                <HStack w={"100%"} h={"200px"} spacing={4}>
                  <Flex
                    h={"100%"}
                    w={"200px"}
                    ml={"5px"}
                    align={"center"}
                    justify={"center"}
                  >
                    {val.i}
                  </Flex>
                  <Flex h={"100%"} w={"220px"} flexDir={"column"}>
                    <Text m={"5px"}>{val.Shoes.name}</Text>

                    <DeleteProductAlert type={2} />
                  </Flex>
                  <Flex
                    w={"170px"}
                    h={"100%"}
                    align={"center"}
                    justify={"space-between"}
                  >
                    <Text>Rp. {val.Shoes.price.toLocaleString("id-ID")}</Text>

                    <Select border={"1px"} w={"70px"} defaultValue={val.qty}>
                      {numbers.map((number) => (
                        <option key={number} value={number}>
                          {number}
                        </option>
                      ))}
                    </Select>
                  </Flex>

                  <Flex w={"200px"} align={"center"} justify={"right"}>
                    Rp. {totalPrice.toLocaleString("id-ID")}
                  </Flex>
                </HStack>
              </HStack>
            );
          })
        ) : (
          <Text>Your cart is empty.</Text>
        )}
      </VStack>
      <CheckoutBox />
    </Flex>
  );
}
