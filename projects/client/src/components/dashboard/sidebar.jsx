import { Box, Tooltip, Flex, Image } from "@chakra-ui/react";
import { BiSearch } from "react-icons/bi";
import { RxDashboard } from "react-icons/rx";
import { BsBoxSeam } from "react-icons/bs";
import { MdOutlineInventory2, MdOutlineWarehouse } from "react-icons/md";
import { HiOutlineDocumentReport } from "react-icons/hi";
import { RiUserSettingsLine } from "react-icons/ri";
import { AiOutlineFolderOpen, AiOutlineLogout } from "react-icons/ai";
import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/newlogo.png";
import logo1 from "../../assets/newlogo1.png";
import { useContext } from "react";
import { ThemeContext } from "../../App";

export default function Sidebar() {
  const { theme } = useContext(ThemeContext);
  const loc = useLocation();
  return (
    <>
      <Box
        bg={"white"}
        id="sidebar"
        maxH="100vh"
        h="100%"
        position={"fixed"}
        zIndex={"2"}
        pl={2}
        pt={2}
        borderRight="#c2c2c2 solid"
      >
        <Flex flexDir={"column"}>
          <Box
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
            className="logo-admin"
          >
            <Image
              src={theme == "dark" ? logo1 : logo}
              w={"130px"}
              h={"auto"}
            />
          </Box>
          <Flex flexDir={"column"} w={"100%"} borderRadius={5} gap={3}>
            <Link to={"/dashboard"}>
              <Flex
                id="icon"
                gap={5}
                align={"center"}
                p={1}
                pr={3}
                bg={loc.pathname == "/dashboard" ? "#c2c2c2" : ""}
              >
                <Tooltip
                  className="tooltip"
                  label="Dashboard"
                  placement="right"
                  ml={1}
                >
                  <Box boxSize={"30px"}>
                    <Image as={RxDashboard} size={"lg"} />
                  </Box>
                </Tooltip>
                <Box id="tulisan-sidebar">Dashboard</Box>
              </Flex>
            </Link>

            <Link to="/product">
              <Flex
                id="icon"
                gap={5}
                align={"center"}
                p={1}
                bg={loc.pathname == "/product" ? "#c2c2c2" : ""}
              >
                <Tooltip
                  className="tooltip"
                  label="Product"
                  placement="right"
                  ml={1}
                >
                  <Box boxSize={"30px"}>
                    <Image as={BsBoxSeam} size={"lg"} />
                  </Box>
                </Tooltip>

                <Box id="tulisan-sidebar">Product</Box>
              </Flex>
            </Link>

            <Link to="/categories">
              <Flex
                id="icon"
                gap={5}
                align={"center"}
                p={1}
                bg={loc.pathname == "/categories" ? "#c2c2c2" : ""}
              >
                <Tooltip
                  className="tooltip"
                  label="Categories"
                  placement="right"
                  ml={1}
                >
                  <Box boxSize={"30px"}>
                    <Image as={AiOutlineFolderOpen} size={"lg"} />
                  </Box>
                </Tooltip>

                <Box id="tulisan-sidebar">Categories</Box>
              </Flex>
            </Link>

            <Link to="/warehouse">
              <Flex
                id="icon"
                gap={5}
                align={"center"}
                p={1}
                bg={loc.pathname == "/warehouse" ? "#c2c2c2" : ""}
              >
                <Tooltip
                  className="tooltip"
                  label="Warehouse"
                  placement="right"
                  ml={1}
                >
                  <Box boxSize={"30px"}>
                    <Image as={MdOutlineWarehouse} size={"lg"} />
                  </Box>
                </Tooltip>

                <Box id="tulisan-sidebar">Warehouse</Box>
              </Flex>
            </Link>

            <Link to="/inventory">
              <Flex
                id="icon"
                gap={5}
                align={"center"}
                p={1}
                bg={loc.pathname == "/inventory" ? "#c2c2c2" : ""}
              >
                <Tooltip
                  className="tooltip"
                  label="Inventory"
                  placement="right"
                  ml={1}
                >
                  <Box boxSize={"30px"}>
                    <Image as={MdOutlineInventory2} size={"lg"} />
                  </Box>
                </Tooltip>

                <Box id="tulisan-sidebar">Inventory</Box>
              </Flex>
            </Link>

            <Link to="/report">
              <Flex
                id="icon"
                gap={5}
                align={"center"}
                p={1}
                bg={loc.pathname == "/report" ? "#c2c2c2" : ""}
              >
                <Tooltip
                  className="tooltip"
                  label="report"
                  placement="right"
                  ml={1}
                >
                  <Box boxSize={"30px"}>
                    <Image as={HiOutlineDocumentReport} size={"lg"} />
                  </Box>
                </Tooltip>

                <Box id="tulisan-sidebar">Report</Box>
              </Flex>
            </Link>

            <Link to="/userSettings">
              <Flex
                id="icon"
                gap={5}
                align={"center"}
                p={1}
                pr={3}
                bg={loc.pathname == "/userSettings" ? "#c2c2c2" : ""}
              >
                <Tooltip
                  className="tooltip"
                  label="User Settings"
                  placement="right"
                  ml={1}
                >
                  <Box boxSize={"30px"}>
                    <Image as={RiUserSettingsLine} size={"lg"} />
                  </Box>
                </Tooltip>

                <Box id="tulisan-sidebar">User Settings</Box>
              </Flex>
            </Link>

            <Link to="/">
              <Flex id="icon" gap={5} align={"center"} p={1}>
                <Tooltip
                  className="tooltip"
                  label="Logout"
                  placement="right"
                  ml={1}
                >
                  <Box boxSize={"30px"}>
                    <Image as={AiOutlineLogout} size={"lg"} />
                  </Box>
                </Tooltip>

                <Box id="tulisan-sidebar">Logout</Box>
              </Flex>
            </Link>
          </Flex>
        </Flex>
      </Box>
    </>
  );
}
