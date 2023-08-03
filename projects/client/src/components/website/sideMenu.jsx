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
                <AccordionItem>
                  <AccordionButton _expanded={{ bg: "black", color: "white" }}>
                    <Flex
                      as="span"
                      flex="1"
                      fontWeight={"bold"}
                      alignItems={"center"}
                      gap={2}
                    >
                      <Avatar size={"sm"} />
                      <Box>Hi, {userSelector.name}</Box>
                    </Flex>
                    <AccordionIcon />
                  </AccordionButton>
                  <AccordionPanel
                    pb={4}
                    display={"flex"}
                    flexDir={"column"}
                    gap={2}
                  >
                    <Link to="/profile">
                      <text>Profile</text>
                    </Link>
                    <text>Orders</text>
                    <text>Favorites</text>
                    <text>Account Settings</text>
                    <text
                      onClick={() => {
                        localStorage.removeItem("user");
                        dispatch({
                          type: "logout",
                        });
                      }}
                    >
                      Log Out
                    </text>
                  </AccordionPanel>
                </AccordionItem>
              ) : (
                <AccordionItem>
                  <AccordionButton fontWeight={"bold"}>
                    <a href="/auth"> Login/Signup</a>
                  </AccordionButton>
                </AccordionItem>
              )}
              <AccordionItem>
                <AccordionButton _expanded={{ bg: "black", color: "white" }}>
                  <Box as="span" flex="1" textAlign="left" fontWeight={"bold"}>
                    BRANDS
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={4}>
                  {brands?.map((val, idx) => (
                    <Box id="option" mb={1} key={idx}>
                      {val.name}
                    </Box>
                  ))}
                </AccordionPanel>
              </AccordionItem>

              {categories &&
                categories?.map((category, idx) => (
                  <AccordionItem key={idx}>
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
                    <AccordionPanel pb={4}>
                      {category?.subcategories.map((sub, idx) => (
                        <Box id="option" key={idx} mb={1}>
                          {sub.name}
                        </Box>
                      ))}
                    </AccordionPanel>
                  </AccordionItem>
                ))}
            </Accordion>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}
