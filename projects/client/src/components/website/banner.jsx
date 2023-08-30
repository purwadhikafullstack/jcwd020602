import { Box, Image } from "@chakra-ui/react";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Autoplay, Pagination } from "swiper";
import "swiper/css/pagination";
import banner from "../../assets/FOOTHUB-BANNER.jpg";
import banner1 from "../../assets/FOOTHUB-BANNER2.jpg";
import banner2 from "../../assets/FOOTHUB-BANNER1.jpg";
SwiperCore.use([Autoplay]);

export default function Banner() {
  const img = [banner1, banner, banner2];
  return (
    <>
      <Box zIndex={1} bg={"white"} w={"100%"} maxW={"1531px"} p={"1rem  1rem"}>
        <Swiper
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          loop
          pagination={{ el: ".swiper-pagination", clickable: true }}
          modules={[Pagination]}
        >
          {img.map((val, idx) => (
            <SwiperSlide className="banner" key={idx}>
              <Image src={val} h={"auto"} />
            </SwiperSlide>
          ))}
          <Box className="slider-controler">
            <Box className="swiper-pagination"></Box>
          </Box>
        </Swiper>
      </Box>
    </>
  );
}
