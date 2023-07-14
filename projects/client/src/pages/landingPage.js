import {
  Box,
  Center,
  Divider,
  Flex,
  Icon,
  Image,
  Input,
  InputGroup,
  InputRightAddon,
  Text,
} from "@chakra-ui/react";
import adidas from "../assets/adidas2.png";
import converse from "../assets/convers low.png";
import logo from "../assets/newlogo.png";
import logo1 from "../assets/newlogo1.png";
import {
  GrLinkNext,
  GrFacebook,
  GrInstagram,
  GrYoutube,
  GrTwitter,
} from "react-icons/gr";
import BestSeller from "../components/website/bestSeller";
import AllBrand from "../components/website/allBrand";
import Category from "../components/website/category";
import LogoCarousel from "../components/website/logoCarousel";
import Banner from "../components/website/banner";

export default function LandingPage() {
  return (
    <>
      <Center flexDir={"column"}>
        <Box
          w={"100%"}
          maxW={"1530px"}
          h={"100vh"}
          maxH={"1180px"}
          pos={"relative"}
          display={"FLEX"}
          alignItems={"center"}
          justifyContent={"center"}
          zIndex={1}
          overflow={"hidden"}
        >
          <Image
            src={adidas}
            pos={"absolute"}
            w={"500px"}
            bottom={"0%"}
            transform={"rotate(-40deg)"}
            zIndex={0}
          />

          <Image
            src={converse}
            pos={"fixed"}
            w={"450px"}
            top={-10}
            transform={"rotate(-40deg)"}
            zIndex={2}
          />
          <Image id="logoo" src={logo} w={"350px"} pos={"absolute"} />
          <Text
            whiteSpace={"nowrap"}
            id="tulisan"
            fontSize={"30px"}
            fontWeight={"bold"}
            pos={"absolute"}
            mt={40}
            zIndex={1}
          >
            CHOOSE YOUR SHOE
          </Text>
        </Box>
        {/* banner */}
        <Banner />
        {/* logo carousel */}
        <LogoCarousel />
        {/* category */}
        <Category />
        {/* best seller */}
        <BestSeller />
        {/* brands */}
        <AllBrand />
        {/* foot */}
        <Box
          className="foot"
          zIndex={0}
          bg={"black"}
          w={"100%"}
          maxW={"1531px"}
          p={"1rem"}
          justifyContent={"space-between"}
        >
          <Image src={logo1} w={"250px"} h={"60px"} mb={2} />
          <Box className="foot">
            <Flex color={"gray"} flexDir={"column"} gap={2} pb={2}>
              <Box color={"white"} fontWeight={"bold"} borderBottom={"1px"}>
                ABOUT
              </Box>

              <Text id="text">About Us</Text>
              <Text id="text">Provacy Policy</Text>
              <Text id="text">Term & Conditiond</Text>
            </Flex>
            <Flex color={"gray"} flexDir={"column"} gap={2} pb={2}>
              <Box color={"white"} fontWeight={"bold"} borderBottom={"1px"}>
                CUSTOMER CARE
              </Box>
              <Text id="text">FAQ</Text>
              <Text id="text">Size Guide</Text>
              <Text id="text">Contact Us</Text>
              <Text id="text">Return Policy</Text>
              <Text id="text">Order Status</Text>
            </Flex>
            <Flex flexDir={"column"} gap={2}>
              <Text color={"white"} fontWeight={"bold"} borderBottom={"1px"}>
                NEWSLETTER
              </Text>

              <Text color={"white"}>
                Register your email for news and special offers
              </Text>
              <InputGroup>
                <Input color={"white"} focusBorderColor="white" />
                <InputRightAddon>
                  <Icon as={GrLinkNext} />
                </InputRightAddon>
              </InputGroup>
              <Flex className="socialmedia" gap={5} mt={10}>
                <Center
                  boxSize={"50px"}
                  border={"1px"}
                  borderColor={"white"}
                  color={"white"}
                  id="logo"
                >
                  <Image as={GrFacebook} size={"30px"} />
                </Center>
                <Center
                  boxSize={"50px"}
                  border={"1px"}
                  borderColor={"white"}
                  color={"white"}
                  id="logo"
                >
                  <Image as={GrInstagram} size={"30px"} />
                </Center>
                <Center
                  boxSize={"50px"}
                  border={"1px"}
                  borderColor={"white"}
                  color={"white"}
                  id="logo"
                >
                  <Image as={GrYoutube} size={"30px"} />
                </Center>
                <Center
                  boxSize={"50px"}
                  border={"1px"}
                  borderColor={"white"}
                  color={"white"}
                  id="logo"
                >
                  <Image as={GrTwitter} size={"30px"} />
                </Center>
              </Flex>
            </Flex>
          </Box>
        </Box>

        <Divider />

        <Center
          padding={2}
          w={"100%"}
          maxW={"1531px"}
          bg={"black"}
          color={"white"}
        >
          <Text textAlign={"center"} fontSize={"10px"}>
            COPYRIGHT © 2023 FOOTHUB ALL RIGHTS RESERVED.
          </Text>
        </Center>
      </Center>
    </>
  );
}
