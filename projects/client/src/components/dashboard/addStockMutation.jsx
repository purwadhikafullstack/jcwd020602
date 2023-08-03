import {
  FormControl,
  FormLabel,
  useToast,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
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
  Input,
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
        .required("quantity is required"),
      stock_id: Yup.number()
        .min(1, "Please select a product name")
        .required("Product name is required"),
    }),
    onSubmit: async () => {
      const resPostMutation = await api
        .post("/stockMutations", formik.values)
        .catch((err) => {
          toast({
            title: `${err.response.data.message}`,
            status: "error",
            duration: 9000,
            isClosable: true,
          });
        });
      toast({
        title: resPostMutation.data.message,
        status: "success",
        position: "top",
      });
      props.fetch();
      formik.resetForm();
      props.setShown({ page: 1 });
      props.onClose();
    },
  });
  const { stocks } = useFetchFromStock(formik.values.from_warehouse_id);
  function inputHandler(e) {
    const { value, id } = e.target;
    formik.setFieldValue(id, value);
  }

  return (
    <>
      <Modal
        scrollBehavior="inside"
        isOpen={props.isOpen}
        onClose={props.onClose}
      >
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
                <FormLabel>Quantity</FormLabel>
                <NumberInput min={1}>
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
                    warehouses.map((val, idx) => (
                      <option key={val.name} value={val.id}>
                        {val.name}
                      </option>
                    ))}
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
                    <option value={props.ware.id}>{props.ware.name}</option>
                  ) : (
                    <>
                      {warehouses &&
                        warehouses.map((val, idx) => (
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

          <ModalFooter>
            <Flex gap={5}>
              <Button
                colorScheme="red"
                onClick={() => {
                  props.onClose();
                  formik.resetForm();
                }}
              >
                Cancel
              </Button>
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
