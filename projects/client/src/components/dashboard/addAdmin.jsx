import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { Button, Box, useToast, Input, Center, Avatar } from "@chakra-ui/react";
import { useRef, useState } from "react";
import { api } from "../../api/api";

export default function AddAdmin(props) {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(false);
  const fileRef = useRef(null);
  const [image, setImage] = useState(null);
  const [admin, setAdmin] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
  });

  const inputhandler = (e) => {
    const { id, value } = e.target;
    const temp = { ...admin };
    temp[id] = value;
    setAdmin(temp);
  };

  const addAdmin = async () => {
    const formData = new FormData();
    formData.append("name", admin.name);
    formData.append("phone", admin.phone);
    formData.append("email", admin.email);
    formData.append("password", admin.password);
    formData.append("avatar", selectedFile);

    try {
      const response = await api.post("/auth/admin", formData);
      toast({
        title: response.data.message,
        status: "success",
        position: "top",
      });
      props.fetch();
      props.onClose();
    } catch (err) {
      console.log(err.response.data);
    }
  };

  const handleFile = (event) => {
    setSelectedFile(event.target.files[0]);
    setImage(URL.createObjectURL(event.target.files[0]));
  };
  return (
    <>
      <Modal isOpen={props.isOpen} onClose={props.onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Admin</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Center>
              <Avatar
                size={"lg"}
                src={image}
                onClick={() => {
                  fileRef.current.click();
                }}
              />
              <Input
                accept="image/png, image/jpeg"
                onChange={handleFile}
                ref={fileRef}
                type="file"
                display="none"
              />
            </Center>
            <Box>
              Name:
              <Input id="name" onChange={inputhandler} />
            </Box>
            <Box>
              Email:
              <Input id="email" onChange={inputhandler} />
            </Box>
            <Box>
              Phone:
              <Input id="phone" onChange={inputhandler} />
            </Box>
            <Box>
              Password:
              <Input id="password" onChange={inputhandler} />
            </Box>
          </ModalBody>

          <ModalFooter>
            <Button
              isLoading={isLoading}
              onClick={() => {
                setIsLoading(true);
                setTimeout(() => {
                  setIsLoading(false);
                  addAdmin();
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
