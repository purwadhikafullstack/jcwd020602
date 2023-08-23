import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { Button, Input, useToast, Box, Image } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { api } from "../../api/api";

export function EditCategory(props) {
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
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
        position: "top",
      });
      props.fetch();
      clearS();
    } catch (err) {
      console.log(err.response.data);
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
      <Modal isOpen={props.isOpen} onClose={clearS} closeOnOverlayClick={false}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader p={2}>Edit Category</ModalHeader>
          <ModalCloseButton />
          <ModalBody display={"flex"} flexDir={"column"} gap={2}>
            <Box>
              name:{" "}
              <Input
                id="name"
                type="text"
                onChange={inputhandler}
                defaultValue={category?.name}
              />
            </Box>
            <Box>
              Image:
              <Input
                accept="image"
                type="file"
                paddingTop={"4px"}
                onChange={handleFile}
              />
              <Image src={image} />
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
      props.onClose();
    } catch (err) {
      console.log(err.response.data);
    }
  };

  const clearS = () => {
    setName({});
    props.setId(null);
  };
  return (
    <>
      <Modal
        isOpen={props.isOpen}
        onClose={() => {
          props.onClose();
          clearS();
        }}
        closeOnOverlayClick={false}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader p={2}>Edit Subcategory</ModalHeader>
          <ModalCloseButton />
          <ModalBody display={"flex"} flexDir={"column"} gap={2}>
            <Box>
              name:{" "}
              <Input
                id="name"
                type="text"
                onChange={(e) => setName(e.target.value)}
                defaultValue={name}
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
