import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Image,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  Flex,
} from "@chakra-ui/react";
import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/newlogo.png";

export default function Sidebar(props) {
  return (
    <>
      <Drawer isOpen={props.isOpen} placement={"left"} onClose={props.onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader p={1} borderBottom={"1px"}>
            <Image src={logo} w={"150px"} />
          </DrawerHeader>
          <DrawerBody p={0}>
            <Accordion allowToggle className="Accordion">
              <Link to="/dashboard">
                <AccordionItem className="accordion-item">
                  <AccordionButton _expanded={{ bg: "black", color: "white" }}>
                    <Box fontWeight={"bold"}>Dashboard</Box>
                  </AccordionButton>
                </AccordionItem>
              </Link>

              <Link to="/product">
                <AccordionItem className="accordion-item">
                  <AccordionButton _expanded={{ bg: "black", color: "white" }}>
                    <Box fontWeight={"bold"}>Product</Box>
                  </AccordionButton>
                </AccordionItem>
              </Link>

              <AccordionItem className="accordion-item">
                <AccordionButton _expanded={{ bg: "black", color: "white" }}>
                  <Flex
                    as="span"
                    flex="1"
                    fontWeight={"bold"}
                    alignItems={"center"}
                    gap={2}
                  >
                    <Box>Categories</Box>
                  </Flex>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel display={"flex"} flexDir={"column"} p={0}>
                  <Link to="/brand">
                    <Box id="asyu">Brand</Box>
                  </Link>
                  <Link to="/category">
                    <Box id="asyu">Category</Box>
                  </Link>
                  <Link to="/subcategory">
                    <Box id="asyu">Subcategory</Box>
                  </Link>
                </AccordionPanel>
              </AccordionItem>

              <Link to="/warehouse">
                <AccordionItem className="accordion-item">
                  <AccordionButton _expanded={{ bg: "black", color: "white" }}>
                    <Box fontWeight={"bold"}>Warehouse</Box>
                  </AccordionButton>
                </AccordionItem>
              </Link>

              <AccordionItem className="accordion-item">
                <AccordionButton _expanded={{ bg: "black", color: "white" }}>
                  <Flex
                    as="span"
                    flex="1"
                    fontWeight={"bold"}
                    alignItems={"center"}
                    gap={2}
                  >
                    <Box>Inventory</Box>
                  </Flex>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel display={"flex"} flexDir={"column"} p={0}>
                  <Link to="/stock">
                    <Box id="asyu">Stock</Box>
                  </Link>
                  <Link to="/stockHistory">
                    <Box id="asyu">Stock History</Box>
                  </Link>
                  <Link to="/stockMutation">
                    <Box id="asyu">Stock Mutation</Box>
                  </Link>
                </AccordionPanel>
              </AccordionItem>

              <AccordionItem className="accordion-item">
                <AccordionButton _expanded={{ bg: "black", color: "white" }}>
                  <Flex
                    as="span"
                    flex="1"
                    fontWeight={"bold"}
                    alignItems={"center"}
                    gap={2}
                  >
                    <Box>Report</Box>
                  </Flex>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel display={"flex"} flexDir={"column"} p={0}>
                  <Link to="/">
                    <Box id="asyu">blala</Box>
                  </Link>
                  <Link to="/">
                    <Box id="asyu">blabla</Box>
                  </Link>
                  <Link to="/">
                    <Box id="asyu">blabla</Box>
                  </Link>
                </AccordionPanel>
              </AccordionItem>

              <Link to="/usersettings">
                <AccordionItem className="accordion-item">
                  <AccordionButton _expanded={{ bg: "black", color: "white" }}>
                    <Box fontWeight={"bold"}>User Settings</Box>
                  </AccordionButton>
                </AccordionItem>
              </Link>

              <AccordionItem className="accordion-item">
                <AccordionButton _expanded={{ bg: "black", color: "white" }}>
                  <Box fontWeight={"bold"}>Log out</Box>
                </AccordionButton>
              </AccordionItem>
            </Accordion>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}
