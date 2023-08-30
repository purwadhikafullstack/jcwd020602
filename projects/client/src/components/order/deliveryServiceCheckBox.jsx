import { Flex, Checkbox, Image, Text, Box } from "@chakra-ui/react";
function DeliveryServices({
  imageUrl,
  title,
  value,
  isSelected,
  onCheckboxChange,
}) {
  return (
    <Flex
      borderWidth="1px"
      borderRadius="lg"
      flexDir={"column"}
      align={"center"}
      p={2}
      gap={2}
    >
      <Checkbox
        isChecked={isSelected}
        onChange={() => onCheckboxChange(value)}
      />
      <Image
        src={imageUrl}
        alt={title}
        w={"150px"}
        h={"100px"}
        objectFit={"contain"}
      />
    </Flex>
  );
}

export default DeliveryServices;
