import { Modal, ModalOverlay, ModalContent } from "@chakra-ui/react";
import { ModalHeader, ModalFooter } from "@chakra-ui/react";
import { ModalBody, ModalCloseButton, useToast } from "@chakra-ui/react";
import { Button, HStack, Checkbox, Center } from "@chakra-ui/react";
import { useState } from "react";
import { api } from "../../api/api";
import { useFetchCity, useFetchProv } from "../../hooks/useFetchProvCity";
import { useNavigate } from "react-router-dom";

export default function Payment(props) {
  const navigate = useNavigate();
  return (
    <>
      <Modal
        scrollBehavior="inside"
        isOpen={props.isOpen}
        onClose={props.onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader p={2}>Payment Method</ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display={"flex"}
            alignItems={"center"}
            justifyContent={"center"}
            gap={2}
          >
            <HStack
              w={"80%"}
              h={"50px"}
              border={"1px"}
              bgColor={"white"}
              borderRadius={"8px"}
              mt={"10px"}
            >
              <Checkbox px={"25px"}></Checkbox>
              <Center w={"100%"}>Manual</Center>
            </HStack>
          </ModalBody>

          <ModalFooter>
            <Button onClick={() => navigate("/orderListUser")}>confirm</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
