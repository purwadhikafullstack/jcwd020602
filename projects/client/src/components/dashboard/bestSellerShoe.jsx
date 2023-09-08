import { Box, Divider, Flex, Image, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { api } from "../../api/api";
import { useSelector } from "react-redux";
import { useFetchShoe } from "../../hooks/useFetchShoe";
export default function BestSellerShoe(props) {
  const userSelector = useSelector((state) => state.auth);
  const { salesData } = props;
  const [filter, setFilter] = useState({ limit: 50 });
  const { shoes } = useFetchShoe("", "", filter);
  console.log(shoes);
  async function dataProcessor() {
    try {
      const bS = salesData.reduce((prev, curr) => {
        const shoe = curr.stock.Sho.name;
        if (prev[shoe]) {
          prev[shoe].qty += curr?.qty;
        } else {
          prev[shoe] = curr;
        }
        return prev;
      }, {});
      const bestSeller = Object.entries(bS)
        .sort((a, b) => b[1].qty - a[1].qty)
        .map((val) => val[1].stock.shoe_id);
      bestSeller.length = 5;

      if (userSelector.role == "SUPERADMIN") {
        const res = await api().patch("/shoes/bestSeller", {
          shoe_ids: bestSeller,
        });
      }
    } catch (error) {
      return error;
    }
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
        {shoes.rows.map((val) =>
          val.status == "BESTSELLER" ? (
            <>
              <Flex flexDir={"column"} p={1} border={"1px"} w={"220px"}>
                <Box
                  className="shoe-list"
                  _hover={{ bg: "black", color: "white" }}
                  // maxW={"500px"}
                  // w={"100%"}
                >
                  <Image
                    src={`${process.env.REACT_APP_API_BASE_URL}/${val?.ShoeImages[0]?.shoe_img}`}
                    w={"100%"}
                    maxH={"250px"}
                  />
                  <Flex flexDir={"column"} p={2}>
                    <Text fontWeight={"bold"}>{val.name}</Text>
                    <Divider />
                    <Text>{val?.brand?.name}</Text>
                    <Divider />
                    <Text fontSize={13} color={"gray"}>
                      {val?.Category?.name} {val?.subcategory?.name}
                    </Text>
                    <Divider />
                    <Text>
                      {val?.price.toLocaleString("id-ID", {
                        style: "currency",
                        currency: "IDR",
                      })}
                    </Text>
                  </Flex>
                </Box>
              </Flex>
            </>
          ) : null
        )}
      </Flex>
    </Flex>
  );
}
