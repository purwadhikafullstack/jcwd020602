import { Avatar, FormErrorMessage, InputRightElement } from "@chakra-ui/react";
import { Box, FormControl, Text, useToast } from "@chakra-ui/react";
import { Icon, Input, InputGroup, Center, Flex } from "@chakra-ui/react";
import { useFormik } from "formik";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { TbAlertCircleFilled } from "react-icons/tb";
import { EmailIcon, PhoneIcon } from "@chakra-ui/icons";
import { api } from "../api/api";
import { useSelector } from "react-redux";
import Footer from "../components/website/footer";

export default function ProfilePage() {
  const toast = useToast();
  const nav = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formField, setFormField] = useState("");
  const [image, setImage] = useState();
  const fileRef = useRef(null);
  const [selectedFile, setSelectedfile] = useState();
  const userSelector = useSelector((state) => state.auth);
  console.log(image);
  const formik = useFormik({
    initialValues: {
      ...userSelector,
    },
    validationSchema: Yup.object().shape({
      email: Yup.string()
        .email(
          "* email is invalid. Make sure it's written like example@email.com"
        )
        .required("* Email is required"),
      name: Yup.string().required("Name is required"),
      phone: Yup.string().required("phone is required"),
    }),
    onSubmit: async () => {
      try {
        const res = await api.post("/auth/register", formik.values);
        toast({
          title: res.data.message,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        nav("/auth");
      } catch (err) {
        toast({
          title: err?.response?.data,
          status: "error",
          duration: 3000,
          isClosable: true,
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
    setSelectedfile(event.target.files[0]);
    setImage(URL.createObjectURL(event.target.files[0]));
  };
  return (
    <Center flexDir={"column"}>
      <Flex w={"100%"} maxW={"1535px"} zIndex={1} p={"1rem 1rem"} mt={"100px"}>
        <Flex gap={5} flexDir={"column"} p={2} border={"2px"} w={"100%"}>
          <Text fontSize={"30px"} fontWeight={"bold"}>
            YOUR DETAILS
          </Text>
          <Center>
            <Avatar
              size={"xl"}
              src={
                image
                  ? image
                  : `${process.env.REACT_APP_API_BASE_URL}/${userSelector.avatar_url}`
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
          <Box className="form-profile">
            {/* name */}
            <FormControl isInvalid={formField === "name" && formik.errors.name}>
              <Box
                className={`inputbox ${
                  formik.values.name ? "input-has-value" : ""
                }`}
              >
                <InputGroup size="md">
                  <Input
                    id="name"
                    value={formik.values.name}
                    onChange={inputHandler}
                  />
                  <label>Name</label>
                </InputGroup>
                <Box>
                  <FormErrorMessage>
                    <Center>
                      <Icon as={TbAlertCircleFilled} w="16px" h="16px" />
                    </Center>
                    <Text fontSize={10}>{formik.errors.name}</Text>
                  </FormErrorMessage>
                </Box>
              </Box>
            </FormControl>
            {/* email */}
            <FormControl
              isInvalid={formField === "email" && formik.errors.email}
            >
              <Box
                className={`inputbox ${
                  formik.values.email ? "input-has-value" : ""
                }`}
              >
                <InputGroup size="md">
                  <Input
                    id="email"
                    value={formik.values.email}
                    onChange={inputHandler}
                  />
                  <label>Email</label>
                  <InputRightElement width="4rem">
                    <Icon as={EmailIcon} />
                  </InputRightElement>
                </InputGroup>
                <Box>
                  <FormErrorMessage>
                    <Center>
                      <Icon as={TbAlertCircleFilled} w="16px" h="16px" />
                    </Center>
                    <Text fontSize={10}>{formik.errors.email}</Text>
                  </FormErrorMessage>
                </Box>
              </Box>
            </FormControl>

            {/* phone */}
          </Box>
          <Box className="form-profile">
            <FormControl
              isInvalid={formField === "phone" && formik.errors.phone}
            >
              <Box
                className={`inputbox ${
                  formik.values.phone ? "input-has-value" : ""
                }`}
              >
                <InputGroup size="md">
                  <Input
                    id="phone"
                    type="number"
                    value={formik.values.phone}
                    onChange={inputHandler}
                  />
                  <label>Phone</label>
                  <InputRightElement width="4rem">
                    <Icon as={PhoneIcon} />
                  </InputRightElement>
                </InputGroup>
                <Box>
                  <FormErrorMessage>
                    <Center>
                      <Icon as={TbAlertCircleFilled} w="16px" h="16px" />
                    </Center>
                    <Text fontSize={10}>{formik.errors.phone}</Text>
                  </FormErrorMessage>
                </Box>
              </Box>
            </FormControl>
          </Box>
        </Flex>
      </Flex>
      <Footer />
    </Center>
  );
}
