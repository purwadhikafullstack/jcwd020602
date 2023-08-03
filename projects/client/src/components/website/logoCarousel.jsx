import { Box, Image } from "@chakra-ui/react";
import adidaslogo from "../../assets/logoadidas2.png";
import nikelogo from "../../assets/logonike2.png";
import converselogo from "../../assets/logoconverse.png";
import vanslogo from "../../assets/logovans.png";
import nblogo from "../../assets/logonb.png";
import pumalogo from "../../assets/logopuma.png";
import reeboklogo from "../../assets/logoreebok.png";

export default function LogoCarousel() {
  return (
    <>
      <Box
        borderY={"2px"}
        zIndex={0}
        bg={"white"}
        w={"100%"}
        maxW={"1531px"}
        py={2}
      >
        <Box id="slider">
          <Box id="slider-track">
            <Box id="slide">
              <Image src={adidaslogo} />
            </Box>
            <Box id="slide">
              <Image src={nikelogo} />
            </Box>
            <Box id="slide">
              <Image src={converselogo} />
            </Box>
            <Box id="slide">
              <Image src={vanslogo} />
            </Box>
            <Box id="slide">
              <Image src={nblogo} />
            </Box>
            <Box id="slide">
              <Image src={pumalogo} />
            </Box>
            <Box id="slide">
              <Image src={reeboklogo} />
            </Box>
            <Box></Box>
          </Box>
          <Box id="slider-track">
            <Box id="slide">
              <Image src={adidaslogo} />
            </Box>
            <Box id="slide">
              <Image src={nikelogo} />
            </Box>
            <Box id="slide">
              <Image src={converselogo} />
            </Box>
            <Box id="slide">
              <Image src={vanslogo} />
            </Box>
            <Box id="slide">
              <Image src={nblogo} />
            </Box>
            <Box id="slide">
              <Image src={pumalogo} />
            </Box>
            <Box id="slide">
              <Image src={reeboklogo} />
            </Box>
            <Box></Box>
          </Box>
        </Box>
      </Box>
    </>
  );
}
