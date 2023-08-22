import { DrawerHeader, DrawerOverlay } from "@chakra-ui/react";
import { DrawerContent, AccordionItem } from "@chakra-ui/react";
import { DrawerCloseButton, Accordion, DrawerBody } from "@chakra-ui/react";
import { AccordionButton, AccordionPanel, Drawer } from "@chakra-ui/react";
import { AccordionIcon, Box, Flex, Image } from "@chakra-ui/react";
import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/newlogo.png";
import { useDispatch } from "react-redux";

export default function Sidebar(props) {
  const dispatch = useDispatch();
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
                <AccordionItem
                  className="accordion-item"
                  onClick={props.onClose}
                >
                  <AccordionButton _expanded={{ bg: "black", color: "white" }}>
                    <Box fontWeight={"bold"}>Dashboard</Box>
                  </AccordionButton>
                </AccordionItem>
              </Link>

              <Link to="/product">
                <AccordionItem
                  className="accordion-item"
                  onClick={props.onClose}
                >
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
                    <Box id="asyu" onClick={props.onClose}>
                      Brand
                    </Box>
                  </Link>
                  <Link to="/category">
                    <Box id="asyu" onClick={props.onClose}>
                      Category
                    </Box>
                  </Link>
                  <Link to="/subcategory">
                    <Box id="asyu" onClick={props.onClose}>
                      Subcategory
                    </Box>
                  </Link>
                </AccordionPanel>
              </AccordionItem>

              <Link to="/warehouse">
                <AccordionItem
                  className="accordion-item"
                  onClick={props.onClose}
                >
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
                    <Box id="asyu" onClick={props.onClose}>
                      Stock
                    </Box>
                  </Link>
                  <Link to="/stockHistory">
                    <Box id="asyu" onClick={props.onClose}>
                      Stock History
                    </Box>
                  </Link>
                  <Link to="/stockMutation">
                    <Box id="asyu" onClick={props.onClose}>
                      Stock Mutation
                    </Box>
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
                  <Link to="/orderList">
                    <Box id="asyu">Order List</Box>
                  </Link>
                  <Link to="/salesReport">
                    <Box id="asyu">Sales Report</Box>
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

              <AccordionItem
                className="accordion-item"
                onClick={() => {
                  localStorage.removeItem("user");
                  dispatch({
                    type: "logout",
                  });
                  props.onClose();
                }}
              >
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
