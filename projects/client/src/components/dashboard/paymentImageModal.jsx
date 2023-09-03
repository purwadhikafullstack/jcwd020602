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
import { useEffect, useState } from "react";

export default function PaymentImageModal(props) {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingButton, setIsLoadingButton] = useState(false);
  const toast = useToast();
  async function confirmOrder(status) {
    setIsLoadingButton(true);
    try {
      const res = await api().patch(`/orders/admin/${props?.order?.id}`, {
        status,
      });
      props.fetch();
      toast({
        title: res.data.message,
        status: "success",
        isClosable: true,
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: error.response.data.message,
        status: "error",
        isClosable: true,
        duration: 3000,
      });
    } finally {
      setIsLoadingButton(false);
      clearData();
    }
  }
  useEffect(() => {
    if (props?.order?.payment_proof) {
      setIsLoading(false);
    }
  }, [props.order]);
  function clearData() {
    props.setOrder(null);
    props.onClose();
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
              <Button
                isLoading={isLoadingButton}
                onClick={() => confirmOrder("CANCELED")}
              >
                Cancel Order
              </Button>
              <Flex gap={"5px"} w={"50%"}>
                {props?.order?.status == "CONFIRM_PAYMENT" ? (
                  <Button
                    isLoading={isLoadingButton}
                    onClick={() => confirmOrder("PAYMENT")}
                  >
                    Reject Payment
                  </Button>
                ) : null}
                <Button
                  isLoading={isLoadingButton}
                  onClick={() => {
                    if (props?.order?.status == "CONFIRM_PAYMENT") {
                      confirmOrder("PROCESSING");
                    } else if (props?.order?.status == "PROCESSING") {
                      confirmOrder("DELIVERY");
                    }
                  }}
                >
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
