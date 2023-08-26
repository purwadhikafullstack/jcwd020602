import { Flex, Text, Center, Image, Box } from "@chakra-ui/react";
import { useEffect, useState } from "react";
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

export default function CartPage() {
  const dispatch = useDispatch();
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
    <Center flexDir={"column"}>
      <Navbar />
      <Box
        id="product-detail"
        display={"flex"}
        w={"100%"}
        maxW={"1533px"}
        p={"0rem 1rem"}
        mt={"100px"}
        mb={"20px"}
        gap={2}
        justifyContent={"space-between"}
      >
        {/*  */}
        <Flex
          flexDir={"column"}
          gap={3}
          w={"100%"}
          maxW={"1000px"}
          border={"2px"}
        >
          <Flex justify={"space-between"} p={2} align={"center"}>
            <Flex gap={2} align={"center"}>
              <Box fontSize={"30px"} fontWeight={"bold"}>
                YOUR CART
              </Box>
              {sumItem == 0 ? (
                " "
              ) : sumItem > 1 ? (
                <Text bg={"black"} color={"white"} p={1}>
                  {sumItem} ITEMS
                </Text>
              ) : (
                <Text bg={"black"} color={"white"}>
                  {sumItem} ITEM
                </Text>
              )}
            </Flex>
          </Flex>
          {/* mapping */}
          <Flex flexDir={"column"} p={2} gap={2}>
            {carts && carts.length ? (
              carts
                .slice(
                  (currentPage - 1) * itemsPerPage,
                  currentPage * itemsPerPage
                )
                .map((val) => {
                  const totalPrice = val?.Shoes.price * val.qty;
                  return (
                    <>
                      <Box className="cart-card" border={"1px"} p={1}>
                        <Box>
                          <Image
                            src={`${process.env.REACT_APP_API_BASE_URL}/${val?.Shoes?.ShoeImages[0]?.shoe_img}`}
                            maxW={"200px"}
                            w={"100%"}
                          />
                        </Box>
                        <Flex
                          flexDir={"column"}
                          w={"100%"}
                          gap={5}
                          pos={"relative"}
                        >
                          <Flex justify={"space-between"}>
                            <Flex flexDir={"column"}>
                              <Box fontWeight={"bold"}>{val?.Shoes?.name}</Box>
                              <Box>{val?.Shoes?.Category?.name}</Box>
                              <Box>size: {val?.ShoeSize.size}</Box>
                              <Flex flexDir={"column"}>
                                Quantity:
                                <QtyOption
                                  key={val.id}
                                  cartItem={val}
                                  onQuantityChange={handleQuantityChange}
                                />
                              </Flex>
                            </Flex>
                            <Box fontWeight={"bold"}>
                              Rp. {totalPrice.toLocaleString("id-ID")}
                            </Box>
                          </Flex>
                          {/*  */}
                          <Box
                            pos={"absolute"}
                            bottom={0}
                            right={0}
                            _hover={{ bg: "gray.100" }}
                            cursor={"pointer"}
                          >
                            <DeleteProductAlert
                              id={val.id}
                              handleDelete={handleDeleteProduct}
                            />
                          </Box>
                        </Flex>
                      </Box>
                    </>
                  );
                })
            ) : (
              <Center h={"400px"}>Your cart is empty.</Center>
            )}
            <Flex p={1} justify="center" align={"center"} mt="4" gap={"10px"}>
              <GrFormPrevious
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                mr="2"
                cursor={"pointer"}
              />
              <Box
                borderRadius={5}
                textAlign={"center"}
                bg={"black"}
                w={"23px"}
                color={"white"}
              >
                {currentPage}
              </Box>
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
        </Flex>

        <CheckoutBox
          totalPriceSum={totalPriceSum}
          sumItem={sumItem}
          weightTotal={weightTotal}
        />
      </Box>
      <Footer />
    </Center>
  );
}
