import { Flex, FormErrorMessage, InputRightElement } from "@chakra-ui/react";
import { Icon, Input, InputGroup, Button } from "@chakra-ui/react";
import { FormControl, Text, useToast, Center, Box } from "@chakra-ui/react";
import { TbAlertCircleFilled } from "react-icons/tb";
import { ViewOffIcon, ViewIcon } from "@chakra-ui/icons";
import * as Yup from "yup";
import YupPassword from "yup-password";
import { useLocation, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { api } from "../../api/api";
import Footer from "../website/footer";
import Navbar from "../website/navbar";

export default function Verify() {
  YupPassword(Yup);
  const loc = useLocation();
  const [user, setUser] = useState({ email: "" });
  const queryParams = new URLSearchParams(window.location.search);
  const email = queryParams.get("email");
  const toast = useToast({ duration: 3000, isClosable: true, position: "top" });
  const nav = useNavigate();
  const [show, setShow] = React.useState(false);
  const handleClick = () => setShow(!show);
  const [show1, setShow1] = React.useState(false);
  const handleClick1 = () => setShow1(!show1);
  const [isLoading, setIsLoading] = useState(false);
  const [formField, setFormField] = useState("");

  const formik = useFormik({
    initialValues: {
      name: "",
      password: "",
      confirmPassword: "",
      phone: "",
      email,
    },
    validationSchema: Yup.object().shape({
      name: Yup.string().required("required"),
      phone: Yup.string()
        .min(10, "min 10 digits")
        .max(12, "max 12 digits")
        .required("required"),
      password: Yup.string()
        .matches(/^(?=.*[A-Z])/, "Must contain at least one uppercase")
        .matches(/^(?=.*[a-z])/, "Must contain at least one lowercase")
        .min(8, "Password minimum 8 character")
        .minNumbers(1, "at least 1 number")
        .required("required"),
      confirmPassword: Yup.string().oneOf(
        [Yup.ref("password"), null],
        "Passwords must match"
      ),
    }),
    onSubmit: async () => {
      try {
        const res = await api().patch("/auth/verify", formik.values);
        toast({
          title: res?.data?.message,
          status: "success",
        });
        return nav("/auth");
      } catch (err) {
        toast({
          title: err?.response?.data.message,
          status: "error",
        });
      }
    },
  });

  const fetchUser = async (token) => {
    try {
      const res = await api().get("/auth/userbytoken", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data) {
        setUser(res?.data);
      }
    } catch (err) {
      toast({
        title: err?.response?.data,
        status: "error",
        position: "top",
      });
    }
  };
  useEffect(() => {
    const pathToken = loc.pathname.split("/")[2];
    fetchUser(pathToken);
  }, []);

  function inputHandler(e) {
    const { value, id } = e.target;
    formik.setFieldValue(id, value);
    setFormField(id);
  }

  return (
    <>
      <Navbar />
      {!user?.email ? (
        <Center h={"100vh"}>
          <Box fontSize={"50px"}>link has expired</Box>
        </Center>
      ) : (
        <Center flexDir={"column"}>
          <Center h={"100vh"} maxH={"800px"} maxW={"1531px"} w={"100%"}>
            <Flex
              flexDir={"column"}
              gap={5}
              p={2}
              m={2}
              border={"2px"}
              w={"100%"}
              maxW={"500px"}
            >
              <Center fontSize={"25px"}>VERIFICATION</Center>
              {/* name */}
              <FormControl
                isInvalid={formField === "name" && formik.errors.name}
              >
                <Box
                  className={`inputbox ${
                    formik.values.name ? "input-has-value" : ""
                  }`}
                >
                  <InputGroup>
                    <Input
                      id="name"
                      value={formik.values.name}
                      onChange={inputHandler}
                    />
                    <label>Name</label>
                  </InputGroup>
                  <FormErrorMessage>
                    <Icon as={TbAlertCircleFilled} w="16px" h="16px" />
                    <Text fontSize={10}>{formik.errors.name}</Text>
                  </FormErrorMessage>
                </Box>
              </FormControl>
              {/* phone */}
              <FormControl
                isInvalid={formField === "phone" && formik.errors.phone}
              >
                <Box
                  className={`inputbox ${
                    formik.values.phone ? "input-has-value" : ""
                  }`}
                >
                  <InputGroup>
                    <Input
                      id="phone"
                      value={formik.values.phone}
                      onChange={inputHandler}
                    />
                    <label>Phone</label>
                  </InputGroup>
                  <FormErrorMessage>
                    <Icon as={TbAlertCircleFilled} w="16px" h="16px" />
                    <Text fontSize={10}>{formik.errors.phone}</Text>
                  </FormErrorMessage>
                </Box>
              </FormControl>
              {/* password */}
              <FormControl
                isInvalid={formField === "password" && formik.errors.password}
              >
                <Box
                  className={`inputbox ${
                    formik.values.password ? "input-has-value" : ""
                  }`}
                >
                  <InputGroup>
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
              {/* confirm password */}
              <FormControl
                isInvalid={
                  formField === "confirmPassword" &&
                  formik.errors.confirmPassword
                }
              >
                <Box
                  className={`inputbox ${
                    formik.values.confirmPassword ? "input-has-value" : ""
                  }`}
                >
                  <InputGroup>
                    <Input
                      id="confirmPassword"
                      value={formik.values.confirmPassword}
                      onChange={inputHandler}
                      type={show1 ? "text" : "password"}
                    />
                    <label>Confirm Password</label>
                    <InputRightElement width="4rem">
                      <Button h="1.75rem" size="sm" onClick={handleClick1}>
                        {show1 ? <ViewOffIcon /> : <ViewIcon />}
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                  <FormErrorMessage>
                    <Icon as={TbAlertCircleFilled} w="16px" h="16px" />
                    <Text fontSize={10}>{formik.errors.confirmPassword}</Text>
                  </FormErrorMessage>
                </Box>
              </FormControl>

              <Button
                id="button"
                isDisabled={
                  formik.values.name &&
                  formik.values.password &&
                  formik.values.confirmPassword
                    ? false
                    : true
                }
                isLoading={isLoading}
                onClick={() => {
                  setIsLoading(true);
                  setTimeout(() => {
                    formik.handleSubmit();
                    setIsLoading(false);
                  }, 2000);
                }}
              >
                Confirm
              </Button>
            </Flex>
          </Center>
          <Footer />
        </Center>
      )}
    </>
  );
}
