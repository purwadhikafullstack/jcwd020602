import { Box, Flex } from "@chakra-ui/react";
export default function StatusCard({
  selected,
  setSelected,
  filter,
  setFilter,
  setShown,
}) {
  const statusOptions = ["ALL", "PAYMENT", "ON PROCESS", "CANCELED", "DONE"];
  const statusValues = {
    ALL: "",
    PAYMENT: ["PAYMENT"],
    "ON PROCESS": ["CONFIRM_PAYMENT", "PROCESSING", "DELIVERY"],
    CANCELED: ["CANCELED"],
    DONE: ["DONE"],
  };
  const handleStatusChange = (selectedStatus, idx) => {
    setFilter({
      ...filter,
      status: statusValues[selectedStatus],
    });
    setShown({ page: 1 });
    setSelected(idx);
  };
  return (
    <>
      <Flex
        align={"center"}
        maxW={"700px"}
        w={"100vw"}
        overflowX={"auto"}
        py={2}
      >
        <Flex justify={"center"} maxW={"700px"} w={"100vw"} align="center">
          {statusOptions.map((option, idx) => {
            return (
              <Box
                fontSize={"10px"}
                as="button"
                px={2}
                py={1}
                mx={1}
                borderRadius="md"
                bg={selected === idx ? "black" : "gray.100"}
                color={selected === idx ? "white" : "black"}
                onClick={() => handleStatusChange(option, idx)}
                fontWeight={selected === idx ? "bold" : "normal"}
                whiteSpace={"nowrap"}
              >
                {option}
              </Box>
            );
          })}
        </Flex>
      </Flex>
    </>
  );
}
