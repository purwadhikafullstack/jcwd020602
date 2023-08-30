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
import React, { useState, useEffect } from "react";
import { api } from "../../api/api";

export default function DeleteStockMutation(props) {
  const [isLoadingButton, setIsLoadingButton] = useState(false);
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
      setIsLoading(true);
      fetch();
    }
  }, [props.id]);
  useEffect(() => {
    setIsLoading(false);
  }, [stockMutation]);
  async function fetch() {
    try {
      const response = await api().get(`/stockMutations/${props.id}`);
      setStockMutation(response?.data?.stockMutation);
    } catch (error) {
      setStockMutation({});
    }
  }

  const deleteStockMutation = async () => {
    setIsLoadingButton(true);
    try {
      const res = await api().delete("/stockMutations/" + props.id);
      toast({
        title: res.data.message,
        status: "success",
        position: "top",
      });
      props.setShown({ page: 1 });
    } catch (err) {
      toast({
        title: `${err.response.data.message}`,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    } finally {
      setIsLoadingButton(false);
      clearData();
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

          {isLoading ? (
            <Center w={"100%"} h={"100%"}>
              <Spinner />
            </Center>
          ) : (
            <AlertDialogBody>
              {`Are you sure you want to delete stock ${stockMutation.mutation_code}?`}
            </AlertDialogBody>
          )}
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={clearData}>
              No
            </Button>
            <Button
              isLoading={isLoadingButton}
              onClick={() => {
                deleteStockMutation();
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
