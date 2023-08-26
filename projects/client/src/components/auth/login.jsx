import { Box, Button, Flex, InputRightAddon } from "@chakra-ui/react";
import { FormControl, FormErrorMessage } from "@chakra-ui/react";
import { Heading, Icon, Input, InputGroup } from "@chakra-ui/react";
import { InputRightElement, Stack, Text, useToast } from "@chakra-ui/react";
import { TbAlertCircleFilled } from "react-icons/tb";
import { FaSearch } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { ViewOffIcon, ViewIcon, EmailIcon } from "@chakra-ui/icons";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import React, { useState, useRef } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { api } from "../../api/api";
import YupPassword from "yup-password";
import { auth } from "../../lib/firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

export default function Login() {
  YupPassword(Yup);
  const inputFileRef = useRef(null);
  const dispatch = useDispatch();
  const toast = useToast({ duration: 3000, isClosable: true, position: "top" });
  const nav = useNavigate();
  const [show, setShow] = React.useState(false);
  const handleClick = () => setShow(!show);
  const [isLoading, setIsLoading] = useState(false);
  const [formField, setFormField] = useState("");

  async function googleLogin() {
    try {
      const provider = new GoogleAuthProvider();
      const body = await signInWithPopup(auth, provider);
      console.log(body.user);
      const res = await api().post(
        "/auth/login",
        { email: body.user.email, password: "AB!@12ab" },
        { params: body.user }
      );
      console.log(res.data);
      localStorage.setItem("user", JSON.stringify(res.data.token));
      const restoken = await api().get("/auth/userbytoken", {
        headers: {
          Authorization: `Bearer ${res.data.token}`,
        },
      });
      dispatch({
        type: "login",
        payload: restoken.data,
      });
      toast({
        title: "login success",
        status: "success",
      });
      return nav("/");
    } catch (error) {
      console.log(error);
      toast({
        title: error.response.data.message,
        status: "error",
      });
    }
  }

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email address").required("Required"),
      password: Yup.string()
        .min(8, "at least 8 characters")
        .required("Required")
        .minUppercase(1, "at least 1 capital letter")
        .minNumbers(1, "at least 1 number"),
    }),
    onSubmit: async () => {
      let token;
      try {
        const res = await api().post("/auth/login", formik.values);
        localStorage.setItem("user", JSON.stringify(res.data.token));
        token = res.data.token;
        const restoken = await api().get("/auth/userbytoken", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        dispatch({
          type: "login",
          payload: restoken.data,
        });
        // fetch(dispatch);
        toast({
          title: res.data.message,
          status: "success",
        });
        return nav("/");
      } catch (err) {
        toast({
          title: err?.response?.data.message,
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
    <Box>
      <Heading fontSize="2xl" textAlign="center" mb={4}>
        Sign in
      </Heading>

      <Stack spacing={"20px"}>
        <Button onClick={googleLogin} size={"sm"} rightIcon={<FcGoogle />}>
          login with google
        </Button>
        <Flex justify={"space-between"} align={"center"}>
          <Box borderBottom={"1px"} w={"45%"} />
          <Box>OR</Box>
          <Box w={"45%"} borderBottom={"1px"} />
        </Flex>
        <FormControl isInvalid={formField === "email" && formik.errors.email}>
          <Box
            className={`inputbox ${
              formik.values.email ? "input-has-value" : ""
            }`}
          >
            <InputGroup size="md">
              <Input
                id="email"
                bg={"white"}
                value={formik.values.email}
                onChange={inputHandler}
              />
              <label>Email</label>
              <InputRightElement width="4rem">
                <Icon as={EmailIcon} />
              </InputRightElement>
            </InputGroup>
            <FormErrorMessage>
              <Icon as={TbAlertCircleFilled} w="16px" h="16px" />
              <Text fontSize={10}>{formik.errors.email}</Text>
            </FormErrorMessage>
          </Box>
        </FormControl>

        {/* confirm password */}
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
            <FormErrorMessage>
              <Icon as={TbAlertCircleFilled} w="16px" h="16px" />
              <Text fontSize={10}>{formik.errors.password}</Text>
            </FormErrorMessage>
          </Box>
        </FormControl>
        <Button
          id="button"
          isDisabled={
            formik.values.email && formik.values.password ? false : true
          }
          isLoading={isLoading}
          onClick={() => {
            setIsLoading(true);
            setTimeout(() => {
              setIsLoading(false);
              formik.handleSubmit();
            }, 2000);
          }}
        >
          login
        </Button>
        <Flex justify={"center"} gap={2} fontSize={"13px"}>
          Forgot password?
          <Link to="/forgot-password">
            <Box _hover={{ color: "blue.500" }}> click here</Box>
          </Link>
        </Flex>
      </Stack>
    </Box>
  );
}
