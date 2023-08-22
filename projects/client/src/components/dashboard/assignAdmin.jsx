import { ModalOverlay, ModalContent, ModalHeader } from "@chakra-ui/react";
import { ModalFooter, ModalBody, ModalCloseButton } from "@chakra-ui/react";
import { Button, Select, Box, useToast, Flex, Modal } from "@chakra-ui/react";
import { useFetchWarehouse } from "../../hooks/useFetchWarehouse";
import { useState } from "react";
import { api } from "../../api/api";

export default function AssignAdmin(props) {
  const toast = useToast();
  const { warehouses, fetch } = useFetchWarehouse();
  const [isLoading, setIsLoading] = useState(false);
  const [warehouse_id, setWarehouse_id] = useState(0);
  const user_id = props.id;

  const assignAdmin = async () => {
    try {
      const res = await api().post("/warehouses/admin/" + user_id, {
        warehouse_id,
      });
      toast({
        title: res.data.message,
        status: "success",
        position: "top",
      });
      props.fetch();
      fetch();
      props.onClose();
      setWarehouse_id(0);
    } catch (err) {
      console.log(err.response.data);
    }
  };

  return (
    <>
      <Modal isOpen={props.isOpen} onClose={props.onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Assign Admin</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box>
              Warehouse:
              <Select
                id="warehouse_id"
                placeholder="choose warehouse.."
                onChange={(e) => setWarehouse_id(e.target.value)}
              >
                {warehouses &&
                  warehouses.map((val, idx) => (
                    <option key={val.id} value={val.id}>
                      {val.name}
                    </option>
                  ))}
              </Select>
            </Box>
          </ModalBody>

          <ModalFooter>
            <Button
              isLoading={isLoading}
              onClick={() => {
                setIsLoading(true);
                setTimeout(() => {
                  setIsLoading(false);
                  assignAdmin();
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

export function ReassignAdmin(props) {
  const toast = useToast();
  const { warehouses, fetch } = useFetchWarehouse();
  const [isLoading, setIsLoading] = useState(false);
  const [warehouse_id, setWarehouse_id] = useState(0);
  const user_id = props.id;

  const reassignAdmin = async () => {
    try {
      const res = await api().patch("/warehouses/admin/" + user_id, {
        warehouse_id,
      });
      toast({
        title: res.data.message,
        status: "success",
        position: "top",
      });
      props.fetch();
      fetch();
      props.onClose();
      setWarehouse_id(0);
    } catch (err) {
      console.log(err.response.data);
    }
  };

  const unassignAdmin = async () => {
    try {
      const res = await api().delete("/warehouses/admin/" + user_id);
      toast({
        title: res.data.message,
        status: "success",
        position: "top",
      });
      props.fetch();
      fetch();
      props.onClose();
      setWarehouse_id(0);
    } catch (err) {
      console.log(err.response.data);
    }
  };

  return (
    <>
      <Modal isOpen={props.isOpen} onClose={props.onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Reassign Admin</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box>
              Warehouse:
              <Select
                id="warehouse_id"
                placeholder="choose warehouse.."
                onChange={(e) => setWarehouse_id(e.target.value)}
              >
                {warehouses &&
                  warehouses.map((val, idx) => (
                    <option key={val.id} value={val.id}>
                      {val.name}
                    </option>
                  ))}
              </Select>
            </Box>
          </ModalBody>
          <ModalFooter>
            <Flex justify={"space-between"} w={"100%"}>
              <Button
                isLoading={isLoading}
                onClick={() => {
                  setIsLoading(true);
                  setTimeout(() => {
                    setIsLoading(false);
                    unassignAdmin();
                  }, 2000);
                }}
              >
                unassign
              </Button>
              <Button
                isLoading={isLoading}
                onClick={() => {
                  setIsLoading(true);
                  setTimeout(() => {
                    setIsLoading(false);
                    reassignAdmin();
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
