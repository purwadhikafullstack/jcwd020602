import {
  Modal,
  ModalOverlay,
  ModalContent,
  Flex,
  useDisclosure,
} from "@chakra-ui/react";
import {
  ModalHeader,
  ModalFooter,
  Text,
  Button,
  Center,
  VStack,
} from "@chakra-ui/react";
import { ModalBody, ModalCloseButton, Image, Input } from "@chakra-ui/react";
import { useRef, useState } from "react";
import { api } from "../../api/api";
import PaymentProofModal from "./paymentProofModal";

export default function OrderDetailsModal(props) {
  const [showAllProducts, setShowAllProducts] = useState(false);
  const inputFileRef = useRef(null);
  const [SelectedFile, setSelectedFile] = useState(null);
  const paymentProofModal = useDisclosure();

  const formatDate = (isoDate) => {
    const options = {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    };
    return new Date(isoDate).toLocaleDateString("en-US", options);
  };
  const handleFile = (event) => {
    setSelectedFile(event.target.files[0]);
    console.log(event.target.files[0]);
  };

  const paymentProof = async () => {
    try {
      const formData = new FormData();
      formData.append("payment_proof", SelectedFile);
      formData.append("id", props.val.id);
      await api().patch("/orders/paymentProof", formData);
      props.fetchOrders();

      alert("successfully upload payment proof");
    } catch (err) {
      console.log(err.response?.data);
    }
  };

  return (
    <Modal
      scrollBehavior="inside"
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
            <Text fontWeight={"bold"}>{props.val?.status}</Text>
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
                <Text fontSize={"sm"}>No. Order</Text>
                <Text fontSize={"sm"} fontWeight={"bold"}>
                  {props.val?.transaction_code}
                </Text>
              </Flex>
              <Flex w={"100%"} justify={"space-between"}>
                <Text fontSize={"sm"}>Order Date</Text>
                <Text fontSize={"sm"}>{formatDate(props.val?.createdAt)} </Text>
              </Flex>
            </Flex>
          </Flex>
          <Center>
            {props.val?.status === "PAYMENT" ? (
              <Flex
                flexDir={"column"}
                w={"350px"}
                h={"130px"}
                align={"center"}
                border={"1px"}
                borderRadius={"5px"}
                borderColor={"gray.400"}
                bg={"black"}
                pb={"10px"}
              >
                <Text
                  mt={"20px"}
                  fontSize={"sm"}
                  fontWeight={"bold"}
                  color={"white"}
                >
                  Batas Akhir Pembayaran
                </Text>

                <Text
                  key={props.val.id}
                  fontSize={"sm"}
                  color={"white"}
                  pb={"10px"}
                >
                  {formatDate(props.val.last_payment_date)}
                </Text>

                <Flex
                  w={"85%"}
                  h={"50px"}
                  bg={"white"}
                  align={"center"}
                  px={"10px"}
                  borderRadius={"5px"}
                >
                  <Input
                    accept="image/png, image/jpeg"
                    type="file"
                    onChange={handleFile}
                    ref={inputFileRef}
                    // display={"none"}
                    size={"sm"}
                  />
                  <Button
                    ml={"5px"}
                    w={"60px"}
                    bg={"black"}
                    onClick={paymentProof}
                    size={"sm"}
                    fontSize={"x-small"}
                    color={"white"}
                  >
                    upload
                  </Button>
                </Flex>
              </Flex>
            ) : (
              <Text
                fontSize={"sm"}
                cursor={"pointer"}
                onClick={() => paymentProofModal.onOpen()}
              >
                Show Payment Proof
              </Text>
            )}
            <PaymentProofModal
              val={props.val}
              isOpen={paymentProofModal.isOpen}
              onClose={paymentProofModal.onClose}
            />
          </Center>

          <Flex w={"100%"} flexDir={"column"} mt={"10px"}>
            <Text fontWeight={"bold"}>Detail Produk</Text>
            {props.val?.orderDetails
              .slice(0, showAllProducts ? undefined : 1)
              .map((val) => (
                <Flex
                  key={val.id}
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
                    <Text fontWeight={"bold"} fontSize={"sm"}>
                      {val?.stock?.Sho?.name}
                    </Text>
                    <Text fontSize={"x-small"} color={"gray.400"}>
                      size : {val?.stock?.shoeSize?.size}
                    </Text>
                    <Text fontSize={"x-small"} color={"gray.400"}>
                      {val?.qty} {val?.qty > 1 ? "shoes" : "shoe"} x Rp.{" "}
                      {val?.price.toLocaleString("id-ID")}
                    </Text>
                  </Flex>
                </Flex>
              ))}
            {props.val?.orderDetails.length > 1 && (
              <Text
                fontSize={"x-small"}
                cursor={"pointer"}
                onClick={() => setShowAllProducts(!showAllProducts)}
              >
                {showAllProducts ? "Hide Other Shoes" : "Show All Shoes"}
              </Text>
            )}
          </Flex>

          <Flex w={"100%"} flexDir={"column"} mt={"10px"}>
            <Text fontWeight={"bold"}>Shipping Information</Text>
            <Flex flexDir={"column"} w={"100%"}>
              <Flex h={"50px"} mt={"10px"}>
                <Text w={"80px"} fontSize={"sm"} color={"gray.500"}>
                  Courier
                </Text>
                <Text fontSize={"sm"}>:</Text>
                <Flex flexDir={"column"} pl={"10px"}>
                  <Text fontSize={"sm"}>
                    {props.val?.courier.toUpperCase()}{" "}
                    {props.val?.shipping_service} - {props.val?.shipping_method}
                  </Text>
                  <Text fontSize={"sm"} fontWeight={"bold"}>
                    (Estimate arrived in {props.val?.shipping_duration})
                  </Text>
                </Flex>
              </Flex>
              <Flex mt={"10px"}>
                <Text minW={"80px"} fontSize={"sm"} color={"gray.500"}>
                  Address
                </Text>
                <Text fontSize={"sm"}>:</Text>
                <Flex flexDir={"column"} pl={"10px"} w={"310px"}>
                  <Text fontSize={"sm"}>{props.val?.address.name} </Text>
                  <Text fontSize={"sm"} fontWeight={"bold"}>
                    {props.val?.address.phone}
                  </Text>
                  <Text fontSize={"sm"}>
                    {props.val?.address.address},
                    {props.val?.address.address_details},
                    {props.val?.address.postcode}
                  </Text>
                </Flex>
              </Flex>
            </Flex>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
