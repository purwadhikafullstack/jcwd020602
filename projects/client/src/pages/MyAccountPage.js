import {
  Avatar,
  Box,
  Center,
  Flex,
  Grid,
  Icon,
  Image,
  TableContainer,
} from "@chakra-ui/react";
import { Table, Thead, Tbody, Tr, Th, Td } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { FaCircleUser, FaAddressBook } from "react-icons/fa6";
import { AiOutlineShoppingCart, AiFillHeart } from "react-icons/ai";
import { Link } from "react-router-dom";
import Footer from "../components/website/footer";
export default function MyAccountPage() {
  const userSelector = useSelector((state) => state.auth);
  const menu = [
    { icon: FaCircleUser, name: "Profile" },
    { icon: FaAddressBook, name: "Address Book" },
    { icon: AiOutlineShoppingCart, name: "Order History" },
    { icon: AiFillHeart, name: "My Wishlist" },
  ];
  return (
    <Center flexDir={"column"}>
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
        {/* <Flex       
            <TableContainer>
              <Table size="sm">
                <Thead>
                  <Tr>
                    <Th>Order #</Th>
                    <Th>Date</Th>
                    <Th>Ship to</Th>
                    <Th>Order Total</Th>
                    <Th>Ship Status</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  <Tr>
                    <Td>FTH11242</Td>
                    <Td>05/08/2023</Td>
                    <Td>Jakarta</Td>
                    <Td>Rp. 5.300.000</Td>
                    <Td>Pending</Td>
                    <Td>View Order</Td>
                  </Tr>
                </Tbody>
              </Table>
            </TableContainer>        
          </Flex> */}
      </Flex>
      <Footer />
    </Center>
  );
}

export function ProfilePage() {
  return (
    <Center>
      <Flex></Flex>
    </Center>
  );
}
