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
      const res = await api().post("/categories", formData);
      toast({
        title: res.data.message,
        status: "success",
        position: "top",
      });
      props.fetch();
      clearData();
    } catch (err) {
      toast({
        title: err?.response?.data,
        status: "error",
        position: "top",
      });
    }
  };
  const handleFile = (event) => {
    setSelectedFile(event.target.files[0]);
  };
  const clearData = () => {
    setName("");
    setSelectedFile(null);
    props.onClose();
  };
  return (
    <>
      <Modal isOpen={props.isOpen} onClose={clearData}>
        <ModalOverlay />
        <ModalContent mx={2}>
          <ModalHeader>Add Category</ModalHeader>
          <ModalCloseButton />
          <ModalBody display={"flex"} gap={2} flexDir={"column"}>
            <Box className={`inputbox ${name ? "input-has-value" : ""}`}>
              <Input id="name" onChange={(e) => setName(e.target.value)} />
              <label>Name</label>
            </Box>

            <input accept="image" onChange={handleFile} type="file" />
          </ModalBody>

          <ModalFooter>
            <Button
              isDisabled={!(name && selectedFile)}
              isLoading={isLoading}
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
      const res = await api().post("/subcategories", { name, category_id });
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
        title: err?.response?.data,
        status: "success",
        position: "top",
      });
    }
  };

  return (
    <>
      <Modal isOpen={props.isOpen} onClose={props.onClose}>
        <ModalOverlay />
        <ModalContent mx={2}>
          <ModalHeader>Add Subcategory</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box className={`inputbox ${name ? "input-has-value" : ""}`}>
              <Input id="name" onChange={(e) => setName(e.target.value)} />
              <label>Name</label>
            </Box>
          </ModalBody>

          <ModalFooter>
            <Button
              isLoading={isLoading}
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
      const res = await api().post("/brands", formData);
      toast({
        title: res.data.message,
        status: "success",
        position: "top",
      });
      props.fetch();
      clearB();
    } catch (err) {
      clearB();
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
      <Modal
        isOpen={props.isOpen}
        onClose={clearB}
        isCentered
        closeOnOverlayClick={false}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Brand</ModalHeader>
          <ModalCloseButton />
          <ModalBody display={"flex"} gap={2} flexDir={"column"}>
            <Box className={`inputbox ${name ? "input-has-value" : ""}`}>
              <Input id="name" onChange={(e) => setName(e.target.value)} />
              <label>Name</label>
            </Box>

            <Box border={"1px"}>
              <Box bg={"black"} color={"white"}>
                Logo:
              </Box>
              <input
                accept="image"
                onChange={handleFile}
                type="file"
                name="logo_img"
              />
            </Box>
            <Box border={"1px"}>
              <Box bg={"black"} color={"white"}>
                Image:
              </Box>
              <input
                accept="image"
                onChange={handleFile}
                type="file"
                name="brand_img"
              />
            </Box>
          </ModalBody>

          <ModalFooter>
            <Button
              isDisabled={
                !(name && selectedFiles[0] && selectedFiles[1]) ? true : false
              }
              isLoading={isLoading}
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
