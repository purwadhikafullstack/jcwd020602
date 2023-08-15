import { Center, Flex, Text } from "@chakra-ui/react";
import { useFetchOrder } from "../hooks/useFetchOrder";
import { useEffect, useState } from "react";

export default function PaymentVerifPage() {
  const { orders, fetchOrders } = useFetchOrder();
  console.log(orders);

  const formatDate = (isoDate) => {
    const options = {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    };
    return new Date(isoDate).toLocaleDateString("en-US", options);
  };

  return (
    <Center>
      <Flex
        mt={"100px"}
        w={"70vw"}
        h={"50vh"}
        align={"center"}
        justify={"center"}
      >
        <Flex flexDir={"column"} w={"40vw"} h={"100%"} align={"center"}>
          <Text mt={"20px"}>Batas Akhir Pembayaran</Text>
          {orders &&
            orders?.map((val) => (
              <Text key={val.id}>{formatDate(val.last_payment_date)}</Text>
            ))}
        </Flex>
      </Flex>
    </Center>
  );
}
