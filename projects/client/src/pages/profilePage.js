import { Button, FormErrorMessage, InputRightElement } from "@chakra-ui/react";
import { ViewOffIcon, ViewIcon } from "@chakra-ui/icons";
import { Box, FormControl, Text, useToast, Avatar } from "@chakra-ui/react";
import { Icon, Input, InputGroup, Center, Flex } from "@chakra-ui/react";
import { useFormik } from "formik";
import React, { useRef, useState } from "react";
import * as Yup from "yup";
import YupPassword from "yup-password";
import { TbAlertCircleFilled } from "react-icons/tb";
import { EmailIcon, PhoneIcon } from "@chakra-ui/icons";
import { api } from "../api/api";
import { useDispatch, useSelector } from "react-redux";
import Footer from "../components/website/footer";
import { fetch } from "../hoc/authProvider";
import Navbar from "../components/website/navbar";

export default function ProfilePage() {
  YupPassword(Yup);
  const toast = useToast({ duration: 3000, isClosable: true, position: "top" });
  const [isLoading, setIsLoading] = useState(false);
  const [isLoading1, setIsLoading1] = useState(false);
  const [formField, setFormField] = useState("");
  const [boxPass, setBoxPass] = useState(false);
  const [show, setShow] = React.useState(false);
  const [show1, setShow1] = React.useState(false);
  const handleClick = () => setShow(!show);
  const handleClick1 = () => setShow1(!show1);
  const [image, setImage] = useState();
  const fileRef = useRef(null);
  const [selectedFile, setSelectedfile] = useState();
  const userSelector = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      ...userSelector,
    },
    validationSchema: Yup.object().shape({
      name: Yup.string().required("Name is required"),
      phone: Yup.string()
        .min(10, "min 10 digits")
        .max(12, "max 12 digits")
        .matches(/^((0)|(\+62))/, "Must start with 0 ")
        .required("phone is required"),
    }),
    onSubmit: async () => {
      const formData = new FormData();
      formData.append("name", formik.values.name);
      formData.append("phone", formik.values.phone);
      formData.append("email", formik.values.email);
      if (selectedFile) {
        formData.append("avatar", selectedFile);
      }
      setIsLoading(true);
      try {
        const res = await api().patch("/auth/profile", formData);
        toast({
          title: res.data.message,
          status: "success",
        });
        fetch(dispatch);
        setIsLoading(false);
      } catch (err) {
        toast({
          title: err?.response?.data.message,
          status: "error",
        });
        setIsLoading(false);
      }
    },
  });

  const formik2 = useFormik({
    initialValues: {
      oldPassword: "",
      newPassword: "",
      email: userSelector.email,
    },
    validationSchema: Yup.object().shape({
      oldPassword: Yup.string()
        .min(8, "at least 8 characters")
        .minUppercase(1, "at least 1 capital letter")
        .minLowercase(1, "at least 1 lower letter")
        .minNumbers(1, "at least 1 number")
        .required("Required"),
      newPassword: Yup.string()
        .min(8, "at least 8 characters")
        .minUppercase(1, "at least 1 capital letter")
        .minLowercase(1, "at least 1 lower letter")
        .minNumbers(1, "at least 1 number")
        .required("Required"),
    }),
    onSubmit: async () => {
      setIsLoading1(true);
      try {
        const res = await api().patch("/auth/password", formik2.values);
        toast({
          title: res.data.message,
          status: "success",
        });
        setIsLoading1(false);
      } catch (err) {
        toast({
          title: err?.response?.data?.message,
          status: "error",
        });
        setIsLoading1(false);
      }
    },
  });
  function inputHandler(e) {
    const { value, id } = e.target;
    formik.setFieldValue(id, value);
    setFormField(id);
  }
  function inputHandler2(e) {
    const { value, id } = e.target;
    formik2.setFieldValue(id, value);
    setFormField(id);
  }

  const handleFile = (event) => {
    setSelectedfile(event.target.files[0]);
    setImage(URL.createObjectURL(event.target.files[0]));
  };

  const inputan = [
    { id: "name", type: "text" },
    { id: "email", type: "text" },
  ];

  const inputPass = [
    { id: "oldPassword", type: show, handle: handleClick },
    { id: "newPassword", type: show1, handle: handleClick1 },
  ];

  return (
    <Center flexDir={"column"}>
      <Navbar />
      <Flex w={"100%"} maxW={"1535px"} zIndex={1} p={"1rem 1rem"} mt={"100px"}>
        <Flex gap={5} flexDir={"column"} p={2} border={"2px"} w={"100%"}>
          <Text fontSize={"30px"} fontWeight={"bold"}>
            YOUR DETAILS
          </Text>
          <Center>
            {userSelector.providerId ? (
              <Avatar size={"xl"} src={userSelector.avatar_url} />
            ) : (
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
            )}
            <Input
              accept="image/png, image/jpeg"
              onChange={handleFile}
              ref={fileRef}
              type="file"
              display="none"
            />
          </Center>
          <Box className="form-profile">
            {inputan.map((val) => (
              <FormControl
                key={val.id}
                isInvalid={formField === val.id && formik.errors[val.id]}
              >
                <Box
                  className={`inputbox ${
                    formik.values[val.id] ? "input-has-value" : ""
                  }`}
                >
                  <InputGroup size="md">
                    <Input
                      id={val.id}
                      name={val.id}
                      value={formik.values[val.id]}
                      onChange={inputHandler}
                      type={val.type}
                      isDisabled={val.id == "email" ? true : false}
                    />
                    <label htmlFor={val.id}>{val.id}</label>
                    {val.id == "email" ? (
                      <InputRightElement width="4rem">
                        <Icon as={EmailIcon} />
                      </InputRightElement>
                    ) : null}
                  </InputGroup>
                  <Box>
                    <FormErrorMessage>
                      <Icon as={TbAlertCircleFilled} w="16px" h="16px" />
                      <Text fontSize={10}>{formik.errors[val.id]}</Text>
                    </FormErrorMessage>
                  </Box>
                </Box>
              </FormControl>
            ))}
          </Box>
          <Box className="form-profile">
            <FormControl>
              <Box
                className={`inputbox ${
                  formik.values.phone ? "input-has-value" : ""
                }`}
              >
                <InputGroup size="md" maxW={"730px"}>
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
                  {formik.errors.phone ? (
                    <Flex p={1} align={"center"} color={"red"}>
                      <Box>
                        <Icon as={TbAlertCircleFilled} />
                      </Box>
                      <Box fontSize={10}>{formik.errors.phone}</Box>
                    </Flex>
                  ) : null}
                </Box>
              </Box>
            </FormControl>
          </Box>
          <Button
            id="button"
            isLoading={isLoading}
            onClick={formik.handleSubmit}
          >
            SAVE CHANGES
          </Button>

          {userSelector.providerId ? null : (
            <Flex flexDir={"column"} gap={5}>
              <Box
                w={"180px"}
                cursor={"pointer"}
                fontWeight={"bold"}
                textDecor={"underline"}
                onClick={() => (boxPass ? setBoxPass(false) : setBoxPass(true))}
              >
                CHANGE PASSWORD
              </Box>
              <Box
                display={boxPass ? "flex" : "none"}
                flexDir={"column"}
                gap={5}
              >
                <Box className="form-profile">
                  {inputPass.map((val) => (
                    <FormControl key={val.id}>
                      <Box
                        className={`inputbox ${
                          formik2.values[val.id] ? "input-has-value" : ""
                        }`}
                      >
                        <InputGroup size="md">
                          <Input
                            id={val.id}
                            name={val.id}
                            value={formik2.values[val.id]}
                            onChange={inputHandler2}
                            type={val.type ? "text" : "password"}
                            border={"2px"}
                            borderRadius={0}
                          />
                          <label>{val.id}</label>
                          <InputRightElement width="4rem">
                            <Button h="1.75rem" size="sm" onClick={val.handle}>
                              {val.type ? <ViewOffIcon /> : <ViewIcon />}
                            </Button>
                          </InputRightElement>
                        </InputGroup>
                        <Box>
                          {formik2.errors[val.id] ? (
                            <Flex p={1} align={"center"} color={"red"}>
                              <Box>
                                <Icon as={TbAlertCircleFilled} />
                              </Box>
                              <Box fontSize={10}>{formik2.errors[val.id]}</Box>
                            </Flex>
                          ) : null}
                        </Box>
                      </Box>
                    </FormControl>
                  ))}
                </Box>
                <Button
                  id="button"
                  isLoading={isLoading1}
                  onClick={formik2.handleSubmit}
                >
                  UPDATE PASSWORD
                </Button>
              </Box>
            </Flex>
          )}
        </Flex>
      </Flex>
      <Footer />
    </Center>
  );
}
