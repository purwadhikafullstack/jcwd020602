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
          <ModalCloseButton />
          <ModalBody p={0}>
            <Image src={props.image} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
