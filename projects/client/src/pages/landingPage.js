import { Box, Center, Image, Text } from "@chakra-ui/react";
import adidas from "../assets/adidas2.png";
import converse from "../assets/convers low.png";
import logo from "../assets/newlogo.png";
import { Recommend } from "../components/website/carousel";
import AllBrand from "../components/website/allBrand";
import Category from "../components/website/category";
import LogoCarousel from "../components/website/logoCarousel";
import Banner from "../components/website/banner";
import Footer from "../components/website/footer";

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
        <Recommend />
        {/* brands */}
        <AllBrand />
        {/* foot */}
        <Footer />
      </Center>
    </>
  );
}
