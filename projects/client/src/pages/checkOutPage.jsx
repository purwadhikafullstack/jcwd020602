import {
  Flex,
  Heading,
  Text,
  Center,
  Image,
  Button,
  useToast,
} from "@chakra-ui/react";
import { HStack, Box, Icon, Checkbox, useDisclosure } from "@chakra-ui/react";
import { Select, VStack } from "@chakra-ui/react";
import OrderSummary from "../components/order/orderSummary";
import {
  cartSelector,
  getCarts,
  getTotalPriceInCart,
  getTotalProductsInCart,
  getTotalWeightInCart,
} from "../redux/cart";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFetchAddress } from "../hooks/useFetchCheckOutAddress";
import { IoAddCircleOutline } from "react-icons/io5";
import { api } from "../api/api";
import AddressCard from "../components/order/addressCard";
import jneImage from "../assets/checkOutPage/JNE.png";
import tikiImage from "../assets/checkOutPage/TIKI.png";
import posImage from "../assets/checkOutPage/POS_Indonesia.png";
import AddAddressCheckOut from "../components/order/addAddressCheckOut";
import { useFetchShipping } from "../hooks/useFetchCOShipping";
import DeliveryServices from "../components/order/deliveryServiceCheckBox";
import { GrFormPrevious, GrFormNext } from "react-icons/gr";
import Payment from "../components/order/payment";

