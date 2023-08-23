import { Avatar, Box, Flex, Image, Text } from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/react";
import { BiMenuAltLeft } from "react-icons/bi";
import { useSelector } from "react-redux";
import Sidebar from "./sidebar";

export default function NavbarDashboard() {
  const userSelector = useSelector((state) => state.auth);
  const { isOpen, onClose, onOpen } = useDisclosure();
  return (
    <>
      <Box
        id="navbarDash"
        w="100%"
        pos="fixed"
        top="0"
        zIndex="99"
        borderBottom=" #c2c2c2 solid"
        p={2}
        bg={"white"}
      >
        <Flex align="center" justify="space-between">
          <Box
            _hover={{ bg: "#e8e8e8" }}
            cursor={"pointer"}
            borderRadius={"full"}
            p={1}
            onClick={onOpen}
          >
            <Image as={BiMenuAltLeft} h={"auto"} w={"30px"} />
          </Box>
          <Sidebar isOpen={isOpen} onClose={onClose} />

          <Flex gap={2}>
            <Box
              className="akun"
              display="flex"
              flexDir="column"
              textAlign="right"
              fontSize="11px"
            >
              <Text>{userSelector.name}</Text>
              <Text color={"gray"}>{userSelector.role}</Text>
            </Box>
            <Box>
              <Avatar
                size="sm"
                src={`${process.env.REACT_APP_API_BASE_URL}/${userSelector.avatar_url}`}
              />
            </Box>
          </Flex>
        </Flex>
      </Box>
    </>
  );
}
