import { Avatar, Box, Button, Center } from "@chakra-ui/react";
import { Flex, useDisclosure } from "@chakra-ui/react";
import Footer from "../components/website/footer";
import AddAddress from "../components/website/addAddress";
import { useFetchAddress } from "../hooks/useFetchAddress";
import DeleteAddress from "../components/website/deleteAddress";
import { useEffect, useState } from "react";
import EditAddress from "../components/website/editAddress";
import Navbar from "../components/website/navbar";
// ---------------------------------------------------------- CLEAR -FAHMI
export default function AddressBookPage() {
  const addModal = useDisclosure();
  const deleteModal = useDisclosure();
  const editModal = useDisclosure();
  const [selectedAddress, setSelectedAddress] = useState(null);
  const { address, fetch } = useFetchAddress();

  function Address({ val }) {
    const options = {
      minW: "80px",
      alignItems: "center",
      justify: "center",
      bg: "black",
      color: "white",
    };
    return (
      <Flex p={2} border={"2px"} flexDir={"column"} gap={3} bg={"white"}>
        <Flex borderBottom={"1px"} gap={1}>
          <Flex {...options}>Title</Flex>
          <Box>{val.title}</Box>
        </Flex>
        <Flex borderBottom={"1px"} gap={1}>
          <Flex {...options}>Name</Flex>
          <Box>{val.name}</Box>
        </Flex>
        <Flex borderBottom={"1px"} gap={1}>
          <Flex {...options}>Phone</Flex>
          <Box>{val.phone}</Box>
        </Flex>
        <Flex borderBottom={"1px"} gap={1}>
          <Flex {...options}>Address</Flex>

          <Box>
            {val.address}, {val.city.city_name}, {val.city.province},{" "}
            {val.postcode}
          </Box>
        </Flex>
        <Flex gap={2}>
          <Button
            id="button"
            size={"sm"}
            onClick={() => {
              setSelectedAddress(val);
              editModal.onOpen();
            }}
          >
            EDIT
          </Button>
          <Button
            id="button"
            size={"sm"}
            onClick={() => {
              setSelectedAddress(val);
              deleteModal.onOpen();
            }}
          >
            DELETE
          </Button>
        </Flex>
      </Flex>
    );
  }

  return (
    <Center flexDir={"column"}>
      <Navbar />
      <Flex
        flexDir={"column"}
        w={"100%"}
        maxW={"1535px"}
        p={"1rem 1rem"}
        mt={"100px"}
        gap={5}
      >
        <Flex justify={"space-between"}>
          <Box fontSize={"30px"} fontWeight={"bold"}>
            ADDRESS BOOK
          </Box>
          <Button id="button" onClick={addModal.onOpen}>
            ADD ADDRESS
          </Button>
          <AddAddress
            fetch={fetch}
            isOpen={addModal.isOpen}
            onClose={addModal.onClose}
          />
        </Flex>
        {address?.length ? (
          <>
            <Flex bg={"black"} flexDir={"column"} gap={5} p={2} border={"2px"}>
              <Box fontSize={"20px"} fontWeight={"bold"} color={"white"}>
                DEFAULT ADDRESS
              </Box>
              {address &&
                address
                  ?.filter((val) => val.is_primary == true)
                  ?.map((val) => <Address val={val} />)}
            </Flex>
            {address?.length > 1 ? (
              <Flex flexDir={"column"} gap={5} p={2} border={"2px"} w={"100%"}>
                <Box fontSize={"20px"} fontWeight={"bold"}>
                  ANOTHER ADDRESS
                </Box>
                {address &&
                  address
                    ?.filter((val) => val.is_primary == false)
                    .map((val) => <Address val={val} />)}
              </Flex>
            ) : null}
          </>
        ) : (
          <Center h={"500px"} border={"2px"}>
            <Box fontSize={"20px"} m={2} textAlign={"center"}>
              You don't have any address in your address book yet.
            </Box>
          </Center>
        )}
      </Flex>
      <EditAddress
        data={selectedAddress}
        isOpen={editModal.isOpen}
        fetch={fetch}
        onClose={() => {
          setSelectedAddress(null);
          editModal.onClose();
        }}
      />
      <DeleteAddress
        address={selectedAddress}
        isOpen={deleteModal.isOpen}
        fetch={fetch}
        onClose={() => {
          setSelectedAddress(null);
          deleteModal.onClose();
        }}
      />
      <Footer />
    </Center>
  );
}
