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

export default function DeleteProductAlert(props) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const cancelRef = React.useRef();

  return (
    <>
      <button
        onClick={onOpen}
        className="cursor-pointer rounded-l bg-gray-100 py-1 px-3.5 duration-100 hover:bg-red-500 hover:text-blue-50"
      >
        {" "}
        Delete{" "}
      </button>

      <AlertDialog
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isOpen={isOpen}
        isCentered
      >
        <AlertDialogOverlay />

        <AlertDialogContent>
          <AlertDialogHeader>Delete product?</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>
            Are you sure you want to delete this product?
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                props.handleDelete(props.id);
                onClose();
              }}
              colorScheme="red"
              bgColor={"black"}
              ml={3}
            >
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
