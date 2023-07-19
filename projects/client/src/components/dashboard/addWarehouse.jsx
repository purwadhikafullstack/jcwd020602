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
  Box,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { api } from "../../api/api";
import { useFetchCity, useFetchProv } from "../../hooks/useFetchProvCity";

export default function AddWarehouse(props) {
  const { provinces } = useFetchProv();
  const [provid, setProvid] = useState(0);
  const { cities } = useFetchCity(provid);
  console.log(provid);
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [warehouse, setWarehouse] = useState({
    name: "",
    phone: "",
    province: "",
    city: "",
    address: "",
  });

  function inputHandler(e) {
    const { id, value } = e.target;
    const temp = { ...warehouse };
    temp[id] = value;
    setWarehouse(temp);
  }

  const uploadWarehouse = async () => {
    await api
      .post("/warehouses", warehouse)
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
          <ModalHeader p={2}>Add Warehouse</ModalHeader>
          <ModalCloseButton />
          <ModalBody display={"flex"} flexDir={"column"} gap={2}>
            <Box>
              name: <Input id="name" type="text" onChange={inputHandler} />
            </Box>
            <Box>
              phone:
              <Input id="phone" type={"number"} onChange={inputHandler} />
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
                    <option key={val.province_id} value={val.province}>
                      {val.province}
                    </option>
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
                    <option key={val.city_id} value={val.city_name}>
                      {val.city_name}
                    </option>
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
