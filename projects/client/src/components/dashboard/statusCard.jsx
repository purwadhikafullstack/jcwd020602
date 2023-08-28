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
      <Flex align={"center"} justify={"center"}>
        <Box w={"100px"}>Statuses</Box>
        <Flex ml="20px" align="center">
          {statusOptions.map((option, idx) => {
            return (
              <Box
                as="button"
                px={2}
                py={1}
                mx={1}
                borderRadius="md"
                bg={selected === idx ? "black" : "gray.100"}
                color={selected === idx ? "white" : "black"}
                onClick={() => handleStatusChange(option, idx)}
                fontWeight={selected === idx ? "bold" : "normal"}
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
