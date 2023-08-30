import { ModalOverlay, ModalContent, ModalCloseButton } from "@chakra-ui/react";
import { ModalHeader, ModalFooter, ModalBody, Modal } from "@chakra-ui/react";
import { Button, Input, useToast, Box, Image } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { api } from "../../api/api";

export function EditCategory(props) {
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast({ position: "top", duration: 3000, isClosable: true });
  const [category, setCategory] = useState();
  const [selectedFile, setSelectedFile] = useState();
  const [image, setImage] = useState();

  useEffect(() => {
    if (props.id) {
      fetchCatId();
    }
  }, [props.id]);

  const fetchCatId = async () => {
    const res = await api().get("/categories/" + props.id);
    setCategory(res.data);
    setImage(res.data.category_img);
  };

  const updateCategory = async () => {
    const formData = new FormData();
    formData.append("name", category.name);
    if (selectedFile) {
      formData.append("category", selectedFile);
    }
    try {
      const res = await api().patch("/categories/" + props.id, formData);
      toast({
        title: res.data.message,
        status: "success",
      });
      props.fetch();
      clearS();
    } catch (err) {
      toast({
        title: err?.response?.data?.message,
        status: "error",
      });
    }
  };

  const clearS = () => {
    setCategory({});
    props.setId(null);
    setSelectedFile(null);
    props.onClose();
  };

  const handleFile = (event) => {
    setSelectedFile(event.target.files[0]);
    setImage(URL.createObjectURL(event.target.files[0]));
  };

  const inputhandler = (e) => {
    const { id, value } = e.target;
    const temp = { ...category };
    temp[id] = value;
    setCategory(temp);
  };
  return (
    <>
      <Modal
        isOpen={props.isOpen}
        onClose={clearS}
        closeOnOverlayClick={false}
        scrollBehavior="inside"
      >
        <ModalOverlay />
        <ModalContent mx={2}>
          <ModalHeader p={2}>Edit Category</ModalHeader>
          <ModalCloseButton />
          <ModalBody display={"flex"} flexDir={"column"} gap={2}>
            <Box
              className={`inputbox ${category?.name ? "input-has-value" : ""}`}
            >
              <Input
                id="name"
                defaultValue={category?.name}
                onChange={inputhandler}
              />
              <label>Name</label>
            </Box>
            <Box>
              Image:
              <Input
                accept="image"
                type="file"
                paddingTop={"4px"}
                onChange={handleFile}
              />
              <Image
                src={
                  selectedFile
                    ? image
                    : `${process.env.REACT_APP_API_BASE_URL}/${image}`
                }
              />
            </Box>
          </ModalBody>
          <ModalFooter>
            <Button
              isLoading={isLoading}
              onClick={() => {
                setIsLoading(true);
                setTimeout(() => {
                  setIsLoading(false);
                  updateCategory();
                }, 2000);
              }}
            >
              confirm
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export function EditSubcategory(props) {
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const [name, setName] = useState();

  useEffect(() => {
    if (props.id) {
      fetchSubId();
    }
  }, [props.id]);

  const fetchSubId = async () => {
    const res = await api().get("/subcategories/" + props.id);
    setName(res.data.name);
  };

  const updateSubcategory = async () => {
    try {
      const res = await api().patch("/subcategories/" + props.id, { name });
      toast({
        title: res.data.message,
        status: "success",
        position: "top",
      });
      props.fetch();
      clearS();
    } catch (err) {
      clearS();
    }
  };

  const clearS = () => {
    setName("");
    props.setId(null);
    props.onClose();
  };
  return (
    <>
      <Modal
        isOpen={props.isOpen}
        onClose={clearS}
        closeOnOverlayClick={false}
        isCentered
      >
        <ModalOverlay />
        <ModalContent mx={2}>
          <ModalHeader p={2}>Edit Subcategory</ModalHeader>
          <ModalCloseButton />
          <ModalBody display={"flex"} flexDir={"column"} gap={2}>
            <Box className={`inputbox ${name ? "input-has-value" : ""}`}>
              <Input
                id="name"
                defaultValue={name}
                onChange={(e) => setName(e.target.value)}
              />
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
                  updateSubcategory();
                }, 2000);
              }}
            >
              confirm
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
