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
  Spinner,
  Center,
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import { api } from "../../api/api";
import { useSelector } from "react-redux";

export default function ConfirmStockMutation(props) {
  const userSelector = useSelector((state) => state.auth);
  const [isLoadingButton, setIsLoadingButton] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [stockMutation, setStockMutation] = useState({});
  const cancelRef = React.useRef();
  const toast = useToast();
  function clearData() {
    props.setStatus(null);
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

  const confirmStockMutation = async () => {
    setIsLoadingButton(true);
    try {
      const res = await api().patch("/stockMutations/confirm/" + props.id, {
        status: props.status,
      });
      toast({
        title: res.data.message,
        status: "success",
        position: "top",
      });
      props.fetch();
    } catch (err) {
      toast({
        title: `${err.response.data}`,
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
              {`${userSelector.role == "SUPERADMIN" ? "Super Admin" : "Admin"}
            ${userSelector.name} want to confirm stock 
            ${stockMutation.mutation_code} status as ${
                props.status
              }. is this true?`}
            </AlertDialogBody>
          )}
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={clearData}>
              No
            </Button>
            <Button
              isLoading={isLoadingButton}
              onClick={() => {
                confirmStockMutation();
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
