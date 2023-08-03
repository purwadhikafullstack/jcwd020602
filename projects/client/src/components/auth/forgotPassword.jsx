import { Box, Button, Center, Flex, Icon, Input } from "@chakra-ui/react";
import { InputGroup, InputRightElement, useToast } from "@chakra-ui/react";
import { useState } from "react";
import Footer from "../website/footer";
import { api } from "../../api/api";
import { EmailIcon } from "@chakra-ui/icons";
export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const forgotPassword = async () => {
    if (!email) {
      toast({
        title: "fill in all data.",
        status: "warning",
        position: "top",
        duration: 1000,
      });
    } else {
      try {
        const res = await api.get("/auth/generate-token/email", {
          params: { email },
        });
        toast({
          title: res.data.message,
          status: "success",
          position: "top",
          duration: 1000,
        });
      } catch (err) {
        toast({
          title: err.response.data,
          status: "error",
          position: "top",
          duration: 1000,
        });
      }
    }
  };

  return (
    <Center flexDir={"column"}>
      <Center h={"100vh"} maxH={"800px"}>
        <Flex
          flexDir={"column"}
          gap={4}
          p={5}
          textAlign={"center"}
          border={"2px"}
          m={1}
        >
          <Box fontSize={"25px"}>Forgot Pasword</Box>
          <Box color={"gray"} fontSize={"10px"}>
            Enter your email to receive instructions on how to reset your
            password.
          </Box>
          <Box className={`inputbox ${email ? "input-has-value" : ""}`}>
            <InputGroup>
              <InputRightElement>
                <Icon as={EmailIcon} />
              </InputRightElement>
              <Input
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <label for="">Email</label>
            </InputGroup>
          </Box>
          <Button
            isLoading={isLoading}
            size={"sm"}
            onClick={() => {
              setIsLoading(true);
              setTimeout(() => {
                forgotPassword();
                setIsLoading(false);
              }, 2000);
            }}
          >
            Reset
          </Button>
        </Flex>
      </Center>
      <Footer />
    </Center>
  );
}
