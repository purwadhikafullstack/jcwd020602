import { ModalHeader, ModalOverlay, ModalContent } from "@chakra-ui/react";
import { ModalFooter, ModalBody, ModalCloseButton } from "@chakra-ui/react";
import { Button, Box, Input, useToast, Select, Modal } from "@chakra-ui/react";
import { useState } from "react";
import { api } from "../../api/api";
import { useFetchSubcategory } from "../../hooks/useFetchCategory";

export function AddCategory(props) {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [selectedFile, setSelectedFile] = useState(false);

  const addCategory = async () => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("category", selectedFile);

    try {
      const res = await api.post("/categories", formData);
      toast({
        title: res.data.message,
        status: "success",
        position: "top",
      });
      props.fetch();
      props.onClose();
    } catch (err) {
      toast({
        title: err.response.data,
        status: "error",
        position: "top",
      });
    }
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

            <input accept="image" onChange={handleFile} type="file" />
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

  const addSub = async () => {
    try {
      const res = await api.post("/subcategories", { name, category_id });
      toast({
        title: res.data.message,
        status: "success",
        position: "top",
      });
      props.fetch();
      fetch();
      props.onClose();
    } catch (err) {
      toast({
        title: err.response.data,
        status: "success",
        position: "top",
      });
    }
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

export function AddBrand(props) {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);

  const addBrand = async () => {
    const formData = new FormData();
    formData.append("name", name);
    for (const files of selectedFiles) {
      formData.append("brand", files);
    }

    try {
      const res = await api.post("/brands", formData);
      toast({
        title: res.data.message,
        status: "success",
        position: "top",
      });
      props.fetch();
      clearB();
    } catch (err) {
      console.log(err.response.data);
    }
  };

  const handleFile = (event) => {
    const files = event.target.files;
    if (!selectedFiles) {
      setSelectedFiles(files);
    } else {
      setSelectedFiles((prev) => [...prev, ...files]);
    }
  };

  const clearB = () => {
    setSelectedFiles([]);
    setName("");
    props.onClose();
  };
  return (
    <>
      <Modal isOpen={props.isOpen} onClose={clearB}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Category</ModalHeader>
          <ModalCloseButton />
          <ModalBody display={"flex"} gap={2} flexDir={"column"}>
            <Box>
              Name:
              <Input id="name" onChange={(e) => setName(e.target.value)} />
            </Box>
            <Box>
              Logo:
              <br />
              <input
                accept="image"
                onChange={handleFile}
                type="file"
                name="logo_img"
              />
            </Box>
            <Box>
              Image:
              <br />
              <input
                accept="image"
                onChange={handleFile}
                type="file"
                name="brnad_img"
              />
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
                  addBrand();
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
