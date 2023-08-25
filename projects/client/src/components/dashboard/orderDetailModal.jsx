import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  Button,
  ModalHeader,
  useToast,
  Box,
  Divider,
  Flex,
  Image,
} from "@chakra-ui/react";
import { api } from "../../api/api";
import { useEffect, useState } from "react";
import moment from "moment";

export default function OrderDetailModal(props) {
  const [order, setOrder] = useState({});
  const toast = useToast();
  async function getOrder() {
    try {
      const res = await api().get(`/orders/admin/${props.order}`);
      console.log(res.data?.order);
      setOrder(res.data?.order);
    } catch (error) {
      console.log(error);
      toast({
        title: error.response?.data.message,
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
      <Modal size={"xl"} isOpen={props.isOpen} onClose={props.onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Transaction Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box as="b">Transaction Code:</Box>
            <Box>{order?.transaction_code}</Box>
            <Box as="b">Status:</Box>
            <Box>{order.status}</Box>
            <Box as="b">Transaction Date:</Box>
            <Box>{moment(order?.createdAt).format("DD MMM YYYY, HH:MM")}</Box>
            <Divider my="4" />
            <Box as="b">Product Details:</Box>
            <Box id="a" maxH={"300px"} overflowY={"scroll"} border={"1px"}>
              {order?.orderDetails?.map((val) => (
                <Flex gap={2} m={2} align={"center"} border={"1px"}>
                  <Image
                    src={`${process.env.REACT_APP_API_BASE_URL}/${val?.stock?.Sho?.ShoeImages[0]?.shoe_img}`}
                    w={"130px"}
                  />
                  <Flex flexDir={"column"} gap={1} w={"100%"} mr={1}>
                    <Flex gap={1}>
                      <Box>Name: </Box>
                      <Box> {val?.stock?.Sho?.name} </Box>
                    </Flex>
                    <Flex gap={1}>
                      <Box>Size: </Box>
                      <Box> {val?.stock?.shoeSize?.size}</Box>
                    </Flex>
                    <Flex gap={1}>
                      <Box>Qty: </Box>
                      <Box> {val?.qty}</Box>
                    </Flex>
                    <Flex gap={1}>
                      <Box>Price: </Box>
                      <Box>
                        {val?.price?.toLocaleString("id-ID", {
                          style: "currency",
                          currency: "IDR",
                        })}
                      </Box>
                    </Flex>
                  </Flex>
                </Flex>
              ))}
            </Box>
            <Box mt="4">
              Total weight:{" "}
              {order.orderDetails &&
                order?.orderDetails?.reduce((prev, curr) => {
                  prev += curr.stock?.Sho?.weight;
                  return prev;
                }, 0)}{" "}
              gr
            </Box>
            <Box>
              Shipping method: {order?.courier}, {order?.shipping_method},{" "}
              {order?.shipping_service}, {order?.shipping_duration}
            </Box>
            <Divider my="4" />
            <Box as="b">Payment Details</Box>
            <Box>
              Shipping cost:{" "}
              {order?.shipping_cost?.toLocaleString("id-ID", {
                style: "currency",
                currency: "IDR",
              })}
            </Box>
            <Box>
              All shoe price:{" "}
              {(order.total_price - order.shipping_cost)?.toLocaleString(
                "id-ID",
                { style: "currency", currency: "IDR" }
              )}
            </Box>
            <Box as="b">
              Total price:{" "}
              {order?.total_price?.toLocaleString("id-ID", {
                style: "currency",
                currency: "IDR",
              })}
            </Box>
          </ModalBody>

          <ModalFooter>
            <Button onClick={props.onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
