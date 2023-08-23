import { Modal, ModalOverlay, ModalContent } from "@chakra-ui/react";
import { ModalHeader, ModalFooter } from "@chakra-ui/react";
import { ModalBody, ModalCloseButton, useToast } from "@chakra-ui/react";
import { Button, Input, Textarea, Select, Box } from "@chakra-ui/react";
import { useState } from "react";
import { api } from "../../api/api";
import { useFetchCity, useFetchProv } from "../../hooks/useFetchProvCity";

export default function AddAddressCheckOut(props) {
  const { provinces } = useFetchProv();
  const [province_id, setProvince_id] = useState(0);
  const { cities } = useFetchCity(province_id);
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [address, setAddress] = useState({
    title: "",
    name: "",
    phone: "",
    address: "",
    address_details: "",
    province_id: 0,
    city_id: 0,
  });

  function inputHandler(e) {
    const { id, value } = e.target;
    const temp = { ...address };
    temp[id] = value;
    setAddress(temp);
  }

  const addAddress = async () => {
    const token = JSON.parse(localStorage.getItem("user"));
    try {
      const res = await api().post("/checkOuts", address, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast({
        title: res.data.message,
        status: "success",
        position: "top",
      });
      props.fetch();
      props.onClose();
    } catch (err) {
      console.log(err.response.data);
    }
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
          <ModalHeader p={2}>Add Address</ModalHeader>
          <ModalCloseButton />
          <ModalBody display={"flex"} flexDir={"column"} gap={2}>
            <Box>
              Selected as:{" "}
              <Input
                id="title"
                type="text"
                onChange={inputHandler}
                placeholder="home, Office, etc"
              />
            </Box>
            <Box>
              name: <Input id="name" type="text" onChange={inputHandler} />
            </Box>
            <Box>
              phone:
              <Input
                id="phone"
                type={"number"}
                onChange={inputHandler}
                placeholder="08288888888"
              />
            </Box>
            <Box>
              province:
              <Select
                id="province"
                placeholder="choose province.."
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
            </Box>
            <Box>
              city:
              <Select
                placeholder="choose city.."
                onChange={inputHandler}
                id="city_id"
              >
                {cities &&
                  cities.map((val, idx) => (
                    <option key={val.city_id} value={val.city_id}>
                      {val.type} {val.city_name}
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
            <Box>
              address details:
              <Textarea id="address_details" onChange={inputHandler} />
            </Box>
          </ModalBody>

          <ModalFooter>
            <Button
              isLoading={isLoading}
              onClick={() => {
                setIsLoading(true);
                setTimeout(() => {
                  setIsLoading(false);
                  addAddress();
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
