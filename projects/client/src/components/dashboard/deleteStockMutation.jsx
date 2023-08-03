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
import React, { useState, useEffect } from "react";
import { api } from "../../api/api";

export default function DeleteStockMutation(props) {
  const [isLoading, setIsLoading] = useState(false);
  const [stockMutation, setStockMutation] = useState({});
  const cancelRef = React.useRef();
  const toast = useToast();

  function clearData() {
    props.setId(null);
    props.onClose();
  }
  useEffect(() => {
    if (props.id) {
      fetch();
    }
  }, [props.id]);

  async function fetch() {
    const response = await api.get(`/stockMutations/${props.id}`);
    setStockMutation(response.data);
  }

  const deleteStockMutation = async () => {
    try {
      const res = await api.delete("/stockMutations/" + props.id);
      toast({
        title: res.data.message,
        status: "success",
        position: "top",
      });
      props.setShown({ page: 1 });
      props.fetch();
      clearData();
    } catch (err) {
      toast({
        title: `${err.response.data.message}`,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };

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

          <AlertDialogBody>
            Are you sure you want to delete stock MUT/
            {stockMutation.mutation_code &&
              JSON.parse(stockMutation.mutation_code).MUT}
            ?
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={clearData}>
              No
            </Button>
            <Button
              isLoading={isLoading}
              onClick={() => {
                setIsLoading(true);
                setTimeout(() => {
                  setIsLoading(false);
                  deleteStockMutation();
                }, 2000);
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
