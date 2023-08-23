import { Select, ModalBody } from "@chakra-ui/react";
import { Box, ModalOverlay, ModalContent } from "@chakra-ui/react";
import { FormControl, FormErrorMessage, ModalFooter } from "@chakra-ui/react";
import { Icon, ModalCloseButton, Button, Input, Modal } from "@chakra-ui/react";
import { Flex, Checkbox, useToast, ModalHeader } from "@chakra-ui/react";
import { useFetchCity, useFetchProv } from "../../hooks/useFetchProvCity";
import { TbAlertCircleFilled } from "react-icons/tb";
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import { api } from "../../api/api";
import * as Yup from "yup";

export default function EditAddress({ data, fetch, isOpen, onClose }) {
  const toast = useToast({ duration: 3000, isClosable: true, position: "top" });
  const { provinces } = useFetchProv();
  const [province_id, setProvince_id] = useState(0);
  const { cities } = useFetchCity(province_id || data?.city?.province_id);
  const [formField, setFormField] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const formik = useFormik({
    initialValues: {},
    validationSchema: Yup.object({
      title: Yup.string().required("Required"),
      name: Yup.string().required("Required"),
      phone: Yup.string()
        .min(12, "min 12 digits")
        .max(12, "max 12 digits")
        .required("Required"),
      city_id: Yup.number().required("Required"),
      address: Yup.string().max(100).required("Required"),
      address_details: Yup.string().max(100).required("Required"),
    }),
    onSubmit: async () => {
      try {
        const res = await api().patch("/address/edit", formik.values);
        toast({
          title: res.data.message,
          status: "success",
        });
        fetch();
        onClose();
      } catch (err) {
        toast({
          title: err?.response?.data?.message,
          status: "error",
        });
      }
    },
  });

  const editAddress = async () => {};

  useEffect(() => {
    if (data) {
      formik.setValues(data);
      setProvince_id(data?.city?.province_id || 0);
    }
  }, [data]);

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
  return (
    <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>EDIT ADDRESS</ModalHeader>
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
                // value={province_id}
                onChange={(e) => {
                  setProvince_id(e.target.value);
                }}
              >
                {provinces &&
                  provinces.map((val, idx) =>
                    formik?.values?.city?.province_id != val.province_id ? (
                      <option key={val.province_id} value={val.province_id}>
                        {val.province}
                      </option>
                    ) : (
                      <option
                        selected
                        key={val.province_id}
                        value={val.province_id}
                      >
                        {val.province}
                      </option>
                    )
                  )}
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
            <Checkbox
              id="is_primary"
              onChange={inputHandler}
              isChecked={formik.values.is_primary}
            />
            Use as my default address
          </Flex>
        </ModalBody>

        <ModalFooter>
          <Button
            id="button"
            variant={"outline"}
            isLoading={isLoading}
            onClick={() => {
              setIsLoading(true);
              setTimeout(() => {
                setIsLoading(false);
                formik.handleSubmit();
                // editAddress();
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
