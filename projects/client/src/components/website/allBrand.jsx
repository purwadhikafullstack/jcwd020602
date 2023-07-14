import { Box, Flex, Text, Image } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useFetchBrand } from "../../hooks/useFetchBrand";
export default function AllBrand() {
  const { brands } = useFetchBrand();
  console.log(brands);

  const [animateBoxes, setAnimateBoxes] = useState({});

  useEffect(() => {
    const handleScroll = () => {
      const brandsBoxes = document.querySelectorAll(".brand-box");
      brandsBoxes.forEach((box) => {
        const boxRect = box.getBoundingClientRect();
        if (boxRect.top <= window.innerHeight * 0.8) {
          setAnimateBoxes((prevAnimateBoxes) => ({
            ...prevAnimateBoxes,
            [box.id]: true,
          }));
        }
      });
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <Flex
        flexDir={"column"}
        zIndex={1}
        w={"100%"}
        maxW={"1531px"}
        p={"1rem 1rem"}
      >
        <Text fontSize={"50px"} fontWeight={"bold"}>
          Brands
        </Text>
        <Flex justify={"center"}>
          <Box display={"grid"} gridGap={5} id="brands-section">
            {brands?.map((val) => (
              <Box
                key={val.id}
                w={"100%"}
                maxW={"350px"}
                maxH={"350px"}
                h={"100vh"}
                id={`brand-${val.name}`}
                className={`brand-box ${
                  animateBoxes[`brand-${val.name}`] ? "animate" : ""
                }`}
                position={"relative"}
                _hover={{ cursor: "pointer" }}
                onMouseEnter={(e) => {
                  e.currentTarget.querySelector(
                    "img:last-child"
                  ).style.opacity = 1;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.querySelector(
                    "img:last-child"
                  ).style.opacity = 0;
                }}
                transition="opacity 0.5s"
                opacity={0}
              >
                <Image
                  w={"100%"}
                  h={"100%"}
                  src={val.brand_img}
                  objectFit={"cover"}
                />
                <Image
                  w={"100%"}
                  h={"100%"}
                  top={0}
                  pos={"absolute"}
                  src={val.logo_img}
                  objectFit={"cover"}
                  objectPosition={"center"}
                  opacity={0}
                  transition="opacity 0.5s"
                />
              </Box>
            ))}
          </Box>
        </Flex>
      </Flex>
    </>
  );
}
