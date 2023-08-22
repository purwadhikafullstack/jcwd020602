import { ModalOverlay, ModalContent, ModalHeader } from "@chakra-ui/react";
import { ModalFooter, ModalBody, ModalCloseButton } from "@chakra-ui/react";
import { Button, Input, Select, useToast, Box, Modal } from "@chakra-ui/react";
import { FormControl, FormLabel, NumberInput } from "@chakra-ui/react";
import { NumberInputField, FormErrorMessage } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { api } from "../../api/api";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useFetchStockId } from "../../hooks/useFetchStock";
export default function EditStock(props) {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const { stock, setStock } = useFetchStockId(props.id);
  const formik = useFormik({
    initialValues: {
      stock: 1,
    },
    validationSchema: Yup.object().shape({
      stock: Yup.number()
        .min(1, "Quantity must be greater than 0")
        .required("stock is required"),
    }),
    onSubmit: async () => {
      try {
        const res = await api().patch("/stocks/" + formik.values?.id, {
          stock: formik.values.stock,
        });
        toast({
          title: res.data.message,
          status: "success",
          position: "top",
        });
        props.fetch();
        clearData();
      } catch (err) {
        toast({
          title: `${err?.response?.status} ${
            err?.response?.data?.message || err?.response?.data
          }`,
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      }
    },
  });
  useEffect(() => {
    if (stock?.id) {
      formik.setValues(stock);
    }
  }, [stock]);
  function inputHandler(e) {
    const { value, id } = e.target;
    formik.setFieldValue(id, value);
  }
  function clearData() {
    formik.resetForm();
    props.setId(null);
    setStock({});
    props.onClose();
  }
  return (
    <>
      <Modal scrollBehavior="inside" isOpen={props.isOpen} onClose={clearData}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader p={2}>Edit Stock</ModalHeader>
          <ModalCloseButton />
          <ModalBody display={"flex"} flexDir={"column"} gap={2}>
            <form onSubmit={formik.handleSubmit}>
              <FormControl
                mb={2}
                id="stock"
                value={formik.values.stock}
                onChange={inputHandler}
                isInvalid={formik.touched.stock && formik.errors.stock}
              >
                <FormLabel>Stock:</FormLabel>
                <NumberInput min={1} value={formik.values.stock}>
                  <NumberInputField />
                </NumberInput>
                <FormErrorMessage>{formik.errors.stock}</FormErrorMessage>
              </FormControl>
              <FormControl mb={2} id="shoe_id" value={formik.values.shoe_id}>
                <FormLabel>Shoe:</FormLabel>
                <Select
                  key={formik.values.shoe_id}
                  defaultValue={formik.values.shoe_id}
                  disabled
                >
                  <option
                    key={formik.values?.Sho?.id}
                    value={formik.values?.Sho?.id}
                    selected
                  >
                    {formik.values?.Sho?.name}
                  </option>
                </Select>
              </FormControl>
              <FormControl
                mb={2}
                id="shoe_size_id"
                value={formik.values.shoe_size_id}
              >
                <FormLabel>Shoe Size:</FormLabel>
                <Select
                  key={formik.values.shoe_size_id}
                  defaultValue={formik.values.shoe_size_id}
                  disabled
                >
                  <option
                    key={formik.values?.shoeSize?.id}
                    value={formik.values?.shoeSize?.id}
                    selected
                  >
                    {formik.values?.shoeSize?.size}
                  </option>
                </Select>
              </FormControl>
              <FormControl
                mb={2}
                id="warehouse_id"
                value={formik.values.warehouse_id}
              >
                <FormLabel>Warehouse Name:</FormLabel>
                <Select
                  key={formik.values.warehouse_id}
                  defaultValue={formik.values.warehouse_id}
                  value={formik.values.warehouse_id}
                  disabled
                >
                  <option
                    key={formik.values?.warehouse?.id}
                    value={formik.values?.warehouse?.id}
                    selected
                  >
                    {formik.values?.warehouse?.name}
                  </option>
                </Select>
              </FormControl>
            </form>
          </ModalBody>
          <ModalFooter>
            <Button onClick={clearData}>Cancel</Button>
            <Button
              isLoading={isLoading}
              onClick={() => {
                setIsLoading(true);
                setTimeout(() => {
                  setIsLoading(false);
                  formik.handleSubmit();
                }, 2000);
              }}
            >
              confirm
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
