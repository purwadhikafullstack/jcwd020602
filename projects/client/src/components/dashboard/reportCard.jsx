import { Box, Flex } from "@chakra-ui/react";

export default function ReportCard(props) {
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
          Total Sales <Icon as={MdKeyboardArrowRight} />
        </Flex>
        <Box height={"30%"} fontWeight={"600"} fontSize={"16px"}>
          {sumOrder ? `Rp  ${(sumOrder * 1000)?.toLocaleString("id-ID")}` : "-"}
        </Box>
        <Flex
          height={"30%"}
          gap={"6px"}
          fontSize={"10px"}
          fontWeight={"500"}
          alignItems={"center"}
        >
          <Flex color={"#56D77A"} alignItems={"center"}>
            <Icon height={"18px"} as={GoArrowUp}></Icon>
            {data?.percentSum ? `${data?.percentSum}%` : ""}
            {/* 140.53% */}
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
          Total Transaction <Icon as={MdKeyboardArrowRight} />
        </Flex>
        <Box height={"30%"} fontWeight={"600"} fontSize={"16px"}>
          {countOrder ? `${countOrder}` : "-"}
        </Box>
        <Flex
          height={"30%"}
          gap={"6px"}
          fontSize={"10px"}
          fontWeight={"500"}
          alignItems={"center"}
        >
          <Flex color={"#56D77A"} alignItems={"center"}>
            <Icon height={"18px"} as={GoArrowUp}></Icon>
            {data?.percentCount ? `${data?.percentCount}%` : ""}
            {/* 50.00% */}
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
          Total Product <Icon as={MdKeyboardArrowRight} />
        </Flex>
        <Box height={"30%"} fontWeight={"600"} fontSize={"16px"}>
          {countDetails?.sum ? `${countDetails?.sum}` : "-"}
        </Box>
        <Flex
          height={"30%"}
          gap={"6px"}
          fontSize={"10px"}
          fontWeight={"500"}
          alignItems={"center"}
        >
          <Flex color={"#56D77A"} alignItems={"center"}>
            <Icon height={"18px"} as={GoArrowUp}></Icon>
            {countDetails?.percentSum ? `${countDetails?.percentSum}%` : ""}
          </Flex>
          Compare to yesterday
        </Flex>
      </Flex>
    </Flex>
  );
}
