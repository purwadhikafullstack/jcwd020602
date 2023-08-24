import { Box, Divider, Flex, Image, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";

export default function AllProductCard({ shoes }) {
  return (
    <Box
      border={"2px"}
      display={"grid"}
      className="product"
      gridGap={5}
      my={5}
      p={2}
    >
      {shoes &&
        shoes?.rows?.map((shoe) => (
          <Link to={`/${shoe.name.replace(/ /g, "-")}`}>
            <Box
              key={shoe.id}
              cursor={"pointer"}
              _hover={{ bg: "black", color: "white" }}
              pos={"relative"}
              onMouseEnter={(e) => {
                const images = e.currentTarget.querySelectorAll("img");
                images[1].style.opacity = 1;
              }}
              onMouseLeave={(e) => {
                const images = e.currentTarget.querySelectorAll("img");
                images[1].style.opacity = 0;
              }}
            >
              <Image
                src={`${process.env.REACT_APP_API_BASE_URL}/${shoe.ShoeImages[0]?.shoe_img}`}
                objectFit={"cover"}
                maxH={"330px"}
                w={"100%"}
              />

              <Image
                maxH={"330px"}
                w={"100%"}
                src={`${process.env.REACT_APP_API_BASE_URL}/${shoe.ShoeImages[1]?.shoe_img}`}
                objectFit={"cover"}
                pos={"absolute"}
                top={0}
                opacity={0}
                transition="opacity 0.5s"
              />
              <Flex flexDir={"column"} p={2}>
                <Text fontWeight={"bold"}>{shoe.name}</Text>
                <Divider />
                <Text>{shoe.brand.name}</Text>
                <Divider />
                <Text fontSize={13} color={"gray"}>
                  {shoe.Category.name} {shoe.subcategory.name}
                </Text>
                <Divider />
                <Text>
                  {shoe.price.toLocaleString("id-ID", {
                    style: "currency",
                    currency: "IDR",
                  })}
                </Text>
              </Flex>
            </Box>
          </Link>
        ))}
    </Box>
  );
}
