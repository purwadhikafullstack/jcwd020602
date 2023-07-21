import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  VStack,
  Text,
  useToast,
  Center,
  InputRightElement,
} from "@chakra-ui/react";
import {
  FaUser,
  FaLock,
  FaEnvelope,
  FaFacebookF,
  FaTwitter,
  FaGoogle,
  FaLinkedinIn,
} from "react-icons/fa";
import { AiOutlineEyeInvisible, AiOutlineEye } from "react-icons/ai";
import axios from "axios";
import { useState } from "react";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import React from "react";
import { api } from "../../api/api";

export default function Verify() {
  const queryParams = new URLSearchParams(window.location.search);
  const email = queryParams.get("email");
  const toast = useToast({ position: "top" });
  const nav = useNavigate();
  const [show, setShow] = React.useState(false);
  const handleClick = () => setShow(!show);
  const [show1, setShow1] = React.useState(false);
  const handleClick1 = () => setShow1(!show1);

  const validationSchema = Yup.object().shape({
    full_name: Yup.string()
      .min(6, "Full name min 6 character")
      .required("Email is required"),
    password: Yup.string()
      .matches(/^(?=.*[A-Z])/, "Must contain at least one uppercase")
      .matches(/^(?=.*[a-z])/, "Must contain at least one lowercase")
      .matches(/^(?=.*[0-9])/, "Must contain at least one number")
      .matches(
        /^(?=.*[!@#$%^&*])/,
        "Must contain at least one special character"
      )
      .min(8, "Password minimum 8 character")
      .required("Password is required!"),
    confirmPassword: Yup.string().oneOf(
      [Yup.ref("password"), null],
      "Passwords must match"
    ),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      verif(values);
    },
  });

  async function verif(values) {
    const { password, name } = values;
    try {
      await api.patch("/auth/verify", {
        email,
        password,
        name,
      });
      toast({
        title: "Verification Succes, now you can log in",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      nav("/auth");
    } catch (err) {
      toast({
        title: err.response?.data,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  }

  return (
    <Box
      w={["full", "md"]}
      p={[8, 10]}
      mt={[20, "10vh"]}
      mx={"auto"}
      border={["none", "1px"]}
      borderColor={["", "gray.300"]}
      borderRadius={10}
    >
      <VStack spacing={4} align={"center"} w={"full"}>
        <Heading> Verification </Heading>
        <form onSubmit={formik.handleSubmit} style={{ width: "100%" }}>
          <FormControl
            id="full_name"
            mt={"10px"}
            isRequired
            isInvalid={formik.touched.full_name && formik.errors.full_name}
          >
            <InputGroup>
              <InputLeftElement children={<Icon as={FaUser} />} />
              <Input
                type="text"
                placeholder="Full Name"
                id="full_name"
                onChange={formik.handleChange}
                value={formik.values.full_name}
              />
            </InputGroup>
            <Box h={"20px"}>
              <FormErrorMessage fontSize={"2xs"}>
                {formik.errors.full_name}
              </FormErrorMessage>
            </Box>
          </FormControl>

          <FormControl
            id="password"
            mt={"10px"}
            isRequired
            isInvalid={formik.touched.password && formik.errors.password}
          >
            <InputGroup>
              <InputLeftElement children={<Icon as={FaLock} />} />
              <Input
                type={show ? "text" : "password"}
                placeholder="Password"
                id="password"
                onChange={formik.handleChange}
                value={formik.values.password}
              />
              <InputRightElement width="4.5rem">
                <Button
                  h="1.75rem"
                  size="sm"
                  onClick={handleClick}
                  bgColor={"white"}
                  _hover={"white"}
                >
                  {show ? (
                    <Icon as={AiOutlineEye} w={"100%"} h={"100%"}></Icon>
                  ) : (
                    <Icon
                      as={AiOutlineEyeInvisible}
                      w={"100%"}
                      h={"100%"}
                    ></Icon>
                  )}
                </Button>
              </InputRightElement>
            </InputGroup>
            <Box h={"20px"}>
              <FormErrorMessage fontSize={"2xs"}>
                {formik.errors.password}
              </FormErrorMessage>
            </Box>
          </FormControl>

          <FormControl
            id="confirmPassword"
            mt={"10px"}
            isRequired
            isInvalid={
              formik.touched.confirmPassword && formik.errors.confirmPassword
            }
          >
            <InputGroup>
              <InputLeftElement children={<Icon as={FaLock} />} />
              <Input
                type={show1 ? "text" : "password"}
                placeholder="Confirm Password"
                id="confirmPassword"
                onChange={formik.handleChange}
                value={formik.values.confirmPassword}
              />{" "}
              <InputRightElement width="4.5rem">
                <Button
                  h="1.75rem"
                  size="sm"
                  onClick={handleClick1}
                  bgColor={"white"}
                  _hover={"white"}
                >
                  {show1 ? (
                    <Icon as={AiOutlineEye} w={"100%"} h={"100%"}></Icon>
                  ) : (
                    <Icon
                      as={AiOutlineEyeInvisible}
                      w={"100%"}
                      h={"100%"}
                    ></Icon>
                  )}
                </Button>
              </InputRightElement>
            </InputGroup>
            <Box h={"20px"}>
              <FormErrorMessage fontSize={"2xs"}>
                {formik.errors.confirmPassword}
              </FormErrorMessage>
            </Box>
          </FormControl>

          <Center>
            <Text mt={"5px"}> Click button below to verification</Text>
          </Center>
          <Button
            mt={"10px"}
            w={"100%"}
            colorScheme="blue.100"
            bgColor={"black"}
            size="lg"
            type="submit"
          >
            Verify
          </Button>
        </form>
      </VStack>
    </Box>
  );
}
