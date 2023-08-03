import { useToast, Text, InputRightElement } from "@chakra-ui/react";
import { Button, Center, Flex, Input, InputGroup } from "@chakra-ui/react";
import { FormControl, FormErrorMessage, Icon, Box } from "@chakra-ui/react";
import { TbAlertCircleFilled } from "react-icons/tb";
import { ViewOffIcon, ViewIcon } from "@chakra-ui/icons";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import YupPassword from "yup-password";
import { api } from "../../api/api";
import Footer from "../website/footer";

export default function ChangePassword() {
  YupPassword(Yup);
  const nav = useNavigate();
  const [formField, setFormField] = useState("");
  const [show, setShow] = React.useState(false);
  const [show1, setShow1] = React.useState(false);
  const handleClick = () => setShow(!show);
  const handleClick1 = () => setShow1(!show1);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const location = useLocation();
  const [user, setUser] = useState([]);
  const [token, setToken] = useState();

  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object().shape({
      password: Yup.string()
        .min(8, "Must be at least 8 characters")
        .required("Required"),
      confirmPassword: Yup.string()
        .required("confirm your password")
        .oneOf([Yup.ref("password"), null], "passwords don't match"),
    }),
    onSubmit: async () => {
      const password = formik.values.password;
      try {
        const res = await api.patch(
          "/auth/forgot-password",
          { password },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast({
          title: res.data.message,
          status: "success",
          position: "top",
        });
        return nav("/auth");
      } catch (err) {
        toast({
          title: err.response.data,
          status: "error",
          position: "top",
        });
      }
    },
  });

  useEffect(() => {
    const pathToken = location.pathname.split("/")[2];
    fetchUser(pathToken);
    setToken(pathToken);
  }, []);

  const fetchUser = async (token) => {
    try {
      const res = await api.get("/auth/userbytoken", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
    } catch (err) {
      toast({
        title: err.response.data,
        status: "error",
        position: "top",
      });
    }
  };

  function inputHandler(e) {
    const { value, id } = e.target;
    formik.setFieldValue(id, value);
    setFormField(id);
  }

  return (
    <>
      {user.email ? (
        <Center flexDir={"column"}>
          <Center h={"100vh"} maxH={"800px"} maxW={"1531px"} w={"100%"}>
            <Flex
              flexDir={"column"}
              p={5}
              m={5}
              textAlign={"center"}
              border={"2px"}
              w={"100%"}
              maxW={"500px"}
            >
              <Box fontSize={"25px"} mb={2}>
                Change Password
              </Box>
              {/* password */}
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
                  <Box w={"100%"} h={8}>
                    <FormErrorMessage>
                      <Center>
                        <Icon as={TbAlertCircleFilled} w="16px" h="16px" />
                      </Center>
                      <Text fontSize={10}>{formik.errors.password}</Text>
                    </FormErrorMessage>
                  </Box>
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
                  <InputGroup size="md">
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
                  <Box w={"100%"} h={8}>
                    <FormErrorMessage>
                      <Center>
                        <Icon as={TbAlertCircleFilled} w="16px" h="16px" />
                      </Center>
                      <Text fontSize={10}>{formik.errors.confirmPassword}</Text>
                    </FormErrorMessage>
                  </Box>
                </Box>
              </FormControl>
              <Button
                isDisabled={
                  formik.values.password && formik.values.confirmPassword
                    ? false
                    : true
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
                Confirm
              </Button>
            </Flex>
          </Center>
          <Footer />
        </Center>
      ) : (
        <Center h={"100vh"}>
          <Box fontSize={"50px"}>link has expired</Box>
        </Center>
      )}
    </>
  );
}
