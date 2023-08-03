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
import { FaRegTrashAlt } from "react-icons/fa";

export default function DeleteProductAlert(props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { type } = props;
  const cancelRef = React.useRef();

  return (
    <>
      {type === 1 ? (
        <FaRegTrashAlt
          onClick={onOpen}
          className="md:mt-4 md:self-end text-slate-800 hover:text-slate-600 active:text-slate-900"
        />
      ) : (
        <button
          onClick={onOpen}
          className="cursor-pointer rounded-l bg-gray-100 py-1 px-3.5 duration-100 hover:bg-red-500 hover:text-blue-50"
        >
          {" "}
          Delete{" "}
        </button>
      )}

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
                props.func(props.id);
                onClose();
              }}
              colorScheme="red"
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
