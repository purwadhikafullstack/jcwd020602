import { Box, Flex, Icon } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { GiWallet, GiConverseShoe } from "react-icons/gi";
import { BiSolidReceipt } from "react-icons/bi";
export default function ReportCard(props) {
  const { salesData } = props;
  const [priceData, setPriceData] = useState();
  const [shoeData, setShoeData] = useState();
  const [traData, setTraData] = useState();
  async function dataTotalPrc() {
    const priceData = salesData?.reduce((prev, curr) => {
      prev += curr?.price;
      return prev;
    }, 0);
    setPriceData(priceData);
  }
  async function dataTotalSho() {
    const shoeData = salesData?.reduce((prev, curr) => {
      prev += curr?.qty;
      return prev;
    }, 0);
    setShoeData(shoeData);
  }
  async function dataTotalTra() {
    const processedOrders = [];
    const traData = salesData?.reduce((prev, curr) => {
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
    dataTotalPrc();
    dataTotalSho();
    dataTotalTra();
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
        <Flex p={1} fontWeight={"bold"} gap={2} borderBottom={"1px"}>
          Total Income <Icon as={GiWallet} />
        </Flex>
        <Box p={1}>
          {priceData ? `Rp  ${priceData?.toLocaleString("id-ID")}` : "-"}
        </Box>
      </Flex>

      <Flex
        bg={"white"}
        borderRadius={10}
        flexDir={"column"}
        p={2}
        w={"100%"}
        border={"2px"}
      >
        <Flex p={1} fontWeight={"bold"} gap={2} borderBottom={"1px"}>
          {" "}
          Total Orders <Icon as={BiSolidReceipt} />
        </Flex>
        <Box p={1}>{traData ? `${traData}` : "-"}</Box>
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
        <Flex p={1} fontWeight={"bold"} gap={2} borderBottom={"1px"}>
          Total Product Sold <Icon as={GiConverseShoe} />
        </Flex>
        <Box p={1}>{shoeData ? `${shoeData}` : "-"}</Box>
      </Flex>
    </Box>
  );
}
