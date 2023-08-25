import {
  Flex,
  Heading,
  Text,
  Center,
  HStack,
  Button,
  Image,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { BsSearch } from "react-icons/bs";
import DeleteProductAlert from "../components/order/DeleteProductAlert";
import CheckoutBox from "../components/order/checkOutBox";
import {
  cartSelector,
  deleteProduct,
  getCarts,
  getTotalPriceInCart,
  getTotalProductsInCart,
  updateCarts,
  getTotalWeightInCart,
} from "../redux/cart";
import { useDispatch, useSelector } from "react-redux";
import QtyOption from "../components/order/qtyButtonOpt";
import Footer from "../components/website/footer";
import { GrFormPrevious, GrFormNext } from "react-icons/gr";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/website/navbar";

export default function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const carts = useSelector(cartSelector.selectAll);

  const totalPriceSum = useSelector(getTotalPriceInCart);
  const sumItem = useSelector(getTotalProductsInCart);
  const weightTotal = useSelector(getTotalWeightInCart);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;

  useEffect(() => {
    dispatch(getCarts());
  }, [dispatch]);

  const handleQuantityChange = (cartItemId, newQuantity) => {
    dispatch(updateCarts({ id: cartItemId, qty: newQuantity }));
  };
  const handleDeleteProduct = (id) => {
    dispatch(deleteProduct(id));
  };

  return (
    <>
      <Navbar />
      <Flex flexDir={{ base: "column", md: "row" }} w={"100%"}>
        <Flex
          flexDir={"column"}
          w={{ base: "100%", md: "60vw" }}
          ml={{ base: "0", md: "10px" }}
          mt={{ base: "50px", md: "100px" }}
          mr={{ base: "0", md: "50px" }}
        >
          <Flex
            w={"100%"}
            justify={"space-between"}
            align={"center"}
            borderBottom={"1px"}
            borderBottomColor={"gray.400"}
          >
            <Flex w={"250px"} justify={"space-between"} align={"center"}>
              <Heading>YOUR BAG</Heading>
              {carts?.length == 0 ? (
                " "
              ) : carts?.length > 1 ? (
                <Text>{sumItem} ITEMS</Text>
              ) : (
                <Text>{sumItem} ITEM</Text>
              )}
            </Flex>
            <Text
              textDecoration="underline"
              cursor={"pointer"}
              onClick={() => navigate("/dashboard")}
            >
              Continue Shopping
            </Text>
          </Flex>
          <Flex flexDir={"column"}>
            {carts.length > 0 ? (
              carts
                ?.slice(
                  (currentPage - 1) * itemsPerPage,
                  currentPage * itemsPerPage
                )
                .map((val, idx) => {
                  const totalPrice = val.Shoes?.price * val.qty;
                  return (
                    <HStack
                      w={"100%"}
                      borderBottom={"1px"}
                      borderBottomColor={"gray.400"}
                    >
                      <HStack w={"100%"} spacing={4}>
                        <Flex
                          h={"100%"}
                          w={"200px"}
                          ml={"5px"}
                          align={"center"}
                          justify={"center"}
                        >
                          <Image
                            src={`${process.env.REACT_APP_API_BASE_URL}/${val?.Shoes?.ShoeImages[0]?.shoe_img}`}
                            w={"100%"}
                            objectFit={"cover"}
                            maxW={"140px"}
                            maxH={"140px"}
                          />
                        </Flex>
                        <Flex
                          h={"100%"}
                          w={"220px"}
                          flexDir={"column"}
                          justify={"space-between"}
                        >
                          <Flex flexDir={"column"}>
                            <Text m={"5px"} fontWeight={"bold"}>
                              {val.Shoes?.name}
                            </Text>
                            <Text m={"5px"} fontSize={"sm"}>
                              Category : {val.Shoes?.Category?.name}
                            </Text>
                            <Text m={"5px"} fontSize={"sm"}>
                              weight : {val.Shoes?.weight}
                            </Text>
                            <Text m={"5px"} fontSize={"sm"}>
                              size : {val.ShoeSize?.size}
                            </Text>
                          </Flex>

                          <DeleteProductAlert
                            id={val.id}
                            handleDelete={handleDeleteProduct}
                          />
                        </Flex>
                        <Flex
                          w={"170px"}
                          h={"100%"}
                          align={"center"}
                          justify={"space-between"}
                        >
                          <Text>
                            Rp. {val.Shoes.price.toLocaleString("id-ID")}
                          </Text>
                        </Flex>
                        <QtyOption
                          key={val.id}
                          cartItem={val}
                          onQuantityChange={handleQuantityChange}
                        />

                        <Flex w={"200px"} align={"center"} justify={"right"}>
                          Rp. {totalPrice.toLocaleString("id-ID")}
                        </Flex>
                      </HStack>
                    </HStack>
                  );
                })
            ) : (
              <Center>Your cart is empty.</Center>
            )}
          </Flex>
          <Flex justify="center" mt="4" gap={"10px"}>
            <GrFormPrevious
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              mr="2"
              cursor={"pointer"}
            />
            <Text fontSize={"sm"}>{currentPage}</Text>
            <GrFormNext
              cursor={"pointer"}
              onClick={() =>
                setCurrentPage(
                  Math.min(
                    Math.ceil(carts.length / itemsPerPage),
                    currentPage + 1
                  )
                )
              }
              disabled={currentPage >= Math.ceil(carts.length / itemsPerPage)}
              ml="2"
            />
          </Flex>
        </Flex>
        <CheckoutBox
          totalPriceSum={totalPriceSum}
          sumItem={sumItem}
          weightTotal={weightTotal}
        />
      </Flex>
      <Footer />
    </>
  );
}
