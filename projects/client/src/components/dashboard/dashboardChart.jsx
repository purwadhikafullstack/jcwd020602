import { Box, Center, Flex } from "@chakra-ui/react";
import moment from "moment";
import { useEffect, useState } from "react";
import { Chart as ChartJS } from "chart.js/auto"; // tolong jangan dihapus
import { Bar, Doughnut } from "react-chartjs-2";
import BestSellerShoe from "./bestSellerShoe";
import { styleDoughnut } from "../../utils/functions";
export default function DashboardChart(props) {
  const { salesData } = props;
  const [barData, setBarData] = useState([]);
  const options = {
    maintainAspectRatio: false,
  };
  const style = {
    hoverBackgroundColor: "rgba(0,0,0,0.8)",
    backgroundColor: "rgba(0,0,0,0.1)",
    hoverBorderColor: "rgba(0,0,0,1)",
    borderColor: "rgba(0,0,0,1)",
    borderWidth: 2,
  };
  const [priceData, setPriceData] = useState({
    labels: [],
    datasets: [
      {
        label: "Incomes",
        data: [],
        ...style,
      },
    ],
    options,
  });
  const [shoeData, setShoeData] = useState({
    labels: [],
    datasets: [
      {
        label: "Shoes Sold",
        data: [],
        ...style,
      },
    ],
    options,
  });
  const [traData, setTraData] = useState({
    labels: [],
    datasets: [
      {
        label: "Transactions",
        data: [],
        ...style,
      },
    ],
    options,
  });
  const [brandData, setBrandData] = useState({
    labels: [],
    datasets: [
      {
        label: "Brand Sold",
        data: [],
      },
    ],
    options,
  });
  async function dataProcessor() {
    const priceData = salesData?.reduce((prev, curr) => {
      const date = moment(curr.createdAt?.split("T")[0]).format("DD-MM-YYYY");
      if (prev[date]) {
        prev[date] += curr?.price;
      } else {
        prev[date] = curr?.price;
      }
      return prev;
    }, {});
    setPriceData((prevData) => ({
      ...prevData,
      labels: Object.keys(priceData),
      datasets: [
        {
          ...prevData.datasets[0],
          data: Object.values(priceData),
        },
      ],
    }));
    const shoeData = salesData?.reduce((prev, curr) => {
      const date = moment(curr.createdAt?.split("T")[0]).format("DD-MM-YYYY");
      if (prev[date]) {
        prev[date] += curr?.qty;
      } else {
        prev[date] = curr?.qty;
      }
      return prev;
    }, {});
    setShoeData((prevData) => ({
      ...prevData,
      labels: Object.keys(shoeData),
      datasets: [
        {
          ...prevData.datasets[0],
          data: Object.values(shoeData),
        },
      ],
    }));
    const processedOrders = [];
    const traData = salesData?.reduce((prev, curr) => {
      const order = curr.order.transaction_code;
      const date = moment(curr.createdAt?.split("T")[0]).format("DD-MM-YYYY");
      if (!processedOrders.includes(order)) {
        if (prev[date]) {
          prev[date] += 1;
        } else {
          prev[date] = 1;
        }
        processedOrders.push(order);
      }
      return prev;
    }, {});
    setTraData((prevData) => ({
      ...prevData,
      labels: Object.keys(traData),
      datasets: [
        {
          ...prevData.datasets[0],
          data: Object.values(traData),
        },
      ],
    }));
    const brData = salesData?.reduce((prev, curr) => {
      const brand = curr.stock.Sho.brand.name;
      if (prev[brand]) {
        prev[brand] += curr?.qty;
      } else {
        prev[brand] = curr?.qty;
      }
      return prev;
    }, {});
    setBrandData((prevData) => ({
      ...prevData,
      labels: Object.keys(brData),
      datasets: [
        {
          data: Object.values(brData),
          ...styleDoughnut(Object.keys(brData).length),
        },
      ],
    }));
  }
  useEffect(() => {
    dataProcessor();
  }, [salesData]);
  useEffect(() => {
    setBarData([priceData, traData, shoeData]);
  }, [priceData, traData, shoeData]);
  return (
    <Flex flexDir={"column"} gap={2}>
      <Box className="barChart">
        {barData
          ? barData?.map((val) => (
              <Center>
                <Flex
                  flexDir={"column"}
                  p={1}
                  border={"1px"}
                  maxW={"500px"}
                  w={"90%"}
                >
                  <Box
                    maxW={"500px"}
                    w={"100%"}
                    h={"250px"}
                    border={"1px solid black"}
                  >
                    <Bar data={val} options={val?.options} />
                  </Box>
                </Flex>
              </Center>
            ))
          : null}
        <Center>
          <Flex
            flexDir={"column"}
            p={1}
            border={"1px"}
            maxW={"500px"}
            w={"90%"}
          >
            <Box
              maxW={"500px"}
              w={"100%"}
              h={"250px"}
              border={"1px solid black"}
            >
              <Doughnut data={brandData} options={brandData?.options} />
            </Box>
          </Flex>
        </Center>
      </Box>
      <BestSellerShoe salesData={salesData} />
    </Flex>
  );
}
