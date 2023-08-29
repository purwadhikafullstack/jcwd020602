const { Box } = require("@chakra-ui/react");

export default function StatusCard({ title, selected, onClick }) {
    return (
      <Box
        as="button"
        px={2}
        py={1}
        mx={1}
        borderRadius="md"
        bg={selected ? "black" : "gray.100"}
        color={selected ? "white" : "black"}
        onClick={onClick}
        fontWeight={selected ? "bold" : "normal"}
      >
        {title}
      </Box>
    );
  }