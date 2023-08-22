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
    <Box className="report-card">
      <Flex
        bg={"white"}
        borderRadius={10}
        flexDir={"column"}
        p={2}
        w={"100%"}
        border={"2px"}
      >
        <Box p={1} fontWeight={"bold"} borderBottom={"1px"}>
          Total Sales Income
        </Box>
        <Box p={1} borderBottom={"1px"}>
          {priceData ? `Rp  ${priceData?.toLocaleString("id-ID")}` : "-"}
        </Box>
        <Flex gap={"6px"} fontSize={"10px"} p={1}>
          <Flex color={"#56D77A"} alignItems={"center"}>
            140.53%
          </Flex>
          Compare to yesterday
        </Flex>
      </Flex>

      <Flex
        bg={"white"}
        borderRadius={10}
        flexDir={"column"}
        p={2}
        w={"100%"}
        border={"2px"}
      >
        <Box p={1} fontWeight={"bold"} borderBottom={"1px"}>
          Total Transactions Made
        </Box>
        <Box p={1} borderBottom={"1px"}>
          {traData ? `${traData}` : "-"}
        </Box>
        <Flex gap={"6px"} fontSize={"10px"} p={1}>
          <Flex color={"#56D77A"} alignItems={"center"}>
            50.00%
          </Flex>
          Compare to yesterday
        </Flex>
      </Flex>
      {/*  */}
      <Flex
        bg={"white"}
        borderRadius={10}
        flexDir={"column"}
        p={2}
        w={"100%"}
        border={"2px"}
      >
        <Box p={1} fontWeight={"bold"} borderBottom={"1px"}>
          Total Product Sold
        </Box>
        <Box p={1} borderBottom={"1px"}>
          {shoeData ? `${shoeData}` : "-"}
        </Box>
        <Box gap={"6px"} fontSize={"10px"} p={1}>
          Compare to yesterday
        </Box>
      </Flex>
    </Box>
  );
}
