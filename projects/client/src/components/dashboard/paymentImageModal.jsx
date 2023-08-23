import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  Image,
  ModalFooter,
  Button,
  ModalHeader,
  useToast,
  Flex,
} from "@chakra-ui/react";
import { api } from "../../api/api";

export default function PaymentImageModal(props) {
  const toast = useToast();
  async function confirmOrder(status) {
    try {
      const res = await api().patch(`/orders/admin/${props?.order?.id}`, {
        status,
      });
      props.fetch();
      clearData();
      toast({
        title: res.data.message,
        status: "success",
        isClosable: true,
        duration: 3000,
      });
    } catch (error) {
      console.log(error);
      toast({
        title: error.response.data.message,
        status: "error",
        isClosable: true,
        duration: 3000,
      });
    }
  }
  function clearData() {
    try {
      props.setOrder(null);
      props.onClose();
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <>
      <Modal size={"xl"} isOpen={props.isOpen} onClose={clearData}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <ModalCloseButton bg={"black"} color={"white"} />
          </ModalHeader>
          <ModalBody>
            <Image
              src={`${process.env.REACT_APP_API_BASE_URL}/${props?.order?.payment_proof}`}
              w={"100%"}
            />
          </ModalBody>
          <ModalFooter>
            <Flex w={"100%"} justifyContent={"space-between"}>
              <Button onClick={() => confirmOrder("CANCELED")}>
                Cancel Order
              </Button>
              <Flex gap={"5px"} w={"50%"}>
                <Button onClick={() => confirmOrder("PAYMENT")}>
                  Reject Payment
                </Button>
                <Button onClick={() => confirmOrder("PROCESSING")}>
                  Process Order
                </Button>
              </Flex>
            </Flex>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
