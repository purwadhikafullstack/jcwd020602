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
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { api } from "../../api/api";
// ------------------------------------------------------ CLEAR -FAHMI
export default function DeleteAddress(props) {
  const [isLoading, setIsLoading] = useState(false);
  const cancelRef = React.useRef();
  const toast = useToast({ duration: 3000, isClosable: true, position: "top" });
  const [address, setAddress] = useState({});

  useEffect(() => {
    setAddress({ ...props.address });
  }, [props.address]);

  const deleteAddress = async () => {
    setIsLoading(true);
    try {
      const res = await api().delete("/address", { params: { ...address } });
      toast({
        title: res.data.message,
        status: "success",
      });
      setIsLoading(false);
      props.fetch();
      props.onClose();
    } catch (err) {
      toast({
        title: err?.response?.data,
        status: "success",
      });
      setIsLoading(false);
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
            Are you sure you want to delete address {props?.address?.title} ?
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button id="button" isLoading={isLoading} onClick={deleteAddress}>
              Yes
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
