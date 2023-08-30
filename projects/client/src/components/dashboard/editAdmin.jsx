import { ModalContent, ModalHeader } from "@chakra-ui/react";
import { ModalOverlay, Box, Flex } from "@chakra-ui/react";
import { ModalFooter, ModalBody, ModalCloseButton } from "@chakra-ui/react";
import { Button, useToast, Input, FormControl, Icon } from "@chakra-ui/react";
import { Center, Avatar, Modal, FormErrorMessage } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { api } from "../../api/api";
import { useFormik } from "formik";
import * as Yup from "yup";
import { TbAlertCircleFilled } from "react-icons/tb";

export default function EditAdmin(props) {
  const toast = useToast({ duration: 3000, isClosable: true, position: "top" });
  const [isLoading, setIsLoading] = useState(false);
  const fileRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState();
  const [image, setImage] = useState();
  const formik = useFormik({
    initialValues: {},
    validationSchema: Yup.object().shape({
      name: Yup.string().required("required"),
      phone: Yup.string()
        .min(10, "min 10 digits")
        .max(12, "max 12 digits")
        .matches(/^((0)|(\+62))/, "Must start with 0 ")
        .required("required"),
      email: Yup.string().email().required(),
    }),
    onSubmit: async () => {
      const formData = new FormData();
      formData.append("name", formik.values.name);
      formData.append("phone", formik.values.phone);
      formData.append("email", formik.values.email);

      if (selectedFile) {
        formData.append("avatar", selectedFile);
      }

      try {
        const response = await api().patch("/auth/editAdmin", formData);
        toast({
          title: response.data.message,
          status: "success",
        });
        props.fetch();
        clearAdmin();
      } catch (err) {
        clearAdmin();
      }
    },
  });

  useEffect(() => {
    if (props.id) {
      fetchAdminbyId();
    }
  }, [props.id]);

  function inputHandler(e) {
    const { value, id } = e.target;
    formik.setFieldValue(id, value);
  }

  const fetchAdminbyId = async () => {
    const res = await api().get("/auth/" + props.id);
    formik.setValues(res.data);
    setImage(res.data.avatar_url);
  };

  const handleFile = (event) => {
    setSelectedFile(event.target.files[0]);
    setImage(URL.createObjectURL(event.target.files[0]));
  };

  const inputan = [
    { id: "name", type: "text" },
    { id: "email", type: "text" },
    { id: "phone", type: "number" },
  ];

  const clearAdmin = () => {
    formik.resetForm();
    setSelectedFile(null);
    setImage(null);
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
        <ModalContent mx={2}>
          <ModalHeader>edit Admin</ModalHeader>
          <ModalCloseButton />
          <ModalBody display={"flex"} gap={4} flexDir={"column"}>
            <Center>
              <Avatar
                size={"lg"}
                src={
                  !selectedFile
                    ? `${process.env.REACT_APP_API_BASE_URL}/${image}`
                    : image
                }
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
              <FormControl key={val.id}>
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
                    {formik.errors[val.id] ? (
                      <Flex p={1} align={"center"} color={"red"}>
                        <Box>
                          <Icon as={TbAlertCircleFilled} />
                        </Box>
                        <Box fontSize={10}>{formik.errors[val.id]}</Box>
                      </Flex>
                    ) : null}
                  </Box>
                </Box>
              </FormControl>
            ))}
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
