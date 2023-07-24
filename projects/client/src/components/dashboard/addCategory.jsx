import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Box,
  Input,
  useToast,
  Select,
} from "@chakra-ui/react";
import { useState } from "react";
import { api } from "../../api/api";
import { useFetchSubcategory } from "../../hooks/useFetchCategory";

export function AddCategory(props) {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [selectedFile, setSelectedFile] = useState(false);

  const addCategory = () => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("category", selectedFile);

    api
      .post("/categories", formData)
      .then((res) => {
        toast({
          title: res.data.message,
          status: "success",
          position: "top",
        });
        props.fetch();
        props.onClose();
      })
      .catch((err) => console.log(err));
  };
  const handleFile = (event) => {
    setSelectedFile(event.target.files[0]);
  };
  return (
    <>
      <Modal isOpen={props.isOpen} onClose={props.onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Category</ModalHeader>
          <ModalCloseButton />
          <ModalBody display={"flex"} gap={2} flexDir={"column"}>
            <Box>
              Name:
              <Input id="name" onChange={(e) => setName(e.target.value)} />
            </Box>

            <input
              accept="image/png, image/jpeg"
              onChange={handleFile}
              type="file"
            />
          </ModalBody>

          <ModalFooter>
            <Button
              isLoading={isLoading}
              colorScheme="blue"
              mr={3}
              onClick={() => {
                setIsLoading(true);
                setTimeout(() => {
                  setIsLoading(false);
                  addCategory();
                }, 2000);
              }}
            >
              Confirm
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export function AddSubCategory(props) {
  const [name, setName] = useState("");
  const category_id = props.id;
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const { fetch } = useFetchSubcategory();
  const addSub = () => {
    api
      .post("/subcategories", { name, category_id })
      .then((res) => {
        toast({
          title: res.data.message,
          status: "success",
          position: "top",
        });
        props.fetch();
        fetch();
        props.onClose();
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      <Modal isOpen={props.isOpen} onClose={props.onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Subcategory</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box>
              Name:
              <Input id="name" onChange={(e) => setName(e.target.value)} />
            </Box>
          </ModalBody>

          <ModalFooter>
            <Button
              isLoading={isLoading}
              colorScheme="blue"
              mr={3}
              onClick={() => {
                setIsLoading(true);
                setTimeout(() => {
                  setIsLoading(false);
                  addSub();
                }, 2000);
              }}
            >
              Confirm
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
