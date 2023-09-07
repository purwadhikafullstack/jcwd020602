import { ModalFooter, ModalBody, ModalCloseButton } from "@chakra-ui/react";
import { Button, Input, Select, Box, useToast, Modal } from "@chakra-ui/react";
import { ModalOverlay, ModalContent, ModalHeader } from "@chakra-ui/react";
import { FormControl, FormLabel, NumberInput } from "@chakra-ui/react";
import { NumberInputField, FormErrorMessage } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { api } from "../../api/api";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useFetchWarehouse } from "../../hooks/useFetchWarehouse";
import { useFetchShoe } from "../../hooks/useFetchShoe";
import { useFetchShoeSize } from "../../hooks/useFetchShoeSize";
import { useSelector } from "react-redux";

export default function AddStock(props) {
  const toast = useToast();
  const { shoes } = useFetchShoe("", "", { limit: 99 });
  const { sizes } = useFetchShoeSize();
  const { warehouses } = useFetchWarehouse();
  const [isLoading, setIsLoading] = useState(false);
  const userSelector = useSelector((state) => state.auth);
  const formik = useFormik({
    initialValues: {
      stock: 0,
      shoe_id: "",
      shoe_size_id: "",
      warehouse_id: "",
    },
    validationSchema: Yup.object().shape({
      stock: Yup.number()
        .min(1, "Quantity must be greater than 0")
        .required("stock is required"),
      shoe_id: Yup.number()
        .min(1, "Please select a shoe name")
        .required("Shoe name is required"),
      shoe_size_id: Yup.number()
        .min(1, "Please select a shoe size")
        .required("Shoe size is required"),
      warehouse_id: Yup.number()
        .min(1, "please select warehouse")
        .required("Warehouse Name is required"),
    }),
    onSubmit: async () => {
      setIsLoading(true);
      try {
        const res = await api().post("/stocks", formik.values);
        toast({
          title: res.data.message,
          status: "success",
          position: "top",
        });
        props.fetch();
      } catch (err) {
        toast({
          title: `${err.response.data.message}`,
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
        clearData();
      }
    },
  });
  function inputHandler(e) {
    const { value, id } = e.target;
    formik.setFieldValue(id, value);
  }
  function clearData() {
    formik.resetForm();
    props.onClose();
  }
  return (
    <>
      <Modal scrollBehavior="inside" isOpen={props.isOpen} onClose={clearData}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader p={2}>Add Inventory</ModalHeader>
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
                <Input type="number" placeholder="Quantity"></Input>
                <FormErrorMessage>{formik.errors.stock}</FormErrorMessage>
              </FormControl>

              <FormControl
                mb={2}
                id="shoe_id"
                value={formik.values.shoe_id}
                onChange={inputHandler}
                isInvalid={formik.touched.shoe_id && formik.errors.shoe_id}
              >
                <FormLabel>Shoe:</FormLabel>
                <Select placeholder="Select a Shoe name">
                  {shoes.rows &&
                    shoes?.rows?.map((val, idx) => (
                      <option key={val.id} value={val.id}>
                        {val?.name}
                      </option>
                    ))}
                </Select>
                <FormErrorMessage>{formik.errors.shoe_id}</FormErrorMessage>
              </FormControl>

              <FormControl
                mb={2}
                id="shoe_size_id"
                value={formik.values.shoe_size_id}
                onChange={inputHandler}
                isInvalid={
                  formik.touched.shoe_size_id && formik.errors.shoe_size_id
                }
              >
                <FormLabel>Shoe size:</FormLabel>
                <Select placeholder="Select a shoe size">
                  {sizes &&
                    sizes?.map((val, idx) => (
                      <option key={val.id} value={val.id}>
                        {val?.size}
                      </option>
                    ))}
                </Select>
                <FormErrorMessage>
                  {formik.errors.shoe_size_id}
                </FormErrorMessage>
              </FormControl>

              <FormControl
                mb={2}
                id="warehouse_id"
                value={formik.values.warehouse_id}
                onChange={inputHandler}
                isInvalid={
                  formik.touched.warehouse_id && formik.errors.warehouse_id
                }
              >
                <FormLabel>Warehouse:</FormLabel>
                <Select placeholder="Select Warehouse name">
                  {userSelector.role != "SUPERADMIN" ? (
                    <option value={props?.ware?.id}>{props?.ware?.name}</option>
                  ) : (
                    <>
                      {warehouses &&
                        warehouses?.map((val, idx) => (
                          <option key={val?.name} value={val?.id}>
                            {val?.name}
                          </option>
                        ))}
                    </>
                  )}
                </Select>
                <FormErrorMessage>
                  {formik.errors.warehouse_id}
                </FormErrorMessage>
              </FormControl>
            </form>
          </ModalBody>

          <ModalFooter>
            <Button onClick={clearData}>Cancel</Button>
            <Button
              isLoading={isLoading}
              onClick={() => {
                formik.handleSubmit();
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
