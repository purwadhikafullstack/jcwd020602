import { ModalFooter, ModalBody, useToast, Button } from "@chakra-ui/react";
import { ModalOverlay, ModalContent, ModalHeader } from "@chakra-ui/react";
import { Center, Image, Modal, Flex, Box } from "@chakra-ui/react";
import { ModalCloseButton, useDisclosure } from "@chakra-ui/react";
import PaymentProofModal from "../order/paymentProofModal";
import { useEffect, useState } from "react";
import { api } from "../../api/api";
import moment from "moment";
export default function OrderDetailModal(props) {
  const [showAllProducts, setShowAllProducts] = useState(false);
  const [order, setOrder] = useState({ orderDetails: [] });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const paymentProofModal = useDisclosure();
  const toast = useToast();
  async function getOrder() {
    try {
      const res = await api().get(`/orders/admin/${props.order}`);
      setOrder(res.data?.order);
    } catch (error) {
      toast({
        title: error.response?.data?.message,
        status: "error",
        isClosable: true,
        duration: 3000,
      });
    }
  }
  useEffect(() => {
    if (props.order) {
      getOrder();
    }
  }, [props.order]);
  return (
    <>
      <Modal
        scrollBehavior="inside"
        size={"xl"}
        isOpen={props.isOpen}
        onClose={props.onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader p={2} bgColor={"black"} color={"white"}>
            Transaction Details
          </ModalHeader>
          <ModalCloseButton color={"white"} />
          <ModalBody
            display={"flex"}
            gap={2}
            flexDirection={"column"}
            mb={"10px"}
          >
            <Flex
              w={"100%"}
              bgColor={"white"}
              borderRadius={"8px"}
              mt={"10px"}
              flexDir={"column"}
            >
              <Box as="b">{order?.status}</Box>
              <Flex
                mt={"10px"}
                flexDir={"column"}
                w={"100%"}
                h={"100%"}
                border={"1px"}
                borderRadius={"5px"}
                borderColor={"gray.400"}
                p={"10px"}
              >
                <Flex w={"100%"} justify={"space-between"}>
                  <Box fontSize={"sm"}>No. Order</Box>
                  <Box fontSize={"sm"} fontWeight={"bold"}>
                    {order?.transaction_code}
                  </Box>
                </Flex>
                <Flex w={"100%"} justify={"space-between"}>
                  <Box fontSize={"sm"}>Order Date</Box>
                  <Box fontSize={"sm"}>
                    {moment(order?.createdAt).format("dddd, MMMM Do YYYY")}{" "}
                  </Box>
                </Flex>
              </Flex>
            </Flex>
            <Center>
              {order?.status === "PAYMENT" ? (
                <Flex
                  flexDir={"column"}
                  w={"350px"}
                  align={"center"}
                  border={"1px"}
                  borderRadius={"5px"}
                  borderColor={"gray.400"}
                  bg={"black"}
                  pb={"10px"}
                >
                  <Box
                    mt={"20px"}
                    fontSize={"sm"}
                    fontWeight={"bold"}
                    color={"white"}
                  >
                    Batas Akhir Pembayaran
                  </Box>
                  <Box
                    key={order?.id}
                    fontSize={"sm"}
                    color={"white"}
                    pb={"10px"}
                  >
                    {moment(order?.last_payment_date).format(
                      "dddd, MMMM Do YYYY"
                    )}
                  </Box>
                </Flex>
              ) : (
                <Box
                  fontSize={"sm"}
                  cursor={"pointer"}
                  onClick={() => paymentProofModal.onOpen()}
                >
                  Show Payment Proof
                </Box>
              )}
              <PaymentProofModal
                val={order}
                isOpen={paymentProofModal.isOpen}
                onClose={paymentProofModal.onClose}
              />
            </Center>
            <Flex w={"100%"} flexDir={"column"} mt={"10px"}>
              <Box as="b">Detail Produk</Box>
              <Box id="a" maxH={"170px"} overflowY={"scroll"}>
                {order?.orderDetails
                  ?.slice(0, showAllProducts ? undefined : 1)
                  ?.map((val) => (
                    <Flex
                      key={val?.id}
                      mt={"10px"}
                      h={"70px"}
                      w={"100%"}
                      justify={"center"}
                      border={"1px"}
                      borderRadius={"5px"}
                      borderColor={"gray.400"}
                      align={"center"}
                    >
                      <Flex
                        h={"60px"}
                        w={"100px"}
                        align={"center"}
                        justify={"center"}
                      >
                        <Image
                          src={`${process.env.REACT_APP_API_BASE_URL}/${val?.stock?.Sho?.ShoeImages[0]?.shoe_img}`}
                          w={"100%"}
                          objectFit={"cover"}
                          maxW={"50px"}
                          maxH={"50px"}
                        />
                      </Flex>
                      <Flex
                        flexDir={"column"}
                        w={"100%"}
                        pl={"10px"}
                        pt={"10px"}
                        h={"100%"}
                        borderRight={"1px"}
                        borderColor={"gray.300"}
                      >
                        <Box fontWeight={"bold"} fontSize={"sm"}>
                          {val?.stock?.Sho?.name}
                        </Box>
                        <Box fontSize={"x-small"} color={"gray.400"}>
                          size : {val?.stock?.shoeSize?.size}
                        </Box>
                        <Box fontSize={"x-small"} color={"gray.400"}>
                          {val?.qty} {val?.qty > 1 ? "shoes" : "shoe"} x Rp.{" "}
                          {val?.price.toLocaleString("id-ID")}
                        </Box>
                      </Flex>
                    </Flex>
                  ))}
                {order?.orderDetails.length > 1 && (
                  <Box
                    fontSize={"x-small"}
                    cursor={"pointer"}
                    onClick={() => setShowAllProducts(!showAllProducts)}
                  >
                    {showAllProducts ? "Hide Other Shoes" : "Show All Shoes"}
                  </Box>
                )}
              </Box>
            </Flex>
            <Flex w={"100%"} flexDir={"column"} mt={"10px"}>
              <Box as="b">Shipping Information</Box>
              <Flex flexDir={"column"} w={"100%"}>
                <Flex h={"50px"} mt={"10px"}>
                  <Box w={"80px"} fontSize={"sm"} color={"gray.500"}>
                    Courier
                  </Box>
                  <Box fontSize={"sm"}>:</Box>
                  <Flex flexDir={"column"} pl={"10px"}>
                    <Box fontSize={"sm"}>
                      {order?.courier?.toUpperCase()} {order?.shipping_service}{" "}
                      - {order?.shipping_method}
                    </Box>
                    <Box fontSize={"sm"} fontWeight={"bold"}>
                      (Estimate arrived in {order?.shipping_duration})
                    </Box>
                  </Flex>
                </Flex>
                <Flex mt={"10px"}>
                  <Box minW={"80px"} fontSize={"sm"} color={"gray.500"}>
                    Address
                  </Box>
                  <Box fontSize={"sm"}>:</Box>
                  <Flex flexDir={"column"} pl={"10px"} w={"310px"}>
                    <Box fontSize={"sm"}>{order.address?.name} </Box>
                    <Box fontSize={"sm"} fontWeight={"bold"}>
                      {order?.address?.phone}
                    </Box>
                    <Box fontSize={"sm"}>
                      {order?.address?.address},
                      {order?.address?.address_details},
                      {order?.address?.postcode}
                    </Box>
                  </Flex>
                </Flex>
              </Flex>
            </Flex>
            <Flex w={"100%"} flexDir={"column"} mt={"10px"}>
              <Box as="b">Payment Details</Box>
              <Flex flexDir={"column"} w={"100%"}>
                <Flex h={"50px"} mt={"10px"}>
                  <Box w={"80px"} fontSize={"sm"} color={"gray.500"}>
                    Shipping cost
                  </Box>
                  <Box fontSize={"sm"}>:</Box>
                  <Flex flexDir={"column"} pl={"10px"}>
                    <Box fontSize={"sm"}>
                      {order?.shipping_cost?.toLocaleString("id-ID", {
                        style: "currency",
                        currency: "IDR",
                      })}
                    </Box>
                  </Flex>
                </Flex>
                <Flex mt={"10px"}>
                  <Box minW={"80px"} fontSize={"sm"} color={"gray.500"}>
                    shoe price
                  </Box>
                  <Box fontSize={"sm"}>:</Box>
                  <Flex flexDir={"column"} pl={"10px"} w={"310px"}>
                    <Box fontSize={"sm"}>
                      {(
                        order?.total_price - order?.shipping_cost
                      )?.toLocaleString("id-ID", {
                        style: "currency",
                        currency: "IDR",
                      })}{" "}
                    </Box>
                    <Box fontSize={"sm"} fontWeight={"bold"}>
                      (without shipping cost)
                    </Box>
                  </Flex>
                </Flex>
                <Flex mt={"10px"}>
                  <Box minW={"80px"} fontSize={"sm"} color={"gray.500"}>
                    Total price
                  </Box>
                  <Box fontSize={"sm"}>:</Box>
                  <Flex flexDir={"column"} pl={"10px"} w={"310px"}>
                    <Box fontSize={"sm"}>
                      {order?.total_price?.toLocaleString("id-ID", {
                        style: "currency",
                        currency: "IDR",
                      })}
                    </Box>
                  </Flex>
                </Flex>
              </Flex>
            </Flex>
          </ModalBody>
          <ModalFooter>
            <Button onClick={props.onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
