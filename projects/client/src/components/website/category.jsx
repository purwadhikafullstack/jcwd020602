import { Box, Flex, Text, Image, Center } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { api } from "../../api/api";
import { useFetchCategory } from "../../hooks/useFetchCategory";

export default function Category() {
  const { categories } = useFetchCategory();

  return (
    <>
      <Flex
        flexDir={"column"}
        zIndex={1}
        w={"100%"}
        maxW={"1531px"}
        p={"0rem 1rem"}
      >
        <Text fontSize={"50px"} fontWeight={"bold"}>
          Categories
        </Text>
        <Flex justify={"center"}>
          <Box display={"grid"} className="category" gridGap={5}>
            {categories?.map((val, idx) => {
              return (
                <Box
                  key={idx}
                  w={"100%"}
                  maxW={"350px"}
                  maxH={"600px"}
                  h={"100vh"}
                  pos={"relative"}
                  _hover={{ cursor: "pointer" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.querySelector(".title").style.opacity = 1;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.querySelector(".title").style.opacity = 0;
                  }}
                >
                  <Image
                    w={"100%"}
                    h={"100%"}
                    src={val.category_img}
                    objectFit={"cover"}
                  />
                  <Center
                    className="title"
                    pos={"absolute"}
                    top={0}
                    w={"100%"}
                    h={"100%"}
                    bg="rgba(255, 255, 255, 0.7)"
                    opacity={0}
                    transition="opacity 0.5s"
                    fontWeight={"bold"}
                    fontSize={"50px"}
                  >
                    {val.name}
                  </Center>
                </Box>
              );
            })}
          </Box>
        </Flex>
      </Flex>
    </>
  );
}
