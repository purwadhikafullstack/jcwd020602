import { Box, Button, Center, Flex } from "@chakra-ui/react";
import { FormControl, FormErrorMessage, FormLabel } from "@chakra-ui/react";
import { Heading, Icon, Input, InputGroup } from "@chakra-ui/react";
import { InputRightElement, Stack, Text, useToast } from "@chakra-ui/react";
import { TbAlertCircleFilled } from "react-icons/tb";
import { ViewOffIcon, ViewIcon, EmailIcon } from "@chakra-ui/icons";
import { Link, useNavigate } from "react-router-dom";
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
  const [isLoading, setIsLoading] = useState(false);
  const [formField, setFormField] = useState("");

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email address").required("Required"),
      password: Yup.string()
        .min(8, "Must be at least 8 characters")
        .required("Required"),
    }),
    onSubmit: async () => {
      let token;
      try {
        const res = await api.post("/auth/login", formik.values);
        localStorage.setItem("user", JSON.stringify(res.data.token));
        token = res.data.token;
        const restoken = await api.get("/auth/userbytoken", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        dispatch({
          type: "login",
          payload: restoken.data,
        });
        toast({
          title: res.data.message,
          status: "success",
          position: "top",
          duration: 1000,
        });
        return nav("/");

      } catch (err) {
        toast({
          title: err.response?.data,
          status: "error",
          position: "top",
          duration: 1000,
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

  return (
    <Box>
      <Heading fontSize="2xl" textAlign="center" mb={4}>
        Sign in
      </Heading>

      <Stack>
        <FormControl isInvalid={formField === "email" && formik.errors.email}>
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
            <Box h={8}>
              <FormErrorMessage>
                <Center>
                  <Icon as={TbAlertCircleFilled} w="16px" h="16px" />
                </Center>
                <Text fontSize={10}>{formik.errors.email}</Text>
              </FormErrorMessage>
            </Box>
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
              <label>Confirm Password</label>
              <InputRightElement width="4rem">
                <Button h="1.75rem" size="sm" onClick={handleClick}>
                  {show ? <ViewOffIcon /> : <ViewIcon />}
                </Button>
              </InputRightElement>
            </InputGroup>
            <Box h={8}>
              <FormErrorMessage>
                <Center>
                  <Icon as={TbAlertCircleFilled} w="16px" h="16px" />
                </Center>
                <Text fontSize={10}>{formik.errors.password}</Text>
              </FormErrorMessage>
            </Box>
          </Box>
        </FormControl>
        <Button
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
        <Flex justify={"center"} gap={2}>
          Forgot password?
          <Link to="/forgot-password">
            <Box _hover={{ color: "blue.500" }}> click here</Box>
          </Link>
        </Flex>
      </Stack>
    </Box>
  );
}
