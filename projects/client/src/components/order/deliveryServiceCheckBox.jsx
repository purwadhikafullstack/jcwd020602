import { Flex, Checkbox, Image, Text } from "@chakra-ui/react";
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
      p="4"
      overflow="hidden"
      flexDir={"column"}
      align={"center"}
      w={"200px"}
      h={"120px"}
    >
      <Checkbox
        pb={"10px"}
        isChecked={isSelected}
        onChange={() => onCheckboxChange(value)}
      />
      <Image src={imageUrl} alt={title} w={"120px"} h={"70px"} />
      <Text mt="2" fontWeight="semibold" fontSize="lg">
        {title}
      </Text>
    </Flex>
  );
}

export default DeliveryServices;
