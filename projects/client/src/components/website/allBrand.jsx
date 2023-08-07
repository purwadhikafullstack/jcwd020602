import { Box, Flex, Text, Image } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useFetchBrand } from "../../hooks/useFetchBrand";
import { Link } from "react-router-dom";
export default function AllBrand() {
  const { brands } = useFetchBrand();

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
        <Box p={1} border={"2px"}>
          <Box
            border={"2px"}
            fontSize={"30px"}
            fontWeight={"bold"}
            p={1}
            mb={1}
            bg={"white"}
          >
            Brands
          </Box>
          <Flex justify={"center"} border={"2px"}>
            <Box display={"grid"} gridGap={5} id="brands-section" p={1}>
              {brands?.map((val) => (
                <Link to={`/b/${val.name.replace(" ", "-")}`}>
                  <Box
                    key={val.id}
                    border={"1px"}
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
                </Link>
              ))}
            </Box>
          </Flex>
        </Box>
      </Flex>
    </>
  );
}
