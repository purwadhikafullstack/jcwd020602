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

export function DeleteCategory(props) {
  const [isLoading, setIsLoading] = useState(false);
  const cancelRef = React.useRef();
  const toast = useToast();

  const deleteCategory = async () => {
    try {
      const res = await api().delete("/categories/" + props.id);
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
          <AlertDialogFooter display={"flex"} justifyContent={"space-between"}>
            <Button ref={cancelRef} onClick={props.onClose}>
              No
            </Button>
            <Button
              isLoading={isLoading}
              onClick={() => {
                setIsLoading(true);
                setTimeout(() => {
                  setIsLoading(false);
                  deleteCategory();
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

export function DeleteSubcategory(props) {
  const [isLoading, setIsLoading] = useState(false);
  const cancelRef = React.useRef();
  const toast = useToast();

  const deleteSub = async () => {
    try {
      const res = await api().delete("/subcategories/" + props.id);
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
          <AlertDialogFooter display={"flex"} justifyContent={"space-between"}>
            <Button ref={cancelRef} onClick={props.onClose}>
              No
            </Button>
            <Button
              isLoading={isLoading}
              onClick={() => {
                setIsLoading(true);
                setTimeout(() => {
                  setIsLoading(false);
                  deleteSub();
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

export function DeleteBrand(props) {
  const [isLoading, setIsLoading] = useState(false);
  const cancelRef = React.useRef();
  const toast = useToast();

  const deleteSub = async () => {
    try {
      const res = await api().delete("/brands/" + props.id);
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
          <AlertDialogFooter display={"flex"} justifyContent={"space-between"}>
            <Button ref={cancelRef} onClick={props.onClose}>
              No
            </Button>
            <Button
              isLoading={isLoading}
              onClick={() => {
                setIsLoading(true);
                setTimeout(() => {
                  setIsLoading(false);
                  deleteSub();
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
