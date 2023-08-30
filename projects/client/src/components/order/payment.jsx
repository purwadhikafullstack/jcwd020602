import { Modal, ModalOverlay, ModalContent } from "@chakra-ui/react";
import { ModalHeader, ModalFooter } from "@chakra-ui/react";
import { ModalBody, ModalCloseButton, Image } from "@chakra-ui/react";
import { Button, Flex, Checkbox, Center,Text } from "@chakra-ui/react";
import { useState } from "react";
import { api } from "../../api/api";
import { useFetchCity, useFetchProv } from "../../hooks/useFetchProvCity";
import { useNavigate } from "react-router-dom";
import mandiriImage from "../../assets/checkOutPage/mandiri.png"

export default function Payment(props) {
  const navigate = useNavigate();
  return (
    <>
      <Modal
        scrollBehavior="inside"
        isOpen={props.isOpen}
        onClose={props.onClose}
        isCentered  
        closeOnOverlayClick={false}  
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader p={2} bg={"black"} color={"white"}>Payment Method</ModalHeader>
          <ModalBody
            display={"flex"}
            gap={2}
            flexDirection={"column"}
          >
            <Flex
              w={"100%"}
              h={"50px"}
            >
              <Center w={"100%"} fontWeight={"bold"}>Manual Transfer</Center>
            </Flex>
            <Flex justify={"space-between"} align={"center"}>
            <Image
        src={mandiriImage}
        alt={"mandiri"}
        w={"150px"}
        h={"100px"}
        objectFit={"contain"}
      />
      <Flex flexDir={"column"}>
        <Text fontWeight={"bold"}>FootHub Inc.</Text>
        <Text fontWeight={"bold"}>0854 1123 2212</Text>

      </Flex>
            </Flex>
          </ModalBody>

          <ModalFooter>
            <Button onClick={() => navigate("/my-account/order-list")}>
              confirm
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
