import {
  Center,
  Flex,
  Text,
  HStack,
  VStack,
  Box,
  Input,
  Select,
  useDisclosure,
  Image,
  InputGroup,
  InputRightAddon,
  Icon,
} from "@chakra-ui/react";
import { useFetchOrder } from "../hooks/useFetchOrder";
import { useEffect, useRef, useState } from "react";
import { api } from "../api/api";
import OrderDetailsModal from "../components/order/orderDetailsModal";
import { FaSearch } from "react-icons/fa";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import CancelOrderAlert from "../components/order/cancelOrderAlert";
import Navbar from "../components/website/navbar";
import Footer from "../components/website/footer";

export default function OrderListUser() {
  const detailsModal = useDisclosure();
  const [selectedVal, setSelectedVal] = useState(null);
  const inputFileRef = useRef(null);
  const [filter, setFilter] = useState({
    page: 1,
    sort: "",
    order: "",
    search: "",
    status: "",
    fromDate: "",
    toDate: "",
  });
  const { orders, fetchOrders } = useFetchOrder(filter);
  const openDetailsModal = (val) => {
    setSelectedVal(val);
    detailsModal.onOpen();
  };
  // ----page
  const [currentPage, setCurrentPage] = useState(1);
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= orders?.totalPages) {
      setCurrentPage(newPage);
    }
  };
  useEffect(() => {
    setFilter((prevFilter) => ({
      ...prevFilter,
      page: currentPage,
    }));
  }, [currentPage]);
  // ---------------
  useEffect(() => {
    fetchOrders();
  }, [filter]);

  // -- status filter
  const [status, setStatus] = useState("ALL");
  const statusOptions = ["ALL", "PAYMENT", "ON PROCESS", "CANCELED", "DONE"];
  const statusValues = {
    ALL: "",
    PAYMENT: "PAYMENT",
    "ON PROCESS": ["CONFIRM_PAYMENT", "PROCESSING", "DELIVERY"],
    CANCELED: "CANCELED",
    DONE: "DONE",
  };

  const handleStatusChange = (selectedStatus) => {
    setStatus(selectedStatus);
    setFilter({
      ...filter,
      status: statusValues[selectedStatus],
    });
    setCurrentPage(1);
    fetchOrders();
  };

  const cancelOrder = async (id) => {
    try {
      await api().patch(`/orders/cancelOrderUser/${id}`);
      fetchOrders();

      alert("Order successfully canceled");
    } catch (err) {
      console.log(err.response?.data);
    }
  };
  const handleDateChange = (from, to) => {
    setCurrentPage(1);
    setFilter({
      ...filter,
      fromDate: from,
      toDate: to,
    });
  };

  return (
    <Center flexDir={"column"}>
      <Navbar />
      <Flex
        my={{ base: "50px", md: "100px" }}
        w={{ base: "90%", md: "70vw" }}
        h={"auto"}
        flexDir={"column"}
      >
        <Text
          fontSize={{ base: "xl", md: "2xl" }}
          fontWeight={"bold"}
          my={"10px"}
        >
          Order List
        </Text>

        <Flex flexDir={"column"} w={"100%"} h={"630px"} align={"center"}>
          <Flex w={"95%"} h={"50px"} align={"flex-end"}>
            <InputGroup size={"sm"} w={"250px"}>
              <Input placeholder="Find your order" ref={inputFileRef} />
              <InputRightAddon
                cursor={"pointer"}
                onClick={() => {
                  setCurrentPage(1);
                  setFilter({ ...filter, search: inputFileRef.current.value });
                }}
              >
                <Icon as={FaSearch} color={"black"} />
              </InputRightAddon>
            </InputGroup>

            <Select
              mx={"20px"}
              w={"250px"}
              size={"sm"}
              onChange={(e) => {
                setCurrentPage(1);
                setFilter({
                  ...filter,
                  sort: e.target.value.split(",")[0],
                  order: e.target.value.split(",")[1],
                });
              }}
            >
              <option value={","}>ORDER BY: </option>
              <option value={"id,DESC"}>Latest Order</option>
              <option value={"id,ASC"}>Oldest Order</option>
            </Select>
            <InputGroup size="sm" w="200px" display={"flex"} flexDir={"column"}>
              <Text fontSize={"x-small"}>From :</Text>
              <Input
                // placeholder="From"
                type="date"
                onChange={(e) => {
                  handleDateChange(e.target.value, filter.toDate);
                }}
              />
            </InputGroup>
            <InputGroup size="sm" w="200px" display={"flex"} flexDir={"column"}>
              <Text fontSize={"x-small"}>To :</Text>
              <Input
                // placeholder="To Date"
                type="date"
                onChange={(e) => {
                  handleDateChange(filter.fromDate, e.target.value);
                }}
              />
            </InputGroup>
          </Flex>
          <Flex
            my={"10px"}
            w={"95%"}
            align={"center"}
            justify={"space-between"}
          >
            <Box w={"100px"}>Statuses</Box>
            <Flex ml="20px" align="center">
              {statusOptions.map((option) => (
                <StatusCard
                  key={option}
                  title={option}
                  selected={status === option}
                  onClick={() => handleStatusChange(option)}
                />
              ))}
            </Flex>
            <Center>
              <Text
                fontWeight={"bold"}
                color={"#383F6A"}
                cursor={"pointer"}
                onClick={() => setFilter({ page: 1 })}
              >
                Reset Filter
              </Text>
            </Center>
          </Flex>
          {/* <VStack h={"600px"} w={"100%"}> */}
          {orders?.data?.map((val) => (
            <Flex
              w={"95%"}
              h={"160px"}
              border={"1px"}
              bgColor={"white"}
              borderRadius={"8px"}
              flexDir={"column"}
              mt={"15px"}
            >
              <Flex
                px={"20px"}
                h={"40px"}
                w={"100%"}
                borderTopRadius={"8px"}
                borderBottom={"1px"}
                borderColor={"gray.300"}
                bgColor={"black"}
                color={"white"}
                justify={"space-between"}
                align={"center"}
              >
                Order Number : {val.transaction_code}
                <Center
                  h={"70%"}
                  // w={"70px"}
                  p={1}
                  bg={
                    val.status === "CANCELED"
                      ? "red"
                      : val.status === "DONE"
                      ? "#D6FFDE"
                      : "#FFF0B3"
                  }
                >
                  <Text fontSize={"x-small"} color={"black"}>
                    {val.status}
                  </Text>
                </Center>
              </Flex>
              <Flex w={"100%"} align={"center"} h={"100%"} pl={"20px"}>
                <Flex
                  h={"100px"}
                  w={"70%"}
                  // justify={"space-between"}
                  align={"center"}
                >
                  <Flex
                    h={"90px"}
                    w={"150px"}
                    // ml={"5px"}
                    align={"center"}
                    justify={"center"}
                  >
                    <Image
                      src={`${process.env.REACT_APP_API_BASE_URL}/${val?.orderDetails[0]?.stock?.Sho?.ShoeImages[0]?.shoe_img}`}
                      w={"100%"}
                      objectFit={"cover"}
                      maxW={"80px"}
                      maxH={"80px"}
                    />
                  </Flex>
                  <Flex
                    flexDir={"column"}
                    w={"100%"}
                    pl={"10px"}
                    pt={"10px"}
                    h={"90px"}
                    borderRight={"1px"}
                    borderColor={"gray.300"}
                  >
                    <Text fontWeight={"bold"}>
                      {val?.orderDetails[0]?.stock?.Sho?.name}
                    </Text>
                    <Text fontSize={"sm"} color={"gray.400"}>
                      size : {val?.orderDetails[0]?.stock?.shoeSize?.size}
                    </Text>
                    <Text fontSize={"sm"} color={"gray.400"}>
                      {val?.orderDetails[0]?.qty}{" "}
                      {val?.orderDetails[0]?.qty > 1 ? "shoes" : "shoe"} x Rp.{" "}
                      {val?.orderDetails[0]?.price.toLocaleString("id-ID")}
                    </Text>
                  </Flex>
                </Flex>
                <Flex
                  flexDir={"column"}
                  w={"30%"}
                  h={"100%"}
                  align={"center"}
                  justify={"center"}
                >
                  <Text color={"gray.500"} fontSize={"sm"}>
                    Total Prices
                  </Text>
                  <Text fontWeight={"bold"}>
                    Rp. {val.total_price.toLocaleString("id-ID")}
                  </Text>
                </Flex>
              </Flex>
              <Flex
                h={"50px"}
                justify={val?.status === "PAYMENT" ? "space-between" : "right"}
                px={"20px"}
                align={"center"}
              >
                {val?.status === "PAYMENT" ? (
                  <CancelOrderAlert id={val.id} cancelOrder={cancelOrder} />
                ) : null}

                <Text
                  cursor={"pointer"}
                  fontSize={"sm"}
                  onClick={() => openDetailsModal(val)}
                >
                  Show Order Details
                </Text>
              </Flex>
            </Flex>
          ))}
          <OrderDetailsModal
            val={selectedVal}
            isOpen={detailsModal.isOpen}
            onClose={detailsModal.onClose}
            fetchOrders={fetchOrders}
          />
          {/* </VStack> */}
        </Flex>
        <Flex w={"100%"} h={"30px"} justify={"center"} mt={"12px"}>
          {orders?.totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={orders?.totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </Flex>
      </Flex>
      <Footer />
    </Center>
  );
}

function Pagination({ currentPage, totalPages, onPageChange }) {
  return (
    <HStack spacing={2}>
      <Center
        w={"30px"}
        h={"30px"}
        as="button"
        bg={currentPage === 1 ? "gray.200" : "white"}
        borderColor={currentPage === 1 ? "gray.400" : "gray.200"}
        borderWidth="1px"
        borderRadius="md"
        p={2}
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        <Icon as={FaChevronLeft} />
      </Center>
      {Array.from({ length: totalPages }, (_, index) => (
        <Center
          w={"30px"}
          h={"30px"}
          key={index}
          as="button"
          bg={currentPage === index + 1 ? "black" : "white"}
          color={currentPage === index + 1 ? "white" : "gray.500"}
          borderColor={currentPage === index + 1 ? "black" : "gray.200"}
          borderWidth="1px"
          borderRadius="md"
          p={2}
          disabled={currentPage === index + 1}
          onClick={() => onPageChange(index + 1)}
          fontSize={"sm"}
        >
          {index + 1}
        </Center>
      ))}
      <Center
        w={"30px"}
        h={"30px"}
        as="button"
        bg={currentPage === totalPages ? "gray.200" : "white"}
        borderColor={currentPage === totalPages ? "gray.400" : "gray.200"}
        borderWidth="1px"
        borderRadius="md"
        p={2}
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        <Icon as={FaChevronRight} />
      </Center>
    </HStack>
  );
}

function StatusCard({ title, selected, onClick }) {
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
