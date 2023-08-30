import {
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
} from "@chakra-ui/react";
import { Box, ModalBody, ModalCloseButton, Modal } from "@chakra-ui/react";
import { Button, Input, Textarea, Select, useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { api } from "../../api/api";
import { useFetchCity, useFetchProv } from "../../hooks/useFetchProvCity";

export default function EditWarehouse({ data, fetch, isOpen, onClose }) {
  const [isLoading, setIsLoading] = useState(false);
  const { provinces } = useFetchProv();
  const toast = useToast({ duration: 3000, isClosable: true, position: "top" });
  const [warehouse, setWarehouse] = useState({});
  const [provid, setProvid] = useState(0);
  const { cities } = useFetchCity(provid || data?.city?.province_id);

  useEffect(() => {
    if (data) {
      setWarehouse(data);
      setProvid(data?.city?.province_id);
    }
  }, [data]);

  function inputHandler(e) {
    const { id, value } = e.target;
    const temp = { ...warehouse };
    temp[id] = value;
    setWarehouse(temp);
  }

  const updateWarehouse = async () => {
    try {
      const res = await api().patch("/warehouses/" + warehouse.id, warehouse);
      toast({
        title: res.data.message,
        status: "success",
      });
      fetch();
      onClose();
    } catch (err) {}
  };

  return (
    <>
      <Modal
        scrollBehavior="inside"
        isOpen={isOpen}
        onClose={onClose}
        closeOnOverlayClick={false}
      >
        <ModalOverlay />
        <ModalContent mx={2}>
          <ModalHeader p={2}>Edit Warehouse</ModalHeader>
          <ModalCloseButton />
          <ModalBody display={"flex"} flexDir={"column"} gap={4}>
            <Box
              className={`inputbox ${warehouse.name ? "input-has-value" : ""}`}
            >
              <Input
                id="name"
                type="text"
                onChange={inputHandler}
                value={warehouse?.name}
              />
              <label>Name</label>
            </Box>
            <Box
              className={`inputbox ${warehouse.phone ? "input-has-value" : ""}`}
            >
              <Input
                id="phone"
                type={"number"}
                onChange={inputHandler}
                value={warehouse?.phone}
              />
              <label>Phone</label>
            </Box>
            <Box
              className={`inputbox ${
                warehouse.address ? "input-has-value" : ""
              }`}
            >
              <Input
                id="address"
                onChange={inputHandler}
                value={warehouse.address}
              />
              <label>Address</label>
            </Box>

            <Box className={`inputbox ${provid ? "input-has-value" : ""}`}>
              <Select
                id="province"
                placeholder="          "
                onChange={(e) => {
                  inputHandler(e);
                  setProvid(e.target.value);
                }}
              >
                {provinces &&
                  provinces.map((val, idx) =>
                    warehouse?.city?.province_id != val.province_id ? (
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
            <Box
              className={`inputbox ${
                warehouse.city_id ? "input-has-value" : ""
              }`}
            >
              <Select
                placeholder="         "
                onChange={inputHandler}
                value={warehouse?.city_id}
                id="city_id"
              >
                {cities &&
                  cities.map((val, idx) => (
                    <option key={val.city_id} value={val?.city_id}>
                      {val.type} {val?.city_name}
                    </option>
                  ))}
              </Select>
              <label>City</label>
            </Box>
          </ModalBody>

          <ModalFooter>
            <Button
              isLoading={isLoading}
              onClick={() => {
                setIsLoading(true);
                setTimeout(() => {
                  setIsLoading(false);
                  updateWarehouse();
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
