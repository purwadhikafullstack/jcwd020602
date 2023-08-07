import { useLocation } from "react-router-dom";
import { api } from "../api/api";
import { useEffect, useState } from "react";
import { Box, Center, Flex, Image, Text, Button } from "@chakra-ui/react";
import Footer from "../components/website/footer";
import { Recommend } from "../components/website/carousel";
import { useSelector } from "react-redux";

export default function ProductDetailPage() {
  const loc = useLocation();
  const userSelector = useSelector((state) => state.auth);
  let name = loc.pathname.split("/")[1];
  name = name.replace(/-/g, " ");
  const [shoe, setShoe] = useState();
  const [size, setSIze] = useState();
  const [stock, setStock] = useState();
  const [selectedImage, setSelectedImage] = useState(0);
  // console.log(shoe);
  // console.log(size);

  useEffect(() => {
    getShoe();
  }, [name]);

  const getShoe = async () => {
    const res = await api.get("/shoes/" + name);
    setShoe(res.data);
  };

  return (
    <Center flexDir={"column"}>
      <Box
        id="product-detail"
        display={"flex"}
        p={"0rem 1rem"}
        w={"100%"}
        maxW={"1533px"}
        mt={"100px"}
        justifyContent={"space-between"}
        gap={2}
      >
        <Flex
          maxW={"1000px"}
          w={"100%"}
          pos={"relative"}
          justify={"center"}
          border={"2px"}
        >
          <Image
            src={shoe?.ShoeImages[selectedImage]?.shoe_img}
            objectFit={"cover"}
            w={"100%"}
          />
          <Flex pos={"absolute"} gap={2} mt={2}>
            {shoe?.ShoeImages?.map((val, idx) => (
              <Box
                border={"1px"}
                onClick={() => setSelectedImage(idx)}
                _hover={{ transform: "scale(1.1,1.1)" }}
              >
                <Image src={val.shoe_img} w={"4rem"} cursor={"pointer"} />
              </Box>
            ))}
          </Flex>
        </Flex>

        <Flex flexDir={"column"} id="detail-product" gap={2} p={1}>
          <Box fontSize={"13px"} id="detail">
            {shoe?.Category?.name} • {shoe?.subcategory?.name}
          </Box>
          <Box
            id="detail"
            bg={"black"}
            color={"white"}
            letterSpacing={"-3px"}
            fontSize={"40px"}
            fontWeight={"bold"}
          >
            {shoe?.name}
          </Box>
          <Box id="detail" fontSize={"15px"}>
            {shoe?.description}
          </Box>
          <Box id="detail">
            {shoe?.price.toLocaleString("id-ID", {
              style: "currency",
              currency: "IDR",
            })}
          </Box>

          {/* select size  */}
          <Flex flexDir={"column"} gap={1} id="detail">
            <Box id="detail"> select size:</Box>
            <Flex gap={2} flexWrap={"wrap"}>
              {shoe?.stocks?.map((val) =>
                val.stock < 10 ? (
                  <Button
                    isDisabled
                    variant={"outline"}
                    border={"1px"}
                    borderRadius={0}
                  >
                    {val?.shoeSize?.size}
                  </Button>
                ) : (
                  <Button
                    isActive={size === val.shoeSize.size}
                    _active={{ bg: "black", color: "white" }}
                    variant={"outline"}
                    border={"1px"}
                    borderRadius={0}
                    onClick={() => {
                      size == val.shoeSize.size
                        ? setSIze(null)
                        : setSIze(val?.shoeSize?.size);
                      stock == val.stock ? setStock(0) : setStock(val.stock);
                    }}
                  >
                    {val?.shoeSize?.size}
                  </Button>
                )
              )}
            </Flex>
            {stock ? (
              <Box fontSize={"12px"} bg={"red"} color={"white"} id="detail">
                Only {stock} left in stock
              </Box>
            ) : null}
          </Flex>

          {/* button add cart */}
          <Flex flexDir={"column"} gap={1}>
            {userSelector.name ? (
              <Button
                variant={"outline"}
                border={"2px"}
                borderRadius={0}
                isDisabled={size ? false : true}
              >
                Add to Cart
              </Button>
            ) : (
              <Button
                variant={"outline"}
                border={"2px"}
                borderRadius={0}
                isDisabled
              >
                Add to Cart
              </Button>
            )}
            {!userSelector.name ? (
              <Text textAlign={"center"} color={"red"} fontSize={"12px"}>
                You must login first for add to cart
              </Text>
            ) : null}
          </Flex>
        </Flex>
      </Box>
      <Recommend />
      <Footer />
    </Center>
  );
}
