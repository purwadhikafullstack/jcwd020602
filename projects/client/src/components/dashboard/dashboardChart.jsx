import { Box, Center, Divider, Flex, Image, Text } from "@chakra-ui/react";
import moment from "moment";
import { useEffect, useState } from "react";
import { Chart as ChartJS } from "chart.js/auto"; // tolong jangan dihapus
import { Bar, Doughnut } from "react-chartjs-2";

export default function DashboardChart(props) {
  const { salesData } = props;
  const [barData, setBarData] = useState([]);
  const [doughnutData, setDoughnutData] = useState([]);
  const [bestSeller, setBestSeller] = useState({});
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
  const styleDoughnut = {
    hoverBackgroundColor: "rgba(0,0,0,0.8)",
    backgroundColor: "rgba(0,0,0,0.1)",
    hoverBorderColor: "rgba(0,0,0,1)",
    borderColor: "rgba(0,0,0,1)",
    borderWidth: 2,
  };
  const generateRandomRGBAColor = () => {
    const colors = [];
    const r = Math.floor(Math.random() * 255);
    const g = Math.floor(Math.random() * 255);
    const b = Math.floor(Math.random() * 255);
    const a = Math.floor(Math.random() * 100) / 100;
    for (let i = 0; i < 10; i++) {
      colors.push(`rgba(${r}, ${g}, ${b}, ${a})`);
    }
    return colors;
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
        ...styleDoughnut,
      },
    ],
    options,
  });
  const [bestData, setBestData] = useState({
    labels: [],
    datasets: [
      {
        label: "Best Seller",
        data: [],
        ...styleDoughnut,
      },
    ],
    options,
  });
  function dataTotalPrc() {
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
  }
  function dataTotalSho() {
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
  }
  function dataTotalTra() {
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
  }
  function dataBrandSold() {
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
          ...prevData.datasets[0],
          data: Object.values(brData),
        },
      ],
    }));
  }
  async function dataBestSeller() {
    const bsData = salesData?.reduce((prev, curr) => {
      const shoe = curr.stock.Sho.name;
      if (prev[shoe]) {
        prev[shoe] += curr?.qty;
      } else {
        prev[shoe] = curr?.qty;
      }
      return prev;
    }, {});
    const bS = salesData.reduce((prev, curr) => {
      const shoe = curr.stock.Sho.name;
      if (prev[shoe]) {
        prev[shoe].qty += curr?.qty;
      } else {
        prev[shoe] = curr;
      }
      return prev;
    }, {});
    console.log(bS);
    setBestSeller(
      Object.keys(bS).reduce((prev, curr) => {
        if (!prev?.qty || prev.qty < bS[curr].qty) prev = bS[curr];
        return prev;
      }, {})
    );
    setBestData((prevData) => ({
      ...prevData,
      labels: Object.keys(bsData),
      datasets: [
        {
          ...prevData.datasets[0],
          data: Object.values(bsData),
        },
      ],
    }));
  }
  console.log(bestSeller);
  useEffect(() => {
    dataTotalPrc();
    dataTotalSho();
    dataTotalTra();
    dataBrandSold();
    dataBestSeller();
  }, [salesData]);
  useEffect(() => {
    setBarData([priceData, traData, shoeData]);
    setDoughnutData([brandData, bestData]);
  }, [priceData, traData, shoeData]);
  return (
    <>
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
        {doughnutData
          ? doughnutData?.map((val) => (
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
                    <Doughnut data={val} options={val?.options} />
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
              className="shoe-list"
              cursor={"pointer"}
              _hover={{ bg: "black", color: "white" }}
              pos={"relative"}
              maxW={"500px"}
              w={"100%"}
              h={"250px"}
              border={"1px solid black"}
            >
              {/* <LazyLoadImage
                effect="blur"
                src={`${process.env.REACT_APP_API_BASE_URL}/${bestSeller.stock?.Sho?.shoeImage?.shoe_img}`}
              /> */}
              <Image
                src={`${process.env.REACT_APP_API_BASE_URL}/${
                  bestSeller.stock?.Sho?.shoeImages[0]
                    ? bestSeller.stock?.Sho?.shoeImages[0]?.shoe_img
                    : ""
                }`}
                pos={"absolute"}
                top={0}
                opacity={0}
                transition="opacity 0.5s"
              />

              <Flex flexDir={"column"} p={2}>
                <Text fontWeight={"bold"}>{bestSeller.stock?.Sho?.name}</Text>
                <Divider />
                <Text>{bestSeller.stock?.Sho?.brand?.name}</Text>
                <Divider />
                <Text fontSize={13} color={"gray"}>
                  {bestSeller.stock?.Sho?.Category?.name}{" "}
                  {bestSeller.stock?.Sho?.subcategory?.name}
                </Text>
                <Divider />
                <Text>
                  {bestSeller.stock?.Sho?.price.toLocaleString("id-ID", {
                    style: "currency",
                    currency: "IDR",
                  })}
                </Text>
              </Flex>
            </Box>
          </Flex>
        </Center>
      </Box>
    </>
  );
}
