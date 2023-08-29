import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  Flex,
  Text,
  Center,
  Image,
} from "@chakra-ui/react";

export default function AccordionOrderSumary(props) {
  return (
    <Accordion allowToggle id="accordion-summary" display={"none"}>
      <AccordionItem border={"2px"}>
        <AccordionButton p={2}>
          <Box
            as="span"
            flex="1"
            textAlign="left"
            fontWeight={"bold"}
            fontSize={"2xl"}
          >
            SUMMARY
          </Box>
          Rp. {props.totalOrder.toLocaleString("id-ID")}
          <AccordionIcon />
        </AccordionButton>
        <AccordionPanel px={1}>
          <Box
            display={"flex"}
            flexDir={"column"}
            gap={2}
            p={2}
            h={"100%"}
            maxH={"700px"}
          >
            <Box id="detail" fontSize={"15px"}>
              <Flex flexDir={"column"} w={"100%"}>
                <Box p={1} borderBottom={"1px"}>
                  {props.sumItem} {props.sumItem > 1 ? "Products" : "Product"}
                </Box>
                <Flex justify={"space-between"} borderBottom={"1px"} p={1}>
                  <Text>Weight Total</Text>
                  <Text>{props.weightTotal} gram</Text>
                </Flex>
                <Flex justify={"space-between"} borderBottom={"1px"} p={1}>
                  <Text>Product Total</Text>
                  <Text>Rp. {props.totalPriceSum.toLocaleString("id-ID")}</Text>
                </Flex>
                <Flex justify={"space-between"} borderBottom={"1px"} p={1}>
                  <Text>Delivery</Text>
                  {props.cost == null ? null : (
                    <Text>Rp. {props.cost?.toLocaleString("id-ID")}</Text>
                  )}
                </Flex>
                <Flex
                  justify={"space-between"}
                  align={"center"}
                  borderBottom={"1px"}
                  p={1}
                >
                  <Flex flexDir={"column"}>
                    <Text fontWeight={"bold"}>Total</Text>
                    <Text fontWeight={"bold"}>(Inclusive of Tax)</Text>
                  </Flex>
                  <Text>Rp. {props.totalOrder.toLocaleString("id-ID")}</Text>
                </Flex>
                <Flex
                  w={"100%"}
                  mt={"20px"}
                  maxH={"300px"}
                  flexDir={"column"}
                  overflowY={"auto"}
                  gap={2}
                >
                  {props.carts.map((val, idx) => {
                    const totalPrice = val.Shoes.price * val.qty;
                    return (
                      <Flex p={2} border={"1px"}>
                        <Center w={"100px"} pr={"10px"}>
                          <Image
                            src={`${process.env.REACT_APP_API_BASE_URL}/${val?.Shoes?.ShoeImages[0]?.shoe_img}`}
                            w={"100%"}
                            objectFit={"cover"}
                            maxW={"140px"}
                            maxH={"140px"}
                          />
                        </Center>
                        <Flex flexDir={"column"} w={"100%"}>
                          <Text fontWeight={"bold"} fontSize={"sm"}>
                            {val.Shoes.name}
                          </Text>
                          <Text fontSize={"sm"}>Size :{val.ShoeSize.size}</Text>

                          <Text fontSize={"sm"}>
                            Weight : {val.Shoes.weight * val.qty} gram
                          </Text>
                          <Flex justify={"right"} w={"100%"}>
                            <Flex flexDir={"column"} pr={"10px"}>
                              <Text fontSize={"sm"}>{val.qty} x </Text>
                              <Text fontSize={"sm"}>Total</Text>
                            </Flex>
                            <Flex flexDir={"column"}>
                              <Text fontSize={"sm"}>
                                {val.Shoes.price.toLocaleString("id-ID")}
                              </Text>
                              <Text fontSize={"sm"}>
                                {totalPrice.toLocaleString("id-ID")}
                              </Text>
                            </Flex>
                          </Flex>
                        </Flex>
                      </Flex>
                    );
                  })}
                </Flex>
              </Flex>
            </Box>
          </Box>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
}