export default function CheckOutPage() {
  const dispatch = useDispatch();
  const carts = useSelector(cartSelector.selectAll);
  const totalPriceSum = useSelector(getTotalPriceInCart);
  const sumItem = useSelector(getTotalProductsInCart);
  const weightTotal = useSelector(getTotalWeightInCart);
  const navigate = useNavigate();
  const [selectedAddressId, setSelectedAddressId] = useState();
  const [courier, setCourier] = useState(null);
  const { shipping, fetchShipping } = useFetchShipping(weightTotal, courier);
  const addModal = useDisclosure();
  const payModal = useDisclosure();
  const [cost, setCost] = useState(null);
  const totalOrder = totalPriceSum + cost;
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 2;
  const { address, totalPages, fetch } = useFetchAddress(currentPage, perPage);
  const toast = useToast();

  useEffect(() => {
    fetch();
  }, [currentPage]);

  useEffect(() => {
    dispatch(getCarts());
  }, [navigate, dispatch]);

  useEffect(() => {
    fetchShipping(weightTotal, courier);
    setCost(null);
  }, [courier]);

  async function chooseAddress(id) {
    try {
      await api.patch(`/checkOuts`, { id });
      fetch();
    } catch (error) {
      console.log(error.response?.data);
    }
  }

  async function handleOrder() {
    try {
      if (courier == null) {
        toast({
          title: "Please select the shipping method",
          status: "warning",
          position: "top",
          duration: 5000,
          isClosable: true,
        });
      } else {
        await api.post("/orders", {
          courier: courier,
          shipping_cost: cost,
          total_price: totalOrder,
        });
        payModal.onOpen();
      }
    } catch (err) {
      toast({
        title: err.response?.data,
        status: "error",
        position: "top",
        duration: 5000,
        isClosable: true,
      });
    }
  }

  const handleCheckboxChange = (value) => {
    setCourier(value);
  };

  const handleSelect = (event) => {
    const selectedValue = parseInt(event.target.value);
    setCost(selectedValue);
  };

  const handlePage = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };
  return (
    <Center>
      <Flex justify={"space-between"} w={"70vw"} h={"120vh"}>
        <Flex flexDir={"column"} mt={"100px"} w={"55vw"} mr={"40px"}>
          <Box w={"100%"} py={"20px"}>
            <Text fontSize={"2xl"} fontWeight={"bold"} letterSpacing={"wide"}>
              SHIPPING DETAILS
            </Text>
          </Box>
          {address?.length > 0 ? (
            <Flex flexDir={"column"} h={"270px"}>
              <Flex justify={"space-between"}>
                <Text fontWeight={"bold"}>Saved Address</Text>
                <HStack>
                  <GrFormPrevious
                    onClick={() => handlePage(currentPage - 1)}
                    disabled={currentPage === 1}
                    cursor={"pointer"}
                  />
                  <Text fontSize={"sm"} w={"10px"} align={"center"}>
                    {currentPage}
                  </Text>
                  <GrFormNext
                    onClick={() => handlePage(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                    cursor={"pointer"}
                  />
                </HStack>
              </Flex>
              <Box h={"210px"}>
                {address?.map((val, idx) => (
                  <AddressCard
                    key={val.id}
                    {...val}
                    isSelected={selectedAddressId === val.id}
                    onClick={() => {
                      setSelectedAddressId(val.id);
                      chooseAddress(val.id);
                    }}
                  />
                ))}
              </Box>
              <Center
                color={"gray.500"}
                gap={"10px"}
                cursor={"pointer"}
                onClick={addModal.onOpen}
              >
                <Icon as={IoAddCircleOutline} w={7} h={7} /> Add new address
                <AddAddressCheckOut
                  isOpen={addModal.isOpen}
                  onClose={addModal.onClose}
                  fetch={fetch}
                />
              </Center>
            </Flex>
          ) : (
            <Center
              pt={"10px"}
              color={"gray.500"}
              gap={"10px"}
              cursor={"pointer"}
              onClick={addModal.onOpen}
            >
              <Icon as={IoAddCircleOutline} w={7} h={7} /> Add new address
              <AddAddressCheckOut
                isOpen={addModal.isOpen}
                onClose={addModal.onClose}
                fetch={fetch}
              />
            </Center>
          )}
          <Box w={"100%"} py={"20px"}>
            <Text fontSize={"2xl"} fontWeight={"bold"} letterSpacing={"wide"}>
              SHIPPING METHOD
            </Text>
          </Box>
          <Flex justify={"space-around"} align={"center"}>
            <DeliveryServices
              imageUrl={jneImage}
              value="jne"
              isSelected={courier === "jne"}
              onCheckboxChange={handleCheckboxChange}
            />
            <DeliveryServices
              imageUrl={tikiImage}
              value="tiki"
              isSelected={courier === "tiki"}
              onCheckboxChange={handleCheckboxChange}
            />
            <DeliveryServices
              imageUrl={posImage}
              value="pos"
              isSelected={courier === "pos"}
              onCheckboxChange={handleCheckboxChange}
            />
          </Flex>
          <Box p={4}>
            <Select placeholder="Select shipping" onChange={handleSelect}>
              {shipping?.map((val) => (
                <option key={val.service} value={val.cost[0].value}>
                  {`${val.service} - ${val.description} - (${val.cost[0].etd} days) (${val.cost[0].value} IDR) `}
                </option>
              ))}
            </Select>
            <Center>{cost !== null && <p>Selected Cost: {cost} IDR</p>}</Center>
          </Box>
          <Button
            // w={"100%"} bg={"black"} textColor={"white"}
            backgroundColor="black"
            color="white"
            boxShadow="0px 4px 0px 0px rgba(0, 0, 0, 0.2)" // Replace the values with your desired shadow color
            _hover={{
              boxShadow: "0px 6px 0px 0px rgba(0, 0, 0, 0.2)", // Adjust the hover shadow if needed
            }}
            onClick={() => handleOrder()}
          >
            {" "}
            PROCEED THE ORDER
          </Button>
          <Payment isOpen={payModal.isOpen} onClose={payModal.onClose} />
        </Flex>
        <OrderSummary
          carts={carts}
          totalPriceSum={totalPriceSum}
          sumItem={sumItem}
          weightTotal={weightTotal}
          cost={cost}
          totalOrder={totalOrder}
        />
      </Flex>
    </Center>
  );
}