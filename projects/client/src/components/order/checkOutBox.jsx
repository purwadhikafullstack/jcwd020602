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
export default function CheckoutBox(props) {
  const navigate = useNavigate();
  return (
    <VStack
      h={{ base: "auto", md: "100vh" }}
      w={{ base: "100%", md: "32vw" }}
      mt={{ base: "0", md: "100px" }}
    >
      <Flex w={"100%"} h={{ base: "auto", md: "350px" }} bg={"#EEEEEE"}>
        <Flex p={"10px"} w={"100%"} flexDir={"column"}>
          <Button
            // w={"100%"} bg={"black"} textColor={"white"}
            backgroundColor="black"
            color="white"
            boxShadow="0px 4px 0px 0px rgba(0, 0, 0, 0.2)" // Replace the values with your desired shadow color
            _hover={{
              boxShadow: "0px 6px 0px 0px rgba(0, 0, 0, 0.2)", // Adjust the hover shadow if needed
            }}
            onClick={() => navigate("/checkOut")}
          >
            {" "}
            CHECKOUT
          </Button>
          <Text fontSize={"2xl"} fontWeight={"bold"} py={"10px"}>
            ORDER SUMMARY :
          </Text>
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
                <Text>Total Weight</Text>
                <Text>{props.weightTotal} gram</Text>
              </Flex>
              <Flex
                w={"100%"}
                justify={"space-between"}
                align={"center"}
                h={"70px"}
              >
                <Flex flexDir={"column"}>
                  <Text fontWeight={"bold"}>Sub Total</Text>
                </Flex>
                <Text>Rp. {props.totalPriceSum.toLocaleString("id-ID")}</Text>
              </Flex>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </VStack>
  );
}
