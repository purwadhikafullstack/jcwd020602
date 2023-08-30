import { Flex, Box, Button, Divider } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
export default function CheckoutBox(props) {
  const nav = useNavigate();
  return (
    <Flex
      flexDir={"column"}
      id="detail-product"
      gap={2}
      p={1}
      h={"100%"}
      maxH={"500px"}
    >
      <Box fontSize={"30px"} fontWeight={"bold"}>
        ORDER SUMMARY
      </Box>
      <Box id="detail" fontSize={"15px"}>
        <Box p={1}>
          {props?.sumItem} {props?.sumItem > 1 ? "Products" : "Product"}
        </Box>
        <Divider />
        <Flex justify={"space-between"} p={1}>
          <Box>Subtotal</Box>
          <Box>Rp. {props?.totalPriceSum?.toLocaleString("id-ID")}</Box>
        </Flex>
        <Divider />
        <Flex justify={"space-between"} p={1}>
          <Box>Delivery</Box>
          <Box>FREE</Box>
        </Flex>
        <Divider />
        <Flex justify={"space-between"} p={1} fontWeight={"bold"}>
          <Box>Total (Inclusive of Tax)</Box>
          <Box>Rp. {props?.totalPriceSum?.toLocaleString("id-ID")}</Box>
        </Flex>
      </Box>
      <Button
        id="button"
        onClick={() => nav("/checkout")}
        isDisabled={props.sumItem ? false : true}
      >
        CHECKOUT
      </Button>
    </Flex>
    // <VStack
    //   h={{ base: "auto", md: "100vh" }}
    //   w={{ base: "100%", md: "32vw" }}
    //   mt={{ base: "0", md: "100px" }}
    // >
    //   <Flex w={"100%"} h={{ base: "auto", md: "350px" }} bg={"#EEEEEE"}>
    //     <Flex p={"10px"} w={"100%"} flexDir={"column"}>
    //       <Button
    //         // w={"100%"} bg={"black"} textColor={"white"}
    //         backgroundColor="black"
    //         color="white"
    //         boxShadow="0px 4px 0px 0px rgba(0, 0, 0, 0.2)" // Replace the values with your desired shadow color
    //         _hover={{
    //           boxShadow: "0px 6px 0px 0px rgba(0, 0, 0, 0.2)", // Adjust the hover shadow if needed
    //         }}
    //         onClick={() => navigate("/checkOut")}
    //       >
    //         {" "}
    //         CHECKOUT
    //       </Button>
    //       <Text fontSize={"2xl"} fontWeight={"bold"} py={"10px"}>
    //         ORDER SUMMARY :
    //       </Text>
    //       <Flex w={"100%"} bg={"white"}>
    //         <Flex p={"10px"} flexDir={"column"} w={"100%"}>
    //           <Box
    //             w={"100%"}
    //             h={"40px"}
    //             borderBottom={"1px"}
    //             borderBottomColor={"gray.300"}
    //           >
    //             {props.sumItem} Item
    //           </Box>
    //           <Flex
    //             w={"100%"}
    //             justify={"space-between"}
    //             align={"center"}
    //             h={"40px"}
    //             borderBottom={"1px"}
    //             borderBottomColor={"gray.300"}
    //           >
    //             <Text>Product Total</Text>
    //             <Text>Rp. {props.totalPriceSum.toLocaleString("id-ID")}</Text>
    //           </Flex>
    //           <Flex
    //             w={"100%"}
    //             justify={"space-between"}
    //             align={"center"}
    //             h={"40px"}
    //             borderBottom={"1px"}
    //             borderBottomColor={"gray.300"}
    //           >
    //             <Text>Total Weight</Text>
    //             <Text>{props.weightTotal} gram</Text>
    //           </Flex>
    //           <Flex
    //             w={"100%"}
    //             justify={"space-between"}
    //             align={"center"}
    //             h={"70px"}
    //           >
    //             <Flex flexDir={"column"}>
    //               <Text fontWeight={"bold"}>Sub Total</Text>
    //             </Flex>
    //             <Text>Rp. {props.totalPriceSum.toLocaleString("id-ID")}</Text>
    //           </Flex>
    //         </Flex>
    //       </Flex>
    //     </Flex>
    //   </Flex>
    // </VStack>
  );
}
