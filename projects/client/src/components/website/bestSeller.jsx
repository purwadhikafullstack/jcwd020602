import { Box, Flex, Icon, Image, Text } from "@chakra-ui/react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { EffectCoverflow, Pagination, Navigation } from "swiper";
import "../../css/bestSeller.css";
export default function BestSeller() {
  const sepatu = [
    {
      name: "Nike Air Force 1 '07",
      img: "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/b7d9211c-26e7-431a-ac24-b0540fb3c00f/air-force-1-07-shoes-WrLlWX.png",
      price: "Rp 1,549,000",
    },
    {
      name: "Nike Tech Hera",
      img: "https://static.nike.com/a/images/t_PDP_864_v1/f_auto,b_rgb:f5f5f5/1a484a7a-4b86-49e7-85f3-e53aed0bdbde/tech-hera-shoes-8MQgCL.png",
      price: "Rp 1,729,000",
    },
    {
      name: "Nike Court Vision Low",
      img: "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/164b0ac6-7e73-4138-883c-1db81177787b/court-vision-low-shoes-Fh1wdP.png",
      price: "Rp 908,000",
    },
    {
      name: "Air Jordan 2 Retro Low Titan",
      img: "https://static.nike.com/a/images/t_PDP_864_v1/f_auto,b_rgb:f5f5f5/fec7649b-7347-40ac-a897-edc21a66a83d/air-jordan-2-retro-low-titan-shoes-753NG3.png",
      price: "Rp 2,808,000",
    },
    {
      name: "SUPERSTAR 82 SHOES",
      img: "https://www.adidas.co.id/media/catalog/product/h/0/h06258_sl_ecom.jpg",
      price: "Rp. 2.300.000",
    },
    {
      name: "Suede Classic XXI Trainers",
      img: "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_1200,h_1200/global/374915/02/sv01/fnd/IDN/fmt/png/Suede-Classic-XXI-Trainers",
      price: "Rp 783.440",
    },
  ];
  return (
    <>
      <Box
        className="container"
        zIndex={1}
        // bg={"white"}
        w={"100%"}
        maxW={"1531px"}
      >
        <Text fontSize={"50px"} fontWeight={"bold"}>
          Best Sellers
        </Text>
        <Swiper
          className="swiper_container"
          effect={"coverflow"}
          grabCursor={true}
          centeredSlides={true}
          loop={true}
          slidesPerView={"auto"}
          coverflowEffect={{
            rotate: 0,
            stretch: 0,
            depth: 100,
            modifier: 2.5,
          }}
          pagination={{ el: ".swiper-pagination", clickable: true }}
          navigation={{
            prevEl: ".swiper-button-prev",
            nextEl: ".swiper-button-next",
            clickable: true,
          }}
          modules={[EffectCoverflow, Pagination, Navigation]}
        >
          {sepatu.map((val, idx) => (
            <SwiperSlide className="bestseller" key={idx}>
              <img src={val.img} />
              <Flex flexDir={"column"} align={"center"} justify={"center"}>
                <Text
                  bg={"white"}
                  p={2}
                  fontSize={"20px"}
                  pos={"absolute"}
                  top={10}
                >
                  {val.name}
                </Text>
              </Flex>
            </SwiperSlide>
          ))}
          <Box className="swiper-button-prev slider-arrow"></Box>
          <Box className="swiper-button-next slider-arrow"></Box>

          <Box className="slider-controler">
            <Box className="swiper-pagination"></Box>
          </Box>
        </Swiper>
      </Box>
    </>
  );
}
