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
  Avatar,
  Flex,
} from "@chakra-ui/react";
import logo from "../../assets/newlogo.png";
import { useFetchCategory } from "../../hooks/useFetchCategory";
import { useFetchBrand } from "../../hooks/useFetchBrand";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function SideMenu(props) {
  const { categories } = useFetchCategory();
  const { brands } = useFetchBrand();
  const userSelector = useSelector((state) => state.auth);
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
              {userSelector.name ? (
                <Link to={"/profile"}>
                  <AccordionItem
                    className="accordion-item"
                    onClick={props.onClose}
                  >
                    <AccordionButton>
                      <Flex fontWeight={"bold"} alignItems={"center"} gap={2}>
                        <Avatar size={"sm"} />
                        <Box>Hi, {userSelector.name}</Box>
                      </Flex>
                    </AccordionButton>
                  </AccordionItem>
                </Link>
              ) : (
                <Link to={"/auth"}>
                  <AccordionItem className="accordion-item">
                    <AccordionButton fontWeight={"bold"}>
                      <Box> Login/Signup</Box>
                    </AccordionButton>
                  </AccordionItem>
                </Link>
              )}

              <AccordionItem className="accordion-item">
                <AccordionButton _expanded={{ bg: "black", color: "white" }}>
                  <Box as="span" flex="1" textAlign="left" fontWeight={"bold"}>
                    BRANDS
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel display={"flex"} flexDir={"column"} p={0}>
                  {brands?.map((val, idx) => (
                    <Link to={`/b/${val.name}`}>
                      <Box id="asyu" onClick={props.onClose}>
                        {val.name}
                      </Box>
                    </Link>
                  ))}
                </AccordionPanel>
              </AccordionItem>

              {categories &&
                categories?.map((category, idx) => (
                  <AccordionItem className="accordion-item">
                    <AccordionButton
                      _expanded={{ bg: "black", color: "white" }}
                    >
                      <Box
                        as="span"
                        flex="1"
                        textAlign="left"
                        fontWeight={"bold"}
                      >
                        {category.name}
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                    <AccordionPanel p={0}>
                      {category?.subcategories.map((sub, idx) => (
                        <Link to={`/c/${category.name}/${sub.name}`}>
                          <Box id="asyu" onClick={props.onClose}>
                            {sub.name}
                          </Box>
                        </Link>
                      ))}
                    </AccordionPanel>
                  </AccordionItem>
                ))}

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
                <AccordionButton fontWeight={"bold"}>
                  <Box> Logout</Box>
                </AccordionButton>
              </AccordionItem>
            </Accordion>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}
