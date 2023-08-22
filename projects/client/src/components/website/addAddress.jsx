import { Select, ModalBody } from "@chakra-ui/react";
import { Box, ModalOverlay, ModalContent } from "@chakra-ui/react";
import { FormControl, FormErrorMessage, ModalFooter } from "@chakra-ui/react";
import { Icon, ModalCloseButton, Button, Input, Modal } from "@chakra-ui/react";
import { Flex, Checkbox, useToast, ModalHeader } from "@chakra-ui/react";
import { useFetchCity, useFetchProv } from "../../hooks/useFetchProvCity";
import { useFormik } from "formik";
import { TbAlertCircleFilled } from "react-icons/tb";
import * as Yup from "yup";
import { useState } from "react";
import { api } from "../../api/api";

export default function AddAddress(props) {
  const toast = useToast({ duration: 3000, isClosable: true, position: "top" });
  const { provinces } = useFetchProv();
  const [province_id, setProvince_id] = useState(0);
  const { cities } = useFetchCity(province_id);
  const [formField, setFormField] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      title: "",
      name: "",
      phone: "",
      city_id: "",
      address: "",
      address_details: "",
      is_primary: false,
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Required"),
      name: Yup.string().required("Required"),
      phone: Yup.string()
        .min(12, "min 12 digits")
        .max(12, "max 12 digits")
        .required("Required"),
      city_id: Yup.number().required("Required"),
      address: Yup.string().max(100).required("Required"),
    }),
    onSubmit: async () => {
      try {
        const res = await api().post("/address", formik.values);
        toast({
          title: res.data.message,
          status: "success",
        });
        props.fetch();
        clearData();
      } catch (err) {
        toast({
          title: err?.response?.data?.message,
          status: "error",
        });
      }
    },
  });
  function inputHandler(e) {
    const { value, id, checked } = e.target;
    if (checked) {
      formik.setFieldValue(id, checked);
    } else {
      formik.setFieldValue(id, value);
    }
    setFormField(id);
  }

  const inputan = [
    { id: "title", type: "text" },
    { id: "name", type: "text" },
    { id: "phone", type: "number" },
    { id: "address", type: "text" },
    { id: "address_details", type: "text" },
  ];

  const clearData = () => {
    props.onClose();
    formik.resetForm();
    setProvince_id(null);
  };

  return (
    <Modal
      closeOnOverlayClick={false}
      isOpen={props.isOpen}
      onClose={clearData}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>ADD ADDRESS</ModalHeader>
        <ModalCloseButton />
        <ModalBody display={"flex"} flexDir={"column"} gap={5}>
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
                <Input
                  id={val.id}
                  name={val.id}
                  value={formik.values[val.id]}
                  onChange={inputHandler}
                  type={val.type}
                />
                <label htmlFor={val.id}>{val.id}</label>
              </Box>
              <FormErrorMessage>
                <Icon as={TbAlertCircleFilled} w="16px" h="16px" />
                <Box fontSize={10}>{formik.errors[val.id]}</Box>
              </FormErrorMessage>
            </FormControl>
          ))}

          <FormControl isInvalid={formField === "province"}>
            <Box className={`inputbox ${province_id ? "input-has-value" : ""}`}>
              <Select
                id="province"
                placeholder="          "
                value={province_id}
                onChange={(e) => {
                  setProvince_id(e.target.value);
                }}
              >
                {provinces &&
                  provinces.map((val, idx) => (
                    <option key={val.province_id} value={val.province_id}>
                      {val.province}
                    </option>
                  ))}
              </Select>
              <label>Province</label>
            </Box>
          </FormControl>
          <FormControl
            isInvalid={formField === "city_id" && formik.errors.city_id}
          >
            <Box
              className={`inputbox ${
                formik.values.city_id ? "input-has-value" : ""
              }`}
            >
              <Select
                placeholder="         "
                onChange={inputHandler}
                id="city_id"
                value={formik.values.city_id}
              >
                {cities &&
                  cities.map((val, idx) => (
                    <option key={val.city_id} value={val.city_id}>
                      {val.type} {val.city_name}
                    </option>
                  ))}
              </Select>
              <label>City</label>
            </Box>

            <FormErrorMessage>
              <Icon as={TbAlertCircleFilled} w="16px" h="16px" />
              <Box fontSize={10}>{formik.errors.city_id}</Box>
            </FormErrorMessage>
          </FormControl>

          <Flex gap={2}>
            <Checkbox id="is_primary" onChange={inputHandler} />
            Use as my default address
          </Flex>
        </ModalBody>

        <ModalFooter>
          <Button
            id="button"
            isLoading={isLoading}
            onClick={() => {
              setIsLoading(true);
              setTimeout(() => {
                setIsLoading(false);
                formik.handleSubmit();
              }, 2000);
            }}
          >
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
