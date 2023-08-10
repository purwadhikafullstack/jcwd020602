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
import { useSelector } from "react-redux";

export default function ConfirmStockMutation(props) {
  const userSelector = useSelector((state) => state.auth);
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
      fetch();
    }
  }, [props.id]);

  async function fetch() {
    const response = await api.get(`/stockMutations/${props.id}`);
    setStockMutation(response?.data?.stockMutation);
  }

  const confirmStockMutation = async () => {
    try {
      const res = await api.patch("/stockMutations/confirm/" + props.id, {
        status: props.status,
      });
      toast({
        title: res.data.message,
        status: "success",
        position: "top",
      });
      props.fetch();
      clearData();
    } catch (err) {
      toast({
        title: `${err.response.data}`,
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
            {`${userSelector.role == "SUPERADMIN" ? "Super Admin" : "Admin"}
            ${userSelector.name} want to confirm stock MUT/
            ${
              stockMutation.mutation_code &&
              JSON.parse(stockMutation.mutation_code).MUT
            } status as ${props.status}. is this true?`}
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
                  confirmStockMutation();
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
