import {
  Box,
  Button,
  Center,
  Flex,
  FormControl,
  FormErrorMessage,
  Icon,
  Input,
  Text,
} from "@chakra-ui/react";
import { InputGroup, InputRightElement, useToast } from "@chakra-ui/react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import Footer from "../website/footer";
import { api } from "../../api/api";
import { EmailIcon } from "@chakra-ui/icons";
import { TbAlertCircleFilled } from "react-icons/tb";
import Navbar from "../website/navbar";

export default function ForgotPassword() {
  const toast = useToast({ duration: 3000, isClosable: true, position: "top" });
  const [isLoading, setIsLoading] = useState(false);
  const [formField, setFormField] = useState("");

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: Yup.object().shape({
      email: Yup.string()
        .email(
          "* email is invalid. Make sure it's written like example@email.com"
        )
        .required("* Email is required"),
    }),
    onSubmit: async () => {
      try {
        const email = formik.values.email;
        const res = await api().get("/auth/generate-token/email", {
          params: { email },
        });
        toast({
          title: res.data.message,
          status: "success",
        });
      } catch (err) {
        toast({
          title: err?.response?.data,
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

  return (
    <Center flexDir={"column"}>
      <Navbar />
      <Center h={"100vh"} maxH={"800px"}>
        <Flex
          flexDir={"column"}
          gap={4}
          p={2}
          textAlign={"center"}
          border={"2px"}
          m={2}
        >
          <Box fontSize={"25px"}>Forgot Pasword</Box>
          <Box color={"gray"} fontSize={"10px"}>
            Enter your email to receive instructions on how to reset your
            password.
          </Box>

          <FormControl isInvalid={formField === "email" && formik.errors.email}>
            <Box
              className={`inputbox ${
                formik.values.email ? "input-has-value" : ""
              }`}
            >
              <InputGroup>
                <InputRightElement>
                  <Icon as={EmailIcon} />
                </InputRightElement>
                <Input
                  id="email"
                  value={formik.values.email}
                  onChange={inputHandler}
                />
                <label for="">Email</label>
              </InputGroup>
              <FormErrorMessage>
                <Icon as={TbAlertCircleFilled} w="16px" h="16px" />
                <Text fontSize={10}>{formik.errors.email}</Text>
              </FormErrorMessage>
            </Box>
          </FormControl>

          <Button
            id="button"
            isDisabled={!formik.values.email}
            isLoading={isLoading}
            onClick={() => {
              setIsLoading(true);
              setTimeout(() => {
                formik.handleSubmit();
                setIsLoading(false);
              }, 2000);
            }}
          >
            Reset
          </Button>
        </Flex>
      </Center>
      <Footer />
    </Center>
  );
}
