import { Modal, ModalOverlay, ModalContent } from "@chakra-ui/react";
import { ModalHeader, ModalFooter } from "@chakra-ui/react";
import { ModalBody, ModalCloseButton, useToast } from "@chakra-ui/react";
import { Button, Input, Textarea, Select, Box } from "@chakra-ui/react";
import { useState } from "react";
import { api } from "../../api/api";
import { useFetchCity, useFetchProv } from "../../hooks/useFetchProvCity";

export default function AddWarehouse(props) {
  const { provinces } = useFetchProv();
  const [province_id, setProvince_id] = useState(0);
  const { cities } = useFetchCity(province_id);
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [warehouse, setWarehouse] = useState({
    name: "",
    phone: "",
    city_id: "",
    address: "",
  });

  function inputHandler(e) {
    const { id, value } = e.target;
    const temp = { ...warehouse };
    temp[id] = value;
    setWarehouse(temp);
  }

  const uploadWarehouse = async () => {
    try {
      const res = await api().post("/warehouses", warehouse);
      toast({
        title: res.data.message,
        status: "success",
        position: "top",
      });
      props.fetch();
      clearData();
    } catch (err) {
      clearData();
    }
  };

  const clearData = () => {
    setWarehouse({ name: "", phone: "", city_id: "", address: "" });
    setProvince_id(null);
    props.onClose();
  };

  return (
    <>
      <Modal scrollBehavior="inside" isOpen={props.isOpen} onClose={clearData}>
        <ModalOverlay />
        <ModalContent mx={2}>
          <ModalHeader p={2}>Add Warehouse</ModalHeader>
          <ModalCloseButton />
          <ModalBody display={"flex"} flexDir={"column"} gap={4}>
            <Box
              className={`inputbox ${warehouse.name ? "input-has-value" : ""}`}
            >
              <Input id="name" onChange={inputHandler} />
              <label>Name</label>
            </Box>
            <Box
              className={`inputbox ${warehouse.phone ? "input-has-value" : ""}`}
            >
              <Input id="phone" onChange={inputHandler} type="number" />
              <label>Phone</label>
            </Box>
            <Box
              className={`inputbox ${
                warehouse.address ? "input-has-value" : ""
              }`}
            >
              <Input id="address" onChange={inputHandler} />
              <label>Address</label>
            </Box>
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
            <Box
              className={`inputbox ${
                warehouse.city_id ? "input-has-value" : ""
              }`}
            >
              <Select
                placeholder="         "
                onChange={inputHandler}
                id="city_id"
                value={warehouse.city_id}
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
          </ModalBody>

          <ModalFooter>
            <Button
              isDisabled={
                !(
                  warehouse.name &&
                  warehouse.phone &&
                  warehouse.address &&
                  warehouse.city_id
                )
                  ? true
                  : false
              }
              isLoading={isLoading}
              onClick={() => {
                setIsLoading(true);
                setTimeout(() => {
                  setIsLoading(false);
                  uploadWarehouse();
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
