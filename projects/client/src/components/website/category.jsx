import { Box, Flex, Text, Image, Center } from "@chakra-ui/react";
import { useFetchCategory } from "../../hooks/useFetchCategory";
import { Link } from "react-router-dom";
// ------------------------------------------------------ CLEAR -FAHMI
export default function Category() {
  const { categories } = useFetchCategory();

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
            CATEGORIES
          </Box>
          <Flex justify={"center"} border={"2px"}>
            <Box display={"grid"} className="category" gridGap={5} p={1}>
              {categories?.map((val, idx) => {
                return (
                  <Link to={`/c/${val.name}`}>
                    <Box
                      key={idx}
                      border={"1px"}
                      w={"100%"}
                      maxW={"350px"}
                      maxH={"600px"}
                      h={"100vh"}
                      pos={"relative"}
                      _hover={{ cursor: "pointer" }}
                      onMouseEnter={(e) => {
                        e.currentTarget.querySelector(
                          ".title"
                        ).style.opacity = 1;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.querySelector(
                          ".title"
                        ).style.opacity = 0;
                      }}
                    >
                      <Image
                        w={"100%"}
                        h={"100%"}
                        src={`${process.env.REACT_APP_API_BASE_URL}/${val.category_img}`}
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
                  </Link>
                );
              })}
            </Box>
          </Flex>
        </Box>
      </Flex>
    </>
  );
}
