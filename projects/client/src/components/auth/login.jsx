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
  InputRightElement,
  Stack,
  Text,
  useToast,
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
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import React, { useState } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { api } from "../../api/api";

export default function Login() {
  const dispatch = useDispatch();
  const toast = useToast();
  const nav = useNavigate();
  const [show, setShow] = React.useState(false);
  const handleClick = () => setShow(!show);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email address").required("Required"),
      password: Yup.string()
        .min(6, "Must be at least 6 characters")
        .required("Required"),
    }),
    onSubmit: (values) => {
      login(values);
    },
  });

  const login = async (values) => {
    try {
      if (!values.email || !values.password) {
        toast({
          title: "fill in all data.",
          status: "warning",
          position: "top",
          duration: 1000,
          isClosable: true,
        });
      } else {
        let token;
<<<<<<< Updated upstream
        await api
          .post("/auth/login", values)
          .then((res) => {
            localStorage.setItem("user", JSON.stringify(res.data.token));

            token = res.data.token;
          })
          .catch((err) =>
            toast({
              title: err.response?.data,
              status: "error",
              position: "top",
              duration: 1000,
              isClosable: true,
            })
          );

        await api
          .get("/auth/userbytoken", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            // params: {
            //   token,
            // },
          })
          .then((res) => {
            dispatch({
              type: "login",
              payload: res.data,
            });
            nav("/");
          });
=======
        const res = await api.post("/auth/login", formik.values);
        localStorage.setItem("user", JSON.stringify(res.data.token));
        token = res.data.token;

        const resGet = await api.get("/auth/userbytoken", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        dispatch({
          type: "login",
          payload: resGet.data,
        });
        nav("/");
      } catch (err) {
        toast({
          title: err.response?.data,
          status: "error",
          position: "top",
          duration: 1000,
          isClosable: true,
        });
        console.log(err.message);
>>>>>>> Stashed changes
      }
    } catch (err) {
      console.log(err.message);
    }

    return;
  };

  return (
    <Box>
      <Heading fontSize="2xl" textAlign="center" mb={4}>
        Sign in
      </Heading>

      <Stack spacing={4}>
        <form onSubmit={formik.handleSubmit}>
          <FormControl
            id="email"
            isRequired
            isInvalid={formik.touched.email && formik.errors.email}
          >
            <InputGroup>
              <InputLeftElement children={<Icon as={FaUser} />} />
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
            <Box h={"20px"}>
              <FormErrorMessage fontSize={"2xs"}>
                {formik.errors.email}
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
          <Button
            w={"100%"}
            colorScheme="blue.100"
            size="lg"
            type="submit"
            bgColor={"black"}
          >
            Login
          </Button>
        </form>
      </Stack>
    </Box>
  );
}
