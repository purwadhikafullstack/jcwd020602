import { Box, Flex } from "@chakra-ui/react";
import { useState, useEffect } from "react";
export default function ReportCard(props) {
  const { salesData } = props;
  const [priceData, setPriceData] = useState();
  const [shoeData, setShoeData] = useState();
  const [traData, setTraData] = useState();
  async function dataTotPrc() {
    const priceData = salesData?.data?.reduce((prev, curr) => {
      prev += curr?.price;
      return prev;
    }, 0);
    setPriceData(priceData);
  }
  async function dataTotSho() {
    const shoeData = salesData?.data?.reduce((prev, curr) => {
      prev += curr?.qty;
      return prev;
    }, 0);
    setShoeData(shoeData);
  }
  async function dataTotTra() {
    const processedOrders = [];
    const traData = salesData?.data?.reduce((prev, curr) => {
      const order = curr.order.transaction_code;
      if (!processedOrders.includes(order)) {
        prev += 1;
        processedOrders.push(order);
      }
      return prev;
    }, 0);
    setTraData(traData);
  }
  useEffect(() => {
    if (salesData) {
      dataTotPrc();
      dataTotSho();
      dataTotTra();
    }
  }, [salesData]);
  return (
    <Flex
      padding={"20px"}
      justifyContent={"flex-start"}
      flexWrap={"wrap"}
      gap={"16px"}
    >
      <Flex
        width={"274px"}
        height={"103px"}
        background={"#ffff"}
        borderRadius={"8px"}
        boxShadow={"0px 1px 3px rgba(0, 0, 0, 0.1)"}
        flexDir={"column"}
        padding={"8px 16px"}
      >
        <Flex
          height={"40%"}
          alignItems={"center"}
          justifyContent={"space-between"}
          fontWeight={"500"}
          fontSize={"14px"}
        >
          Total Sales Income
          {/*  <Icon as={MdKeyboardArrowRight} /> */}
        </Flex>
        <Box height={"30%"} fontWeight={"600"} fontSize={"16px"}>
          {priceData ? `Rp  ${priceData?.toLocaleString("id-ID")}` : "-"}
        </Box>
        <Flex
          height={"30%"}
          gap={"6px"}
          fontSize={"10px"}
          fontWeight={"500"}
          alignItems={"center"}
        >
          <Flex color={"#56D77A"} alignItems={"center"}>
            {/* <Icon height={"18px"} as={GoArrowUp}></Icon>
            {data?.percentSum ? `${data?.percentSum}%` : ""} */}
            140.53%
          </Flex>
          Compare to yesterday
        </Flex>
      </Flex>
      <Flex
        width={"274px"}
        height={"103px"}
        background={"#ffff"}
        borderRadius={"8px"}
        boxShadow={"0px 1px 3px rgba(0, 0, 0, 0.1)"}
        flexDir={"column"}
        padding={"8px 16px"}
      >
        <Flex
          height={"40%"}
          alignItems={"center"}
          justifyContent={"space-between"}
          fontWeight={"500"}
          fontSize={"14px"}
        >
          Total Transactions Made
          {/* <Icon as={MdKeyboardArrowRight} /> */}
        </Flex>
        <Box height={"30%"} fontWeight={"600"} fontSize={"16px"}>
          {traData ? `${traData}` : "-"}
        </Box>
        <Flex
          height={"30%"}
          gap={"6px"}
          fontSize={"10px"}
          fontWeight={"500"}
          alignItems={"center"}
        >
          <Flex color={"#56D77A"} alignItems={"center"}>
            {/* <Icon height={"18px"} as={GoArrowUp}></Icon> */}
            {/* {data?.percentCount ? `${data?.percentCount}%` : ""} */}
            50.00%
          </Flex>
          Compare to yesterday
        </Flex>
      </Flex>
      <Flex
        width={"274px"}
        height={"103px"}
        background={"#ffff"}
        borderRadius={"8px"}
        boxShadow={"0px 1px 3px rgba(0, 0, 0, 0.1)"}
        flexDir={"column"}
        padding={"8px 16px"}
      >
        <Flex
          height={"40%"}
          alignItems={"center"}
          justifyContent={"space-between"}
          fontWeight={"500"}
          fontSize={"14px"}
        >
          Total Product Sold
          {/*  <Icon as={MdKeyboardArrowRight} /> */}
        </Flex>
        <Box height={"30%"} fontWeight={"600"} fontSize={"16px"}>
          {shoeData ? `${shoeData}` : "-"}
        </Box>
        <Flex
          height={"30%"}
          gap={"6px"}
          fontSize={"10px"}
          fontWeight={"500"}
          alignItems={"center"}
        >
          <Flex color={"#56D77A"} alignItems={"center"}>
            {/* <Icon height={"18px"} as={GoArrowUp}></Icon> */}
            {/* {countDetails?.percentSum ? `${countDetails?.percentSum}%` : ""} */}
          </Flex>
          Compare to yesterday
        </Flex>
      </Flex>
    </Flex>
  );
}
