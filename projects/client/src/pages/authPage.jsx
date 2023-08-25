import { Box, Button, Center, Flex, Text } from "@chakra-ui/react";
import Footer from "../components/website/footer";
import Login from "../components/auth/login";
import Register from "../components/auth/register";
import { useState } from "react";
import Navbar from "../components/website/navbar";

function OverlaySignUp(props) {
  return (
    <Flex
      flexDir={"column"}
      width="100%"
      color="black"
      alignItems="center"
      justifyContent="center"
      p={8}
    >
      <Text fontSize="3xl" mb={4}>
        New here?
      </Text>
      <Text align={"center"} pb={"10px"}>
        Be part of our family by clicking button bellow
      </Text>
      <Button id="button" onClick={props.toggleMode}>
        Sign up
      </Button>
    </Flex>
  );
}
function OverlaySignIn(props) {
  return (
    <Flex
      flexDir={"column"}
      width="100%"
      color="black"
      alignItems="center"
      justifyContent="center"
      p={8}
    >
      <Text fontSize="3xl" mb={4}>
        One of us?
      </Text>
      <Text align={"center"} pb={"10px"}>
        Thank for joining us, you can sign in by clicking button bellow
      </Text>
      <Button id="button" onClick={props.toggleMode}>
        Sign in
      </Button>
    </Flex>
  );
}

function AuthForm() {
  const [isSignUpMode, setIsSignUpMode] = useState(false);

  const toggleMode = () => {
    setIsSignUpMode(!isSignUpMode);
  };

  return (
    <Center flexDir={"column"}>
      <Navbar />
      <Flex
        minH={"800px"}
        alignItems="center"
        justifyContent="center"
        px={[4, 8, 16, 32]}
      >
        <Flex
          width={["100%", "100%", "800px", "800px"]}
          boxShadow="xl"
          borderRadius="md"
          overflow="hidden"
          flexDir={["column", "column", "row", "row"]}
          // border={"2px"}
        >
          <Box
            width={["100%", "100%", "50%", "50%"]}
            p={8}
            zIndex={isSignUpMode ? 2 : 1}
            bg={isSignUpMode ? "gray.100" : "white"}
          >
            {isSignUpMode ? (
              <OverlaySignIn toggleMode={toggleMode} />
            ) : (
              <Login />
            )}
          </Box>
          <Box
            width={["100%", "100%", "50%", "50%"]}
            p={8}
            zIndex={isSignUpMode ? 1 : 2}
            bg={isSignUpMode ? "white" : "gray.100"}
            position={["static", "static", "relative", "relative"]}
          >
            {isSignUpMode ? (
              <Register />
            ) : (
              <OverlaySignUp toggleMode={toggleMode} />
            )}
          </Box>
        </Flex>
      </Flex>
      <Footer />
    </Center>
  );
}

export default AuthForm;
