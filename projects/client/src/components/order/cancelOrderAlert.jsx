import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  useDisclosure,
} from "@chakra-ui/react";
import React from "react";

export default function CancelOrderAlert(props) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const cancelRef = React.useRef();

  return (
    <>
      <button
        onClick={onOpen}
        className="cursor-pointer rounded-l bg-gray-100 py-1 px-3.5 duration-100 hover:bg-red-500 hover:text-blue-50 font-size:"
        style={{ fontSize: "14px" }}
      >
        {" "}
        Cancel Order{" "}
      </button>

      <AlertDialog
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isOpen={isOpen}
        isCentered
      >
        <AlertDialogOverlay />

        <AlertDialogContent>
          <AlertDialogHeader>Cancel Order?</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>
            Are you sure you want to cancel this order?
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              Close
            </Button>
            <Button
              onClick={() => {
                props.cancelOrder(props.id);
                onClose();
              }}
              colorScheme="red"
              bgColor={"black"}
              ml={3}
            >
              Cancel Order
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
