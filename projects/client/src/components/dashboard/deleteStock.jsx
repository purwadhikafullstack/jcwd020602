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
  Center,
  Spinner,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { api } from "../../api/api";
import { useFetchStockId } from "../../hooks/useFetchStock";

export default function DeleteStock(props) {
  const [isLoadingButton, setIsLoadingButton] = useState(false);
  const { stock, setStock, isLoading } = useFetchStockId(props.id);
  const cancelRef = React.useRef();
  const toast = useToast();
  const deleteStock = async () => {
    try {
      const res = await api().delete("/stocks/" + props.id);
      toast({
        title: res.data.message,
        status: "success",
        position: "top",
      });
      props.setShown({ page: 1 });
    } catch (err) {
      toast({
        title: `${err?.response?.data?.message || err?.response?.data}`,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    } finally {
      setIsLoadingButton(false);
      clearData();
    }
  };
  function clearData() {
    props.setId(null);
    setStock({});
    props.onClose();
  }
  return (
    <>
      <AlertDialog
        motionPreset="slideInBottom"
        leastDestructiveRef={cancelRef}
        onClose={clearData}
        isOpen={props.isOpen}
        isCentered
      >
        <AlertDialogOverlay />
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogCloseButton />
          </AlertDialogHeader>

          {isLoading ? (
            <Center w={"100%"} h={"100%"}>
              <Spinner />
            </Center>
          ) : (
            <AlertDialogBody>
              {`Are you sure you want to delete stock ${stock?.Sho?.name}-${stock?.shoeSize?.size}-${stock?.Sho?.brand?.name}: ${stock?.stock} from warehouse ${stock?.warehouse?.name}?`}
            </AlertDialogBody>
          )}
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={props.onClose}>
              No
            </Button>
            <Button
              isLoading={isLoadingButton}
              onClick={() => {
                setIsLoadingButton(true);
                deleteStock();
              }}
            >
              Yes
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
