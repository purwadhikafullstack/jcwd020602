import { ModalOverlay, ModalContent, ModalHeader, Box } from "@chakra-ui/react";
import { ModalFooter, ModalBody, ModalCloseButton } from "@chakra-ui/react";
import { Button, useToast, Input } from "@chakra-ui/react";
import { Center, Avatar, Modal } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { api } from "../../api/api";

export default function EditAdmin(props) {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const fileRef = useRef(null);
  const [admin, setAdmin] = useState({});
  const [selectedFile, setSelectedFile] = useState();
  const [image, setImage] = useState();

  useEffect(() => {
    if (props.id) {
      fetchAdminbyId();
    }
  }, [props.id]);

  const inputhandler = (e) => {
    const { id, value } = e.target;
    const temp = { ...admin };
    temp[id] = value;
    setAdmin(temp);
  };

  const fetchAdminbyId = async () => {
    const res = await api.get("/auth/" + props.id);
    setAdmin(res.data);
    setImage(res.data.avatar_url);
  };

  const editAdmin = async () => {
    const formData = new FormData();
    formData.append("name", admin.name);
    formData.append("phone", admin.phone);
    formData.append("email", admin.email);
    formData.append("password", admin.password);
    formData.append("avatar", !selectedFile ? admin.avatar_url : selectedFile);

    try {
      const response = await api.patch("/auth/admin/" + props.id, formData);
      toast({
        title: response.data.message,
        status: "success",
        position: "top",
      });
      props.fetch();
      clearAdmin();
    } catch (err) {
      console.log(err.response.data);
    }
  };

  const handleFile = (event) => {
    setSelectedFile(event.target.files[0]);
    setImage(URL.createObjectURL(event.target.files[0]));
  };

  const clearAdmin = () => {
    setAdmin({});
    setSelectedFile(null);
    props.setAdminId(null);
    props.onClose();
  };
  return (
    <>
      <Modal
        isOpen={props.isOpen}
        onClose={clearAdmin}
        closeOnOverlayClick={false}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>edit Admin</ModalHeader>
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
              <Input
                id="name"
                onChange={inputhandler}
                defaultValue={admin.name}
              />
            </Box>
            <Box>
              Email:
              <Input
                id="email"
                onChange={inputhandler}
                defaultValue={admin.email}
              />
            </Box>
            <Box>
              Phone:
              <Input
                id="phone"
                onChange={inputhandler}
                defaultValue={admin.phone}
              />
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
                  editAdmin();
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
