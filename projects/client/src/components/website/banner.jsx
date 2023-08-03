import { Box, Flex, Image } from "@chakra-ui/react";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Autoplay, Pagination } from "swiper";
import "swiper/css/pagination";
SwiperCore.use([Autoplay]);
export default function Banner() {
  const img = [
    {
      img: "https://d1csarkz8obe9u.cloudfront.net/posterpreviews/sport-shoes-banner-template-design-080ae990bbc405ffe9e365783f6f64c5_screen.jpg?ts=1632393539",
    },
    {
      img: "https://i.pinimg.com/736x/4e/31/42/4e3142435b7a0a2f5f1229db876c7ed4--adidas-boost-design-tech.jpg",
    },
    {
      img: "https://cdn.shoplightspeed.com/shops/613683/files/54099589/converse.jpg",
    },
    {
      img: "https://www.grand-indonesia.com/wp-content/uploads/2022/05/VANS-Medprom-Web-Banner-W-876-x-h-361-pixels-copy.jpg",
    },
  ];
  return (
    <>
      <Box zIndex={1} bg={"white"} w={"100%"} maxW={"1531px"} p={"1rem  1rem"}>
        {/* <Box p={"1rem"} border={"2px"} gap={2}> */}
        <Swiper
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          loop
          pagination={{ el: ".swiper-pagination", clickable: true }}
          modules={[Pagination]}
        >
          {img.map((val, idx) => (
            <SwiperSlide className="banner" key={idx}>
              <Image src={val.img} h={"auto"} />
            </SwiperSlide>
          ))}
          <Box className="slider-controler">
            <Box className="swiper-pagination"></Box>
          </Box>
        </Swiper>
      </Box>
      {/* </Box> */}
    </>
  );
}
