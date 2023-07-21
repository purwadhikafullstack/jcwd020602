import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Input,
  Textarea,
  Select,
  useToast,
  Box,
} from "@chakra-ui/react";
import { useState } from "react";
import { api } from "../../api/api";
import { useFetchCity, useFetchProv } from "../../hooks/useFetchProvCity";

export default function EditWarehouse(props) {
  const [isLoading, setIsLoading] = useState(false);
  const { provinces } = useFetchProv();
  const [provid, setProvid] = useState(0);
  const { cities } = useFetchCity(provid);
  const toast = useToast();
  const [warehouse, setWarehouse] = useState({
    ...props.data,
  });

  function inputHandler(e) {
    const { id, value } = e.target;
    const temp = { ...warehouse };
    temp[id] = value;
    setWarehouse(temp);
  }

  const updateWarehouse = async () => {
    await api
      .patch("/warehouses/" + warehouse.id, warehouse)
      .then((res) => {
        toast({
          title: res.data.message,
          status: "success",
          position: "top",
        });
        props.fetch();
        props.onClose();
      })
      .catch((err) => console.log(err));
  };
  return (
    <>
      <Modal
        scrollBehavior="inside"
        isOpen={props.isOpen}
        onClose={props.onClose}
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
                defaultValue={warehouse.name}
              />
              phone:
              <Input
                id="phone"
                type={"number"}
                onChange={inputHandler}
                defaultValue={warehouse.phone}
              />
            </Box>
            <Box>
              province:
              <Select
                id="province"
                placeholder="choose province.."
                onChange={(e) => {
                  inputHandler(e);
                  setProvid(e.target.value);
                }}
              >
                {provinces &&
                  provinces.map((val, idx) => (
                    <option value={val.province}>{val.province}</option>
                  ))}
              </Select>
            </Box>
            <Box>
              city:
              <Select
                placeholder="choose city.."
                onChange={inputHandler}
                id="city"
              >
                {cities &&
                  cities.map((val, idx) => (
                    <option value={val.city_id}>{val.city_name}</option>
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
                defaultValue={warehouse.address}
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
