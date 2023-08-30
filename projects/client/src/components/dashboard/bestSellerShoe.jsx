import { Box, Divider, Flex, Image, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { api } from "../../api/api";
export default function BestSellerShoe(props) {
  const { salesData } = props;
  const [bestShoes, setBestShoes] = useState([]);
  async function dataProcessor() {
    const bS = salesData.reduce((prev, curr) => {
      const shoe = curr.stock.Sho.name;
      if (prev[shoe]) {
        prev[shoe].qty += curr?.qty;
      } else {
        prev[shoe] = curr;
      }
      return prev;
    }, {});
    const bestSeller = [];
    Object.keys(bS).map((val) => {
      if (bestSeller.length < 5) {
        bestSeller.push(bS[val]);
      } else {
        if (bS[val].qty > bestSeller[1].qty) {
          bestSeller.splice(0, 1, bS[val]);
        } else if (bS[val] > bestSeller[2].qty) {
          bestSeller.splice(1, 1, bS[val]);
        } else if (bS[val] > bestSeller[3].qty) {
          bestSeller.splice(2, 1, bS[val]);
        } else if (bS[val] > bestSeller[4].qty) {
          bestSeller.splice(3, 1, bS[val]);
        } else if (bS[val] > bestSeller[5].qty) {
          bestSeller.splice(4, 1, bS[val]);
        }
      }
      setBestShoes(bestSeller);
    });
    const res = await api().patch("/shoes/bestSeller", {
      shoe_ids: bestSeller.map((val) => val.stock.shoe_id),
    });
  }
  useEffect(() => {
    dataProcessor();
  }, [salesData]);
  return (
    <Flex flexDir={"column"} p={1}>
      <Box fontWeight={"bold"} fontSize={"30px"}>
        BEST SELLER
      </Box>
      <Flex
        border={"2px"}
        w={"100%"}
        flexWrap={"wrap"}
        justify={"center"}
        gap={2}
        p={2}
      >
        {bestShoes.map((val, idx) => (
          <Flex flexDir={"column"} p={1} border={"1px"} w={"220px"}>
            <Box
              className="shoe-list"
              _hover={{ bg: "black", color: "white" }}
              // maxW={"500px"}
              // w={"100%"}
            >
              <Image
                src={`${process.env.REACT_APP_API_BASE_URL}/${val.stock?.Sho?.ShoeImages[0]?.shoe_img}`}
                w={"100%"}
                maxH={"250px"}
              />
              <Flex flexDir={"column"} p={2}>
                <Text fontWeight={"bold"}>{val.stock?.Sho?.name}</Text>
                <Divider />
                <Text>{val.stock?.Sho?.brand?.name}</Text>
                <Divider />
                <Text fontSize={13} color={"gray"}>
                  {val.stock?.Sho?.Category?.name}{" "}
                  {val.stock?.Sho?.subcategory?.name}
                </Text>
                <Divider />
                <Text>
                  {val.stock?.Sho?.price.toLocaleString("id-ID", {
                    style: "currency",
                    currency: "IDR",
                  })}
                </Text>
              </Flex>
            </Box>
          </Flex>
        ))}
      </Flex>
    </Flex>
  );
}
