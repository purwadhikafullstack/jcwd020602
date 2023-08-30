import { Avatar, Box, Center, Flex, Image } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { FaCircleUser, FaAddressBook } from "react-icons/fa6";
import { AiOutlineShoppingCart, AiFillHeart } from "react-icons/ai";
import { Link } from "react-router-dom";
import Footer from "../components/website/footer";
import Navbar from "../components/website/navbar";

export default function MyAccountPage() {
  const userSelector = useSelector((state) => state.auth);
  const menu = [
    { icon: FaCircleUser, name: "Profile" },
    { icon: FaAddressBook, name: "Address Book" },
    { icon: AiOutlineShoppingCart, name: "Order List" },
    { icon: AiFillHeart, name: "My Wishlist" },
  ];
  return (
    <Center flexDir={"column"}>
      <Navbar />
      <Flex
        w={"100%"}
        maxW={"1535px"}
        zIndex={1}
        p={"1rem 1rem"}
        mt={"100px"}
        gap={1}
        flexDir={"column"}
      >
        <Flex mb={5} gap={2}>
          <Box>
            <Avatar
              size={"xl"}
              src={`${process.env.REACT_APP_API_BASE_URL}/${userSelector.avatar_url}`}
            />
          </Box>
          <Flex flexDir={"column"}>
            <Box p={1} fontSize={"30px"} fontWeight={"bold"}>
              {userSelector.name}
            </Box>
            <Box p={1}>{userSelector.email}</Box>
          </Flex>
        </Flex>

        <Box className="my-account" display={"grid"}>
          {menu.map((val) => (
            <Link
              to={`/my-account/${val.name.replace(" ", "-").toLowerCase()}`}
            >
              <Flex border={"2px"} align={"center"}>
                <Box w={"64px"} h={"64px"} p={4} bg={"black"} color={"white"}>
                  <Image as={val.icon} w={"100%"} h={"100%"} />
                </Box>
                <Box p={5} w={"100%"} _hover={{ bg: "black", color: "white" }}>
                  {val.name}
                </Box>
              </Flex>
            </Link>
          ))}
        </Box>
      </Flex>
      <Footer />
    </Center>
  );
}
