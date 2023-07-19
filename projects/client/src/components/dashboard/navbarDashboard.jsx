import {
  Avatar,
  Box,
  Center,
  Flex,
  Icon,
  Switch,
  Text,
} from "@chakra-ui/react";
import moment from "moment/moment";
import { useContext } from "react";
import { ThemeContext } from "../../App";
import { FiSun, FiMoon } from "react-icons/fi";
import { useSelector } from "react-redux";
export default function NavbarDashboard() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const userSelector = useSelector((state) => state.auth);

  return (
    <>
      <Box
        id="navbarDash"
        w="100%"
        pos="fixed"
        top="0"
        zIndex="1"
        borderBottom=" #c2c2c2 solid"
        p={2}
      >
        <Flex align="center" justify="space-between">
          <Flex id="switch" align={"center"} gap={3}>
            <Icon as={FiSun} />
            <Switch
              colorScheme="gray"
              onChange={toggleTheme}
              defaultChecked={theme === "dark" ? true : false}
            />
            <Icon as={FiMoon} />
          </Flex>

          <Flex gap={2}>
            <Box
              className="akun"
              display="flex"
              flexDir="column"
              textAlign="right"
              fontSize="11px"
            >
              <Text>{userSelector.name}</Text>
              <Text color={"gray"}>{userSelector.role}</Text>
            </Box>
            <Box>
              <Avatar size="sm" />
            </Box>
          </Flex>
        </Flex>
      </Box>
    </>
  );
}
