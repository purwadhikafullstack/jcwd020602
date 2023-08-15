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
import { useNavigate } from "react-router-dom";
export default function OrderSummary(props) {
  const navigate = useNavigate();
  return (
    <VStack
      h={{ base: "auto", md: "100vh" }}
      w={{ base: "100%", md: "23vw" }}
      mt={{ base: "0", md: "100px" }}
    >
      <Flex w={"100%"} h={{ base: "auto", md: "700px" }} bg={"#EEEEEE"}>
        <Flex p={"10px"} w={"100%"} flexDir={"column"}>
          <Flex justify={"space-between"} w={"100%"} align={"center"}>
            <Text fontSize={"xl"} fontWeight={"bold"} py={"10px"}>
              ORDER SUMMARY :
            </Text>
            <Text
              fontSize={"xs"}
              onClick={() => navigate("/cart")}
              cursor={"pointer"}
            >
              Edit Cart
            </Text>
          </Flex>
          <Flex w={"100%"} bg={"white"}>
            <Flex p={"10px"} flexDir={"column"} w={"100%"}>
              <Box
                w={"100%"}
                h={"40px"}
                borderBottom={"1px"}
                borderBottomColor={"gray.300"}
              >
                {props.sumItem} Item
              </Box>
              <Flex
                w={"100%"}
                justify={"space-between"}
                align={"center"}
                h={"40px"}
                borderBottom={"1px"}
                borderBottomColor={"gray.300"}
              >
                <Text>Weight Total</Text>
                <Text>{props.weightTotal} gram</Text>
              </Flex>
              <Flex
                w={"100%"}
                justify={"space-between"}
                align={"center"}
                h={"40px"}
                borderBottom={"1px"}
                borderBottomColor={"gray.300"}
              >
                <Text>Product Total</Text>
                <Text>Rp. {props.totalPriceSum.toLocaleString("id-ID")}</Text>
              </Flex>
              <Flex
                w={"100%"}
                justify={"space-between"}
                align={"center"}
                h={"40px"}
                borderBottom={"1px"}
                borderBottomColor={"gray.300"}
              >
                <Text>Delivery</Text>
                {props.cost == null ? null : (
                  <Text>Rp. {props.cost?.toLocaleString("id-ID")}</Text>
                )}
              </Flex>
              <Flex
                w={"100%"}
                justify={"space-between"}
                align={"center"}
                h={"70px"}
                borderBottom={"1px"}
                borderBottomColor={"gray.300"}
              >
                <Flex flexDir={"column"}>
                  <Text fontWeight={"bold"}>Total</Text>
                  <Text fontWeight={"bold"}>(Inclusive of Tax)</Text>
                </Flex>
                <Text>Rp. {props.totalOrder.toLocaleString("id-ID")}</Text>
              </Flex>
              <Flex
                w={"100%"}
                py={"4"}
                maxH={"300px"}
                mt={"20px"}
                align={"center"}
                justify={"center"}
                flexDir={"column"}
                overflowY={"auto"}
              >
                {props.carts.map((val, idx) => {
                  const totalPrice = val.Shoes.price * val.qty;
                  return (
                    <Flex
                      p={"10px"}
                      w={"100%"}
                      borderBottom={"1px"}
                      borderColor={"gray.200"}
                      h={"150px"}
                    >
                      <Center w={"100px"}>
                        {" "}
                        {val.Shoes?.ShoeImages?.shoe_img}
                      </Center>
                      <Flex flexDir={"column"} w={"100%"}>
                        <Text fontWeight={"bold"} fontSize={"sm"}>
                          {val.Shoes.name}
                        </Text>
                        <Text fontSize={"sm"}>Size :{val.ShoeSize.size}</Text>

                        <Text fontSize={"sm"}>
                          Weight : {val.Shoes.weight * val.qty} gram
                        </Text>
                        <Flex justify={"right"} w={"100%"}>
                          <Flex flexDir={"column"} pr={"10px"}>
                            <Text>{val.qty} x </Text>
                            <Text>Total</Text>
                          </Flex>
                          <Flex flexDir={"column"}>
                            <Text>
                              {val.Shoes.price.toLocaleString("id-ID")}
                            </Text>
                            <Text>{totalPrice.toLocaleString("id-ID")}</Text>
                          </Flex>
                        </Flex>
                      </Flex>
                    </Flex>
                  );
                })}
              </Flex>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </VStack>
  );
}
