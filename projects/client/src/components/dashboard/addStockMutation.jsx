import {
  FormControl,
  FormLabel,
  useToast,
  NumberInput,
  NumberInputField,
  Flex,
  Button,
  FormErrorMessage,
  Select,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  Box,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { api } from "../../api/api";
import { useFetchWarehouse } from "../../hooks/useFetchWarehouse";
import { useSelector } from "react-redux";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useFetchFromStock } from "../../hooks/useFetchStock";

export default function AddStockMutation(props) {
  const toast = useToast();
  const { warehouses } = useFetchWarehouse();
  const [isLoading, setIsLoading] = useState(false);
  const [maxStock, setMaxStock] = useState();
  const userSelector = useSelector((state) => state.auth);
  const formik = useFormik({
    initialValues: {
      from_warehouse_id: "",
      to_warehouse_id: "",
      qty: 1,
      stock_id: "",
    },
    validationSchema: Yup.object().shape({
      from_warehouse_id: Yup.number()
        .min(1, "please select warehouse")
        .required("Warehouse Name is required"),
      to_warehouse_id: Yup.number()
        .min(1, "please select warehouse")
        .required("Warehouse Name is required"),
      qty: Yup.number()
        .min(1, "Quantity must be greater than 0")
        .max(maxStock || 0, "Stock insuficient")
        .required("quantity is required"),
      stock_id: Yup.number()
        .min(1, "Please select a product name")
        .required("Product name is required"),
    }),
    onSubmit: async () => {
      try {
        delete formik.values.from_warehouse_id;
        const resPostMutation = await api().post(
          "/stockMutations",
          formik.values
        );
        toast({
          title: resPostMutation.data.message,
          status: "success",
          position: "top",
        });
        props.fetch();
        clearData();
      } catch (err) {
        toast({
          title: `${err.response.data.message}`,
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      }
    },
  });
  const { stocks } = useFetchFromStock(formik.values.from_warehouse_id);
  function inputHandler(e) {
    const { value, id } = e.target;
    formik.setFieldValue(id, value);
  }
  useEffect(() => {
    if (formik?.values?.stock_id) {
      setMaxStock(
        stocks.find((val) => val?.id == formik?.values?.stock_id)?.stock
      );
    }
  }, [formik.values.stock_id]);
  function clearData() {
    formik.resetForm();
    setMaxStock(0);
    props.onClose();
  }

  return (
    <>
      <Modal scrollBehavior="inside" isOpen={props.isOpen} onClose={clearData}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader p={2}>Stock Mutation Form</ModalHeader>
          <ModalCloseButton />
          <ModalBody display={"flex"} flexDir={"column"} gap={2}>
            <form onSubmit={formik.handleSubmit}>
              <FormControl
                mb={2}
                id="qty"
                value={formik.values.qty}
                onChange={inputHandler}
                isInvalid={formik.touched.qty && formik.errors.qty}
              >
                <FormLabel display={"flex"} gap={"3px"} alignItems={"center"}>
                  Quantity
                  <Box
                    fontSize={"xs"}
                    color={"blackAlpha.700"}
                    textAlign={"center"}
                  >
                    (Stock available: {maxStock || "Select a stock"})
                  </Box>
                </FormLabel>
                <NumberInput>
                  <NumberInputField placeholder="Qty" />
                </NumberInput>
                <FormErrorMessage>{formik.errors.qty}</FormErrorMessage>
              </FormControl>

              <FormControl
                mb={2}
                id="from_warehouse_id"
                value={formik.values.from_warehouse_id}
                onChange={inputHandler}
                isInvalid={
                  formik.touched.from_warehouse_id &&
                  formik.errors.from_warehouse_id
                }
              >
                <FormLabel>Select Supplying Warehouse Name:</FormLabel>
                <Select placeholder="Select Warehouse name">
                  {warehouses &&
                    warehouses.map(
                      (val, idx) =>
                        val?.id != formik.values.to_warehouse_id && (
                          <option key={val.id} value={val.id}>
                            {val.name}
                          </option>
                        )
                    )}
                </Select>
                <FormErrorMessage>
                  {formik.errors.from_warehouse_id}
                </FormErrorMessage>
              </FormControl>

              <FormControl
                mb={2}
                id="stock_id"
                value={formik.values.stock_id}
                onChange={inputHandler}
                isInvalid={formik.touched.stock_id && formik.errors.stock_id}
              >
                <FormLabel display={"flex"} gap={"3px"} alignItems={"center"}>
                  Stock Type:
                  <Box
                    fontSize={"xs"}
                    color={"blackAlpha.700"}
                    textAlign={"center"}
                  >
                    {!formik.values.from_warehouse_id &&
                      `(select supplying warehouse first)`}
                  </Box>
                </FormLabel>
                <Select placeholder="Select Stock Type">
                  {stocks.length &&
                    stocks.map((val) => {
                      if (val.stock > 0) {
                        return (
                          <option key={val?.id} value={val?.id}>
                            {val?.Sho?.name}-{val?.shoeSize?.size}-
                            {val?.Sho?.brand?.name}
                          </option>
                        );
                      } else {
                        return (
                          <option key={val?.id} value={val?.id} disabled>
                            {val?.Sho?.name}-{val?.shoeSize?.size}-
                            {val?.Sho?.brand?.name}- Out of Stock
                          </option>
                        );
                      }
                    })}
                </Select>
                <FormErrorMessage>{formik.errors.stock_id}</FormErrorMessage>
              </FormControl>

              <FormControl
                mb={2}
                id="to_warehouse_id"
                value={formik.values.to_warehouse_id}
                onChange={inputHandler}
                isInvalid={
                  formik.touched.to_warehouse_id &&
                  formik.errors.to_warehouse_id
                }
              >
                <FormLabel>Select to Warehouse Name</FormLabel>
                <Select placeholder="Select Warehouse name">
                  {userSelector.role != "SUPERADMIN" ? (
                    <option value={props?.ware?.id}>{props?.ware?.name}</option>
                  ) : (
                    <>
                      {warehouses &&
                        warehouses.map(
                          (val, idx) =>
                            val?.id != formik.values.from_warehouse_id && (
                              <option key={val.id} value={val.id}>
                                {val.name}
                              </option>
                            )
                        )}
                    </>
                  )}
                </Select>
                <FormErrorMessage>
                  {formik.errors.to_warehouse_id}
                </FormErrorMessage>
              </FormControl>
            </form>
          </ModalBody>

          <ModalFooter>
            <Flex gap={5}>
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
            </Flex>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
