import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  Image,
} from "@chakra-ui/react";

export default function ImageModal(props) {
  return (
    <>
      <Modal size={"xl"} isOpen={props.isOpen} onClose={props.onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton bg={"black"} color={"white"} />
          <ModalBody p={0}>
            <Image src={props.image} w={"100%"} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
