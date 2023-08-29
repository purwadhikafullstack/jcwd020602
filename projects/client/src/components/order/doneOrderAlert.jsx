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

export default function DoneOrderAlert(props) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const doneRef = React.useRef();

  return (
    <>
      <button
        onClick={onOpen}
        className="cursor-pointer rounded-l bg-gray-100 py-1 px-3.5 duration-100 hover:bg-red-500 hover:text-blue-50 font-size:"
        style={{ fontSize: "14px" }}
      >
        {" "}
        Done Order{" "}
      </button>

      <AlertDialog
        leastDestructiveRef={doneRef}
        onClose={onClose}
        isOpen={isOpen}
        isCentered
      >
        <AlertDialogOverlay />

        <AlertDialogContent>
          <AlertDialogHeader>Done Order?</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>
            Are you sure you want to complete this order?
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={doneRef} onClick={onClose}>
              Close
            </Button>
            <Button
              onClick={() => {
                props.doneOrder(props.id);
                onClose();
              }}
              colorScheme="red"
              bgColor={"black"}
              ml={3}
            >
              Order Done
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
