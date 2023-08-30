import { Modal, ModalOverlay, ModalContent } from "@chakra-ui/react";
import { FormControl, FormErrorMessage, ModalHeader } from "@chakra-ui/react";
import { ModalFooter, ModalBody, ModalCloseButton } from "@chakra-ui/react";
import { Icon, InputGroup, InputRightElement } from "@chakra-ui/react";
import { Button, Box, useToast, Input, Center, Avatar } from "@chakra-ui/react";
import { useRef, useState } from "react";
import { api } from "../../api/api";
import { useFormik } from "formik";
import YupPassword from "yup-password";
import * as Yup from "yup";
import { TbAlertCircleFilled } from "react-icons/tb";
import { ViewOffIcon, ViewIcon } from "@chakra-ui/icons";

export default function AddAdmin(props) {
  YupPassword(Yup);
  const toast = useToast({ duration: 3000, isClosable: true, position: "top" });
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(false);
  const [formField, setFormField] = useState("");
  const fileRef = useRef(null);
  const [image, setImage] = useState(null);
  const formik = useFormik({
    initialValues: { name: "", phone: "", email: "", password: "" },
    validationSchema: Yup.object().shape({
      name: Yup.string().required("required"),
      phone: Yup.string()
        .min(10, "min 10 digits")
        .max(12, "max 12 digits")
        .matches(/^((0)|(\+62))/, "Must start with 0 ")
        .required("required"),
      email: Yup.string().email().required(),
      password: Yup.string()
        .min(8, "at least 8 characters")
        .minUppercase(1, "at least 1 capital letter")
        .minLowercase(1, "at least 1 lower letter")
        .minNumbers(1, "at least 1 number")
        .required("Required"),
    }),
    onSubmit: async () => {
      try {
        const formData = new FormData();
        formData.append("name", formik.values.name);
        formData.append("phone", formik.values.phone);
        formData.append("email", formik.values.email);
        formData.append("password", formik.values.password);
        formData.append("avatar", selectedFile);
        const response = await api().post("/auth/admin", formData);
        toast({
          title: response.data.message,
          status: "success",
        });
        props.fetch();
        clearData();
      } catch (err) {
        toast({
          title: err?.response?.data?.message,
          status: "error",
        });
      }
    },
  });

  function inputHandler(e) {
    const { value, id } = e.target;
    formik.setFieldValue(id, value);
    setFormField(id);
  }

  const handleFile = (event) => {
    setSelectedFile(event.target.files[0]);
    setImage(URL.createObjectURL(event.target.files[0]));
  };

  const inputan = [
    { id: "name", type: "text" },
    { id: "email", type: "text" },
    { id: "phone", type: "number" },
  ];

  const clearData = () => {
    formik.resetForm();
    setSelectedFile(null);
    setImage(null);
    props.onClose();
  };

  return (
    <>
      <Modal isOpen={props.isOpen} onClose={clearData}>
        <ModalOverlay />
        <ModalContent mx={2}>
          <ModalHeader>Add Admin</ModalHeader>
          <ModalCloseButton />
          <ModalBody display={"flex"} gap={4} flexDir={"column"}>
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
            {inputan.map((val) => (
              <FormControl
                key={val.id}
                isInvalid={formField === val.id && formik.errors[val.id]}
              >
                <Box
                  className={`inputbox ${
                    formik.values[val.id] ? "input-has-value" : ""
                  }`}
                >
                  <Input
                    id={val.id}
                    name={val.id}
                    value={formik.values[val.id]}
                    type={val.type}
                    onChange={inputHandler}
                  />
                  <label>{val.id}</label>
                  <Box>
                    <FormErrorMessage>
                      <Icon as={TbAlertCircleFilled} w="16px" h="16px" />
                      <Box fontSize={10}>{formik.errors[val.id]}</Box>
                    </FormErrorMessage>
                  </Box>
                </Box>
              </FormControl>
            ))}
            <FormControl
              isInvalid={formField === "password" && formik.errors.password}
            >
              <Box
                className={`inputbox ${
                  formik.values.password ? "input-has-value" : ""
                }`}
              >
                <InputGroup size="md">
                  <Input
                    id="password"
                    value={formik.values.password}
                    onChange={inputHandler}
                    type={show ? "text" : "password"}
                  />
                  <label>Password</label>
                  <InputRightElement width="4rem">
                    <Button h="1.75rem" size="sm" onClick={handleClick}>
                      {show ? <ViewOffIcon /> : <ViewIcon />}
                    </Button>
                  </InputRightElement>
                </InputGroup>
                <Box>
                  <FormErrorMessage>
                    <Icon as={TbAlertCircleFilled} w="16px" h="16px" />
                    <Box fontSize={10}>{formik.errors.password}</Box>
                  </FormErrorMessage>
                </Box>
              </Box>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button
              isLoading={isLoading}
              onClick={() => {
                setIsLoading(true);
                setTimeout(() => {
                  setIsLoading(false);
                  formik.handleSubmit();
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
