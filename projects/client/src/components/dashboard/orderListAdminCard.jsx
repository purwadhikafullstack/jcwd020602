import { Menu, MenuButton, MenuList } from "@chakra-ui/react";
import { MenuItem, Image, useDisclosure } from "@chakra-ui/react";
import { Box, Button, Flex, Icon } from "@chakra-ui/react";
import { useState } from "react";
import { GrClose, GrMenu } from "react-icons/gr";
import { useFetchOrderList } from "../../hooks/useFetchOrder";
import moment from "moment";
import PaymentImageModal from "./paymentImageModal";
import OrderDetailModal from "./orderDetailModal";
export default function OrderListAdmin({ filter }) {
  const { orders, fetchOrdersList } = useFetchOrderList(filter);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const upOrder = useDisclosure();
  const odM = useDisclosure();
  const [order_id, setOrder_id] = useState();
  const [proof, setProof] = useState();
  return (
    <>
      {orders?.rows &&
        orders?.rows.map((order) => (
          <Box border={"1px"} m={1}>
            <Flex justify={"space-between"} p={1} bg={"black"} align={"center"}>
              <Flex flexWrap={"wrap"} gap={1} color={"white"}>
                <Box>{order.status}/</Box>
                <Box>{order.transaction_code}/</Box>
                <Box>{order.user?.name}/</Box>
                <Box>
                  {moment(order.createdAt).format("DD MMM YYYY, HH:MM")}
                </Box>
              </Flex>
              {order.status == "CONFIRM_PAYMENT" ? (
                <Flex gap={1}>
                  <Menu>
                    {({ isOpen }) => (
                      <>
                        <MenuButton isActive={isOpen} as={Button} p={0}>
                          <Icon as={isOpen ? GrClose : GrMenu} />
                        </MenuButton>
                        <MenuList>
                          <MenuItem
                            onClick={() => {
                              setProof(order);
                              upOrder.onOpen();
                            }}
                          >
                            Proceed Order
                          </MenuItem>
                        </MenuList>
                      </>
                    )}
                  </Menu>
                </Flex>
              ) : null}
            </Flex>
            <Box className="orderlist-card" m={1}>
              {/* product */}
              <Box id="a">
                <Flex gap={2} m={2} align={"center"} border={"1px"}>
                  <Box>
                    <Image
                      src={`${process.env.REACT_APP_API_BASE_URL}/${order?.orderDetails[0]?.stock?.Sho?.ShoeImages[0]?.shoe_img}`}
                      objectFit={"cover"}
                      // w={"100%"}
                      w={"250px"}
                      h={"200px"}
                    />
                  </Box>
                  <Flex flexDir={"column"} gap={1} w={"100%"} mr={1}>
                    <Box border={"1px"}>
                      <Box fontSize={10} bg="black" color="white" px={1}>
                        Name
                      </Box>
                      <Box px={1}>
                        {order?.orderDetails[0]?.stock?.Sho?.name}{" "}
                      </Box>
                    </Box>
                    <Box border={"1px"}>
                      <Box fontSize={10} bg="black" color="white" px={1}>
                        Size
                      </Box>
                      <Box px={1}>
                        {order?.orderDetails[0]?.stock?.shoeSize?.size}
                      </Box>
                    </Box>
                    <Box border={"1px"}>
                      <Box fontSize={10} bg="black" color="white" px={1}>
                        Qty
                      </Box>
                      <Box px={1}> {order?.orderDetails[0]?.qty}</Box>
                    </Box>
                    <Box border={"1px"}>
                      <Box fontSize={10} bg="black" color="white" px={1}>
                        Price
                      </Box>
                      <Box px={1}>
                        {order?.orderDetails[0]?.price?.toLocaleString(
                          "id-ID",
                          {
                            style: "currency",
                            currency: "IDR",
                          }
                        )}
                      </Box>
                    </Box>
                  </Flex>
                </Flex>
                <Flex justify={"center"} p={2} w={"100%"}>
                  <Button
                    id="button"
                    w={"100%"}
                    size={"sm"}
                    onClick={() => {
                      setOrder_id(order?.id);
                      odM.onOpen();
                    }}
                  >
                    {`View Order Details (${order?.orderDetails?.length})`}
                  </Button>
                </Flex>
              </Box>
              {/* addrees */}
              <Box id="a">
                <Box px={2} fontWeight={"bold"} borderBottom={"1px"}>
                  Address
                </Box>
                <Box m={2}>
                  {`${order?.address?.name}, ${order?.address?.phone}
                ${order?.address?.address}, ${order?.address?.city?.type},
                ${order?.address?.city?.city_name},
                ${order?.address?.city?.province},
                ${order?.address?.city?.postal_code},
                (footHub NOTE: ${order?.address?.address_details})`}
                </Box>
              </Box>
              {/* courir */}
              <Box id="a">
                <Box px={2} fontWeight={"bold"} borderBottom={"1px"}>
                  Courier
                </Box>
                <Box m={2}>
                  {" "}
                  {order?.courier}, {order?.shipping_method},{" "}
                  {order?.shipping_service}, {order?.shipping_duration}
                </Box>
                <Box></Box>
              </Box>
            </Box>
            <Flex justify={"space-between"} m={1} border={"1px"} px={1}>
              <Box fontWeight={"bold"}>Total Price</Box>
              <Box fontWeight={"bold"}>
                {order?.total_price?.toLocaleString("id-ID", {
                  style: "currency",
                  currency: "IDR",
                })}
              </Box>
            </Flex>
          </Box>
        ))}
      <PaymentImageModal
        isOpen={upOrder.isOpen}
        onClose={upOrder.onClose}
        order={proof}
        setOrder={setProof}
        fetch={fetchOrdersList}
      />
      <OrderDetailModal
        isOpen={odM.isOpen}
        onClose={odM.onClose}
        order={order_id}
      />
    </>
  );
}
