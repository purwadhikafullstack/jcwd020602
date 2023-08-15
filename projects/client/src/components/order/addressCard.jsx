import { Flex, Heading, Text, Center, Image } from "@chakra-ui/react";
import { BsCheck2 } from "react-icons/bs";

function AddressCard(props) {
  const handleCardClick = () => {
    props.onClick();
  };
  const truncatedAddress =
    props.address.length > 45
      ? `${props.address.slice(0, 45)}...`
      : props.address;
  return (
    <Flex
      bg={props.isSelected || props.is_primary ? "#EEEEEE" : "white"}
      // w={"100%"}
      h={"100px"}
      // justify={"space-between"}
      borderBottom={"1px"}
      borderTop={"1px"}
      borderColor={"gray.300"}
      pr={"20px"}
      pl={"10px"}
      onClick={handleCardClick}
      cursor={"pointer"}
    >
      {props.is_primary ? (
        <Flex w={"30px"} align={"center"}>
          <BsCheck2 />
        </Flex>
      ) : (
        <Center w={"30px"}></Center>
      )}
      <Flex
        flexDir={"column"}
        align={"center"}
        justify={"center"}
        w={"170px"}
        mr={"120px"}
      >
        <Text fontWeight={"bold"}>{props.name}</Text>
        <Text>({props.title})</Text>
      </Flex>

      <Flex
        flexDir={"column"}
        justify={"center"}
        className="addressDet"
        maxW={"300px"}
      >
        <Text fontSize={"sm"}>{truncatedAddress}</Text>
        <Text
          fontSize={"sm"}
          style={{ overflowWrap: "break-word", whiteSpace: "normal" }}
        >
          {props.city.city_name}, {props.city?.province},{props.postcode}
        </Text>
        <Text fontSize={"sm"}>
          <span style={{ fontSize: "small", fontWeight: "bold" }}>
            Phone :{" "}
          </span>
          {props.phone}
        </Text>
      </Flex>
    </Flex>
  );
}

export default AddressCard;
