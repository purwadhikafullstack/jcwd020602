import {
  Flex,
  Box,
  Button,
  Center,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Stack,
  useToast,
} from "@chakra-ui/react";
import { FaEnvelope } from "react-icons/fa";
import { useState } from "react";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { api } from "../../api/api";

export default function Register() {
  const toast = useToast({ position: "top" });
  const nav = useNavigate();

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email(
        "* email is invalid. Make sure it's written like example@email.com"
      )
      .required("* Email is required"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      await register(values);
    },
  });

  const register = async (values) => {
    try {
      await api.post("/auth/register", values);
      toast({
        title: "Check your email for verification",
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
  };

  return (
    <Box>
      <Heading fontSize="2xl" textAlign="center" mb={4}>
        Sign up
      </Heading>

      <Stack spacing={4}>
        <form onSubmit={formik.handleSubmit}>
          <FormControl
            id="email"
            isRequired
            isInvalid={formik.touched.email && formik.errors.email}
          >
            <FormLabel>Email</FormLabel>
            <InputGroup>
              <InputLeftElement>
                <Icon as={FaEnvelope} />
              </InputLeftElement>
              <Input
                type="email"
                placeholder="Email"
                id="email"
                name="email"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
              />
            </InputGroup>
            <Box h={"30px"}>
              <FormErrorMessage fontSize={"2xs"}>
                {formik.errors.email}
              </FormErrorMessage>
            </Box>
          </FormControl>

          <Button
            colorScheme="blue.100"
            bgColor={"black"}
            size="lg"
            w={"100%"}
            type="submit"
          >
            Sign up
          </Button>
        </form>
      </Stack>
    </Box>
  );
}
