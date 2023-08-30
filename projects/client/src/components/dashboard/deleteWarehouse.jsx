import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogCloseButton,
  Button,
  useToast,
  Flex,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { api } from "../../api/api";

export default function DeleteWarehouse(props) {
  const [isLoading, setIsLoading] = useState(false);
  const cancelRef = React.useRef();
  const toast = useToast();

  const deleteWarehouse = async () => {
    try {
      const res = await api().delete("/warehouses/" + props.id);
      toast({
        title: res.data.message,
        status: "success",
        position: "top",
      });
      props.fetch();
      props.onClose();
    } catch (err) {
      props.onClose();
    }
  };

  return (
    <>
      <AlertDialog
        motionPreset="slideInBottom"
        leastDestructiveRef={cancelRef}
        onClose={props.onClose}
        isOpen={props.isOpen}
        isCentered
      >
        <AlertDialogOverlay />
        <AlertDialogContent mx={2}>
          <AlertDialogHeader>
            <AlertDialogCloseButton />
          </AlertDialogHeader>
          <AlertDialogBody>
            Are you sure you want to delete {props.id}?
          </AlertDialogBody>
          <AlertDialogFooter>
            <Flex w={"100%"} justify={"space-between"}>
              <Button ref={cancelRef} onClick={props.onClose}>
                No
              </Button>
              <Button
                isLoading={isLoading}
                onClick={() => {
                  setIsLoading(true);
                  setTimeout(() => {
                    setIsLoading(false);
                    deleteWarehouse();
                  }, 2000);
                }}
              >
                Yes
              </Button>
            </Flex>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
