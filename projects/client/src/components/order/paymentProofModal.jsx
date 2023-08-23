import { Modal, ModalOverlay, ModalContent } from "@chakra-ui/react";
import { ModalHeader, ModalFooter, Image } from "@chakra-ui/react";
import { ModalBody, ModalCloseButton, Center } from "@chakra-ui/react";

import { useState } from "react";
import { api } from "../../api/api";
import { useFetchCity, useFetchProv } from "../../hooks/useFetchProvCity";

export default function PaymentProofModal(props) {
  return (
    <>
      <Modal
        scrollBehavior="inside"
        isOpen={props.isOpen}
        onClose={props.onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader p={2}>Payment Proof</ModalHeader>
          <ModalCloseButton />
          <ModalBody display={"flex"} flexDir={"column"} gap={2}>
            <Center>
              <Image
                src={`${process.env.REACT_APP_API_BASE_URL}/${props.val?.payment_proof}`}
                w={"100%"}
                objectFit={"cover"}
                maxW={"300px"}
                maxH={"300px"}
              />
            </Center>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
