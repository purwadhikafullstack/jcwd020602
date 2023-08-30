import {
  Center,
  Flex,
  Text,
  HStack,
  Box,
  Input,
  Select,
} from "@chakra-ui/react";
import {
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
import Navbar from "../components/website/navbar";
import Footer from "../components/website/footer";
import Pagination from "../components/order/paginationOrder";
import StatusCard from "../components/order/statusCardOrder";
import OrderListCard from "../components/order/orderListCard";

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
  const doneOrder = async (id) => {
    try {
      await api().patch(`/orders/doneOrder/${id}`);
      fetchOrders();
      alert("Order accepted");
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
        <Flex flexDir={"column"} w={"100%"} align={"center"}>
          <Flex w={"95%"} align={"flex-end"} flexWrap={"wrap"} gap={2}>
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
                type="date"
                onChange={(e) => {
                  handleDateChange(e.target.value, filter.toDate);
                }}
              />
            </InputGroup>
            <InputGroup size="sm" w="200px" display={"flex"} flexDir={"column"}>
              <Text fontSize={"x-small"}>To :</Text>
              <Input
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
            gap={2}
          >
            <Box w={"100px"}>Statuses</Box>
            <Flex
              ml="20px"
              align="center"
              overflowX="auto"
              css={{
                "&::-webkit-scrollbar": {
                  height: "6px",
                },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "rgba(0, 0, 0, 0.3)",
                  borderRadius: "3px",
                },
              }}
            >
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
          {orders?.data?.map((val) => (
            <OrderListCard
              val={val}
              openDetailsModal={openDetailsModal}
              cancelOrder={cancelOrder}
              filter={filter}
              doneOrder={doneOrder}
            />
          ))}
          <OrderDetailsModal
            val={selectedVal}
            setVal={setSelectedVal}
            isOpen={detailsModal.isOpen}
            onClose={detailsModal.onClose}
            fetchOrders={fetchOrders}
          />
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
