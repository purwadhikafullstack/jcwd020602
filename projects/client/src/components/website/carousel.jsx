import { Box, Flex, Icon, IconButton, Image, Text } from "@chakra-ui/react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { EffectCoverflow, Pagination, Navigation } from "swiper";
import "../../css/bestSeller.css";
import { useFetchShoe } from "../../hooks/useFetchShoe";

export function Recommend() {
  const { shoes } = useFetchShoe();
  return (
    <>
      <Box className="container" w={"100%"} maxW={"1531px"} zIndex={1}>
        <Box p={1} border={"2px"} gap={2}>
          <Box
            fontSize={"20px"}
            fontWeight={"bold"}
            p={1}
            mb={1}
            border={"2px"}
            bg={"white"}
          >
            YOU MAY ALSO LIKES
          </Box>
          <Swiper
            className="swiper_container_rec"
            centeredSlides
            slidesPerView={"auto"}
            navigation={{
              prevEl: ".swiper-button-prev",
              nextEl: ".swiper-button-next",
              clickable: true,
            }}
            modules={[Navigation]}
          >
            {shoes &&
              shoes?.rows.map((shoe) => (
                <SwiperSlide className="recommend">
                  <Box border={"1px"} h={"100%"} cursor={"pointer"}>
                    <Image
                      src={shoe.ShoeImages[0]?.shoe_img}
                      h={"100%"}
                      objectFit={"cover"}
                    />
                  </Box>
                  <Flex flexDir={"column"} align={"center"} justify={"center"}>
                    <Text
                      bg={"white"}
                      p={2}
                      fontSize={"15px"}
                      pos={"absolute"}
                      top={10}
                      fontWeight={"bold"}
                    >
                      {shoe?.name}
                    </Text>
                  </Flex>
                </SwiperSlide>
              ))}
            <Box className="swiper-button-prev slider-arrow"></Box>
            <Box className="swiper-button-next slider-arrow"></Box>
          </Swiper>
        </Box>
      </Box>
    </>
  );
}
