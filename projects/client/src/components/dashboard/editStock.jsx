import { ModalOverlay, ModalContent, ModalHeader } from "@chakra-ui/react";
import { ModalFooter, ModalBody, ModalCloseButton } from "@chakra-ui/react";
import { Button, Input, Select, useToast, Box, Modal } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { api } from "../../api/api";
import { useFetchWarehouse } from "../../hooks/useFetchWarehouse";
import { useFetchShoe } from "../../hooks/useFetchShoe";
import { useFetchShoeSize } from "../../hooks/useFetchShoeSize";

export default function EditStock(props) {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [stock, setStock] = useState({});

  useEffect(() => {
    if (props.id) {
      fetch();
    }
  }, [props.id]);

  async function fetch() {
    const response = await api.get(`/stocks/${props.id}`);
    setStock(response.data);
  }

  function inputHandler(e) {
    const { id, value } = e.target;
    const temp = { ...stock };
    temp[id] = value;
    setStock(temp);
  }
  function clearData() {
    setStock({});
    props.setId(null);
    props.onClose();
  }
  const updateStock = async () => {
    try {
      const res = await api.patch("/stocks/" + stock.id, stock);
      toast({
        title: res.data.message,
        status: "success",
        position: "top",
      });
      props.fetch();
      clearData();
    } catch (err) {
      console.log(err.response.data);
    }
  };
  return (
    <>
      <Modal scrollBehavior="inside" isOpen={props.isOpen} onClose={clearData}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader p={2}>Edit Stock</ModalHeader>
          <ModalCloseButton />
          <ModalBody display={"flex"} flexDir={"column"} gap={2}>
            <Box>
              stock:{" "}
              <Input
                id="stock"
                type="number"
                onChange={inputHandler}
                defaultValue={stock?.stock}
              />
            </Box>
            <Box>
              shoe:
              <Select
                id="shoe_id"
                onChange={inputHandler}
                value={stock?.shoe_id}
                disabled
              >
                <option key={stock?.Sho?.id} value={stock?.Sho?.id}>
                  {stock?.Sho?.name}
                </option>
              </Select>
            </Box>
            <Box>
              shoe size:
              <Select
                onChange={inputHandler}
                id="shoe_size_id"
                value={stock.shoeSize?.id}
                disabled
              >
                <option key={stock.shoeSize?.id} value={stock.shoeSize?.id}>
                  {stock.shoeSize?.size}
                </option>
              </Select>
            </Box>
            <Box>
              warehouse:
              <Select value={stock.warehouse?.id} disabled>
                <option key={stock.warehouse?.id} value={stock.warehouse?.id}>
                  {stock.warehouse?.name}
                </option>
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
                  updateStock();
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
