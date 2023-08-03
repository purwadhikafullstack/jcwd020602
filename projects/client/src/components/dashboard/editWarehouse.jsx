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

export default function EditWarehouse(props) {
  const [isLoading, setIsLoading] = useState(false);
  const { provinces } = useFetchProv();
  const toast = useToast();
  const [warehouse, setWarehouse] = useState({});
  const [provid, setProvid] = useState(0);
  const { cities } = useFetchCity(provid);

  useEffect(() => {
    if (props.id) {
      fetchWarehouseById();
    }
  }, [props.id]);

  const fetchWarehouseById = async () => {
    const res = await api.get("/warehouses/" + props.id);
    setWarehouse(res.data);
    setProvid(res.data.city.province);
  };

  function inputHandler(e) {
    const { id, value } = e.target;
    const temp = { ...warehouse };
    temp[id] = value;
    setWarehouse(temp);
  }

  const updateWarehouse = async () => {
    try {
      const res = await api.patch("/warehouses/" + warehouse.id, warehouse);
      toast({
        title: res.data.message,
        status: "success",
        position: "top",
      });
      props.fetch();
      clearWarehouse();
    } catch (err) {
      console.log(err.response.message);
    }
  };

  const clearWarehouse = () => {
    setWarehouse({});
    props.onClose();
  };
  return (
    <>
      <Modal
        scrollBehavior="inside"
        isOpen={props.isOpen}
        onClose={clearWarehouse}
        closeOnOverlayClick={false}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader p={2}>Edit Warehouse</ModalHeader>
          <ModalCloseButton />
          <ModalBody display={"flex"} flexDir={"column"} gap={2}>
            <Box>
              name:{" "}
              <Input
                id="name"
                type="text"
                onChange={inputHandler}
                defaultValue={warehouse?.name}
              />
              phone:
              <Input
                id="phone"
                type={"number"}
                onChange={inputHandler}
                defaultValue={warehouse?.phone}
              />
            </Box>
            <Box>
              province:
              <Select
                id="province"
                placeholder="choose province.."
                value={warehouse?.city?.province}
                onChange={(e) => {
                  inputHandler(e);
                  setProvid(e.target.value);
                }}
              >
                {provinces &&
                  provinces.map((val, idx) => (
                    <option key={val?.province} value={val?.province}>
                      {val?.province}
                    </option>
                  ))}
              </Select>
            </Box>
            <Box>
              city:
              <Select
                placeholder="choose city.."
                onChange={inputHandler}
                value={warehouse?.city?.city_name}
                id="city"
              >
                {cities &&
                  cities.map((val, idx) => (
                    <option value={val?.city_name}>{val?.city_name}</option>
                  ))}
              </Select>
            </Box>

            <Box>
              address:
              <Textarea
                id="address"
                maxLength={225}
                onChange={inputHandler}
                placeholder="road, district  "
                defaultValue={warehouse?.address}
              />
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
