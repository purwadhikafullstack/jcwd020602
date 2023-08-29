import {Center,Flex,Text,HStack,Box,Input,Select} from "@chakra-ui/react";
import {useDisclosure,Image,InputGroup,InputRightAddon,Icon} from "@chakra-ui/react";
import CancelOrderAlert from "./cancelOrderAlert";
import DoneOrderAlert from "./doneOrderAlert";


export default function OrderListCard(props){
    
    return(
        <Flex
              w={"95%"} h={"160px"} border={"1px"} bgColor={"white"} borderRadius={"8px"} flexDir={"column"}
              mt={"15px"}
            >
              <Flex
                px={"20px"} h={"40px"} w={"100%"} borderTopRadius={"8px"} borderBottom={"1px"}
                borderColor={"gray.300"} bgColor={"black"} color={"white"} justify={"space-between"}
                align={"center"}
              >
                <Text fontSize={{ base: "sm", md: "initial" }}>
                  Order Number : {props.val.transaction_code}
                </Text>
                <Center
                  h={"70%"} p={1}
                  bg={
                    props.val.status === "CANCELED"
                      ? "red"
                      : props.val.status === "DONE"
                      ? "#D6FFDE"
                      : "#FFF0B3"
                  }
                >
                  <Text fontSize={"x-small"} color={"black"}>
                    {props.val.status}
                  </Text>
                </Center>
              </Flex>
              <Flex w={"100%"} align={"center"} h={"100%"} pl={"20px"}>
                <Flex
                  h={"100px"} w={"70%"} align={"center"}
                >
                  <Flex
                    h={"90px"} w={"150px"} align={"center"} justify={"center"}
                  >
                    <Image
                      src={`${process.env.REACT_APP_API_BASE_URL}/${props.val?.orderDetails[0]?.stock?.Sho?.ShoeImages[0]?.shoe_img}`}
                      w={"100%"} objectFit={"cover"} maxW={"80px"} maxH={"80px"}
                    />
                  </Flex>
                  <Flex
                    flexDir={"column"} w={"100%"} pl={"10px"} pt={"10px"} h={"90px"} borderRight={"1px"}
                    borderColor={"gray.300"}
                  >
                    <Text
                      fontWeight={"bold"} fontSize={{ base: "sm", md: "initial" }}
                    >
                      {props.val?.orderDetails[0]?.stock?.Sho?.name}
                    </Text>
                    <Text
                      fontSize={{ base: "xs", md: "sm" }} color={"gray.400"}
                    >
                      size : {props.val?.orderDetails[0]?.stock?.shoeSize?.size}
                    </Text>
                    <Text
                      fontSize={{ base: "xs", md: "sm" }} color={"gray.400"}
                    >
                      {props.val?.orderDetails[0]?.qty}{" "}
                      {props.val?.orderDetails[0]?.qty > 1 ? "shoes" : "shoe"} x Rp.{" "}
                      {props.val?.orderDetails[0]?.price.toLocaleString("id-ID")}
                    </Text>
                  </Flex>
                </Flex>
                <Flex
                  flexDir={"column"} w={"30%"} h={"100%"} align={"center"} justify={"center"}
                >
                  <Text color={"gray.500"} fontSize={"sm"}>
                    Total Prices
                  </Text>
                  <Text
                    fontWeight={"bold"} fontSize={{ base: "sm", md: "initial" }}
                  >
                    Rp. {props.val.total_price.toLocaleString("id-ID")}
                  </Text>
                </Flex>
              </Flex>
              <Flex
                h={"50px"}
                justify={props.val?.status === "PAYMENT" ||props.val?.status === "DELIVERY" ? "space-between" : "right"}
                px={"20px"}
                align={"center"}
              >
                {props.val?.status === "PAYMENT" ? (
                  <CancelOrderAlert id={props.val.id} cancelOrder={props.cancelOrder} />
                ) : (props.val?.status === "DELIVERY"? (
                <DoneOrderAlert id={props.val.id} doneOrder={props.doneOrder}/>) : null)}
                <Text
                  cursor={"pointer"}
                  fontSize={"sm"}
                  onClick={() => props.openDetailsModal(props.val)}
                >
                  Show Order Details
                </Text>
              </Flex>
            </Flex>
    )
}