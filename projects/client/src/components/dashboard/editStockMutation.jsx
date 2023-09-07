import {
  FormErrorMessage,
  ModalOverlay,
  Flex,
  Box,
  Input,
} from "@chakra-ui/react";
import { ModalContent, FormControl, ModalHeader } from "@chakra-ui/react";
import { NumberInputField, ModalCloseButton } from "@chakra-ui/react";
import { Button, Select, Modal, NumberInput } from "@chakra-ui/react";
import { ModalFooter, FormLabel, ModalBody } from "@chakra-ui/react";
import { useFetchWarehouse } from "../../hooks/useFetchWarehouse";
import { useFetchFromStock } from "../../hooks/useFetchStock";
import { useToast, Center, Spinner } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { api } from "../../api/api";
import { useFormik } from "formik";
import * as Yup from "yup";
export default function EditStockMutation(props) {
  const toast = useToast();
  const { warehouses } = useFetchWarehouse();
  const [isLoadingButton, setIsLoadingButton] = useState(false);
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
      setIsLoadingButton(true);
      try {
        const resPostMutation = await api().patch(
          `/stockMutations/${props.id}`,
          {
            to_warehouse_id: formik.values.to_warehouse_id,
            qty: formik.values.qty,
            stock_id: formik.values.stock_id,
          }
        );
        toast({
          title: resPostMutation.data.message,
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
        setIsLoadingButton(false);
        clearData();
      }
    },
  });
  function clearData() {
    formik.resetForm();
    props.setId(null);
    setMaxStock(0);
    props.onClose();
  }
  useEffect(() => {
    if (props.id) {
      setIsLoading(true);
      fetch();
    }
  }, [props.id]);
  useEffect(() => {
    setIsLoading(false);
  }, [formik.values]);
  async function fetch() {
    try {
      const response = await api().get(`/stockMutations/${props.id}`);
      formik.setValues(response?.data?.stockMutation);
    } catch (error) {
      formik.setValues(formik.initialValues);
    }
  }
  const { stocks } = useFetchFromStock(formik.values.from_warehouse_id);
  function inputHandler(e) {
    const { value, id } = e.target;
    formik.setFieldValue(id, value);
  }
  useEffect(() => {
    if (stocks?.length) {
      setMaxStock(
        stocks?.find((val) => val?.id == formik?.values?.stock_id)?.stock
      );
    }
  }, [stocks, formik.values.stock_id]);
  return (
    <>
      <Modal scrollBehavior="inside" isOpen={props.isOpen} onClose={clearData}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader p={2}>Stock Mutation Form</ModalHeader>
          <ModalCloseButton />
          {isLoading ? (
            <Center w={"100%"} h={"100%"}>
              <Spinner />
            </Center>
          ) : (
            <ModalBody display={"flex"} flexDir={"column"} gap={2}>
              <form onSubmit={formik.handleSubmit}>
                <FormControl
                  mb={2}
                  id="qty"
                  value={formik.values.qty}
                  onChange={inputHandler}
                  isInvalid={formik.touched.qty && formik.errors.qty}
                >
                  <FormLabel display={"flex"} gap={"5px"} alignItems={"center"}>
                    Quantity
                    <Box
                      fontSize={"xs"}
                      color={"blackAlpha.700"}
                      textAlign={"center"}
                    >
                      (Stock available: {maxStock || "Select a stock"})
                    </Box>
                  </FormLabel>
                  <Input
                    min={1}
                    value={formik.values.qty}
                    placeholder="Quantity"
                  />
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
                  <Select
                    placeholder="Select Warehouse name"
                    key={formik.values.from_warehouse_id}
                    defaultValue={formik.values.from_warehouse_id}
                  >
                    {warehouses &&
                      warehouses.map((val, idx) => {
                        return (
                          val?.id != formik.values.to_warehouse_id && (
                            <option key={val.id} value={val.id}>
                              {val.name}
                            </option>
                          )
                        );
                      })}
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
                  <FormLabel>Stock Type:</FormLabel>
                  <Select
                    placeholder="Select Stock Type"
                    key={formik.values.stock_id}
                    defaultValue={formik.values.stock_id}
                  >
                    {stocks.length &&
                      stocks.map((val) => {
                        if (val.id == formik.values.stock_id) {
                          return (
                            <option key={val?.id} value={val?.id} selected>
                              {val?.Sho?.name}-{val?.shoeSize?.size}-
                              {val?.Sho?.brand?.name}
                            </option>
                          );
                        } else if (val.stock > 0) {
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
                  <Select
                    placeholder="Select Warehouse name"
                    key={formik.values.to_warehouse_id}
                    value={formik.values.to_warehouse_id}
                    disabled
                  >
                    {userSelector.role != "SUPERADMIN" ? (
                      <option value={props?.ware?.id} selected>
                        {props?.ware?.name}
                      </option>
                    ) : (
                      <>
                        {warehouses &&
                          warehouses.map((val) => (
                            <option key={val.id} value={val.id}>
                              {val.name}
                            </option>
                          ))}
                      </>
                    )}
                  </Select>
                  <FormErrorMessage>
                    {formik.errors.to_warehouse_id}
                  </FormErrorMessage>
                </FormControl>
              </form>
            </ModalBody>
          )}
          <ModalFooter>
            <Flex gap={5}>
              <Button isLoading={isLoadingButton} onClick={clearData}>
                Cancel
              </Button>
              <Button
                isLoading={isLoadingButton}
                onClick={() => {
                  formik.handleSubmit();
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
