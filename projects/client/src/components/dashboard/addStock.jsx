import { ModalFooter, ModalBody, ModalCloseButton } from "@chakra-ui/react";
import { Button, Input, Select, Box, useToast, Modal } from "@chakra-ui/react";
import { ModalOverlay, ModalContent, ModalHeader } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { api } from "../../api/api";
import { useFetchWarehouse } from "../../hooks/useFetchWarehouse";
import { useFetchShoe } from "../../hooks/useFetchShoe";
import { useFetchShoeSize } from "../../hooks/useFetchShoeSize";
import { useSelector } from "react-redux";

export default function AddStock(props) {
  const toast = useToast();
  const { shoes } = useFetchShoe();
  const { sizes } = useFetchShoeSize();
  const { warehouses } = useFetchWarehouse();
  const [isLoading, setIsLoading] = useState(false);
  const userSelector = useSelector((state) => state.auth);
  const [stock, setStock] = useState({
    stock: "",
    shoe_id: "",
    shoe_size_id: "",
    warehouse_id: "",
  });
  function inputHandler(e) {
    const { id, value } = e.target;
    const temp = { ...stock };
    temp[id] = value;
    setStock(temp);
  }

  const uploadStock = async () => {
    try {
      const res = await api.post("/stocks", stock);
      toast({
        title: res.data.message,
        status: "success",
        position: "top",
      });
      props.setShown({ page: 1 });
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
          <ModalHeader p={2}>Add Inventory</ModalHeader>
          <ModalCloseButton />
          <ModalBody display={"flex"} flexDir={"column"} gap={2}>
            <Box>
              stock: <Input id="stock" type="number" onChange={inputHandler} />
            </Box>
            <Box>
              shoe:
              <Select
                id="shoe_id"
                placeholder="choose shoe.."
                onChange={(e) => {
                  inputHandler(e);
                }}
              >
                {shoes &&
                  shoes.map((val, idx) => (
                    <option key={val.id} value={val.id}>
                      {val.name}
                    </option>
                  ))}
              </Select>
            </Box>
            <Box>
              shoe size:
              <Select
                placeholder="choose size.."
                onChange={inputHandler}
                id="shoe_size_id"
              >
                {sizes &&
                  sizes.map((val, idx) => (
                    <option key={val.id} value={val.id}>
                      {val.size}
                    </option>
                  ))}
              </Select>
            </Box>
            <Box>
              warehouse:
              <Select
                placeholder="choose warehouse.."
                onChange={inputHandler}
                id="warehouse_id"
              >
                {userSelector.role != "SUPERADMIN" ? (
                  <option value={props.ware.id}>{props.ware.name}</option>
                ) : (
                  <>
                    {warehouses &&
                      warehouses.map((val, idx) => (
                        <option key={val.name} value={val.id}>
                          {val.name}
                        </option>
                      ))}
                  </>
                )}
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
                  uploadStock();
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
