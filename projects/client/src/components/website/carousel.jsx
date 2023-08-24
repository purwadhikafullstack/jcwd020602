import { Box, Flex, Icon, IconButton, Image, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { EffectCoverflow, Pagination, Navigation } from "swiper";
import "../../css/bestSeller.css";
import { useFetchShoe } from "../../hooks/useFetchShoe";
import { useEffect, useState } from "react";

export function Recommend(props) {
  const [filter, setFilter] = useState({ limit: 50 });
  const { shoes, fetch } = useFetchShoe(props?.category, "", filter);

  useEffect(() => {
    fetch();
  }, [props.category]);

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
            // loop
            slidesPerView={"auto"}
            navigation={{
              prevEl: ".swiper-button-prev",
              nextEl: ".swiper-button-next",
              clickable: true,
            }}
            modules={[Navigation]}
          >
            {shoes &&
              shoes?.rows
                .filter((val) => val.id != props.id)
                .map((shoe, idx) => (
                  <SwiperSlide key={idx} className="recommend">
                    <Link to={`/${shoe.name.replace(/ /g, "-")}`}>
                      <Box border={"1px"} h={"100%"} cursor={"pointer"}>
                        <Image
                          src={`${process.env.REACT_APP_API_BASE_URL}/${shoe.ShoeImages[0]?.shoe_img}`}
                          h={"100%"}
                          objectFit={"cover"}
                        />
                      </Box>
                      <Flex
                        flexDir={"column"}
                        align={"center"}
                        justify={"center"}
                      >
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
                    </Link>
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

export function BestSeller() {
  const [filter, setFilter] = useState({ limit: 50 });
  const { shoes } = useFetchShoe("", "", filter);
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
            BEST SELLER
          </Box>
          <Swiper
            className="swiper_container_rec"
            centeredSlides
            // loop
            slidesPerView={"auto"}
            navigation={{
              prevEl: ".swiper-button-prev",
              nextEl: ".swiper-button-next",
              clickable: true,
            }}
            modules={[Navigation]}
          >
            {shoes &&
              shoes?.rows
                .filter((val) => val.status == "BESTSELLER")
                .map((shoe, idx) => (
                  <SwiperSlide key={idx} className="recommend">
                    <Link to={`/${shoe.name.replace(/ /g, "-")}`}>
                      <Box border={"1px"} h={"100%"} cursor={"pointer"}>
                        <Image
                          src={`${process.env.REACT_APP_API_BASE_URL}/${shoe.ShoeImages[0]?.shoe_img}`}
                          h={"100%"}
                          objectFit={"cover"}
                        />
                      </Box>
                      <Flex
                        flexDir={"column"}
                        align={"center"}
                        justify={"center"}
                      >
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
                    </Link>
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
