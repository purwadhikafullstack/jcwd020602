import { Box, Button, Center, FormErrorMessage } from "@chakra-ui/react";
import { InputRightElement, Text } from "@chakra-ui/react";
import { InputGroup, useToast, FormControl } from "@chakra-ui/react";
import { Heading, Icon, Input, Stack } from "@chakra-ui/react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { api } from "../../api/api";
import { useState } from "react";
import { TbAlertCircleFilled } from "react-icons/tb";
import { EmailIcon } from "@chakra-ui/icons";

export default function Register() {
  const toast = useToast({ position: "top" });
  const nav = useNavigate();
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

  return (
    <Box>
      <Heading fontSize="2xl" textAlign="center" mb={4}>
        Sign up
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
        <Button
          type="submit"
          variant={"outline"}
          border={"2px"}
          _hover={{ bg: "black", color: "white" }}
          isDisabled={formik.values.email ? false : true}
          isLoading={isLoading}
          onClick={() => {
            setIsLoading(true);
            setTimeout(() => {
              setIsLoading(false);
              formik.handleSubmit();
            }, 2000);
          }}
        >
          Sign up
        </Button>
      </Stack>
    </Box>
  );
}
