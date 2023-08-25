import { Box, Center, Divider, Flex, Image, Text } from "@chakra-ui/react";
import moment from "moment";
import { useEffect, useState } from "react";
import { Chart as ChartJS } from "chart.js/auto"; // tolong jangan dihapus
import { Bar, Doughnut } from "react-chartjs-2";
import { api } from "../../api/api";

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
  function generateRandomRGBAColor(length) {
    const colors1 = [];
    const colors2 = [];
    for (let i = 0; i < length; i++) {
      const r = Math.floor(Math.random() * 255);
      const g = Math.floor(Math.random() * 255);
      const b = Math.floor(Math.random() * 255);
      colors1.push(`rgba(${r}, ${g}, ${b}, 1)`);
      colors2.push(`rgba(${r}, ${g}, ${b}, 0.6)`);
    }
    return { colors1, colors2 };
  }
  function styleDoughnut(length) {
    const { colors1, colors2 } = generateRandomRGBAColor(length);
    const style = {
      hoverBackgroundColor: colors1,
      backgroundColor: colors2,
      hoverBorderColor: colors2,
      borderColor: colors1,
      borderWidth: 2,
    };
    return style;
  }
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
        ...style,
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
        ...style,
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
          ...styleDoughnut(Object.keys(brData).length),
        },
      ],
    }));
  }
  const [bestShoes, setBestShoes] = useState([]);
  async function dataBestSeller() {
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
    dataTotalPrc();
    dataTotalSho();
    dataTotalTra();
    dataBrandSold();
    dataBestSeller();
  }, [salesData]);
  useEffect(() => {
    setBarData([priceData, traData, shoeData]);
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
      <Flex p={5}>
        {bestShoes.map((val, idx) => (
          <Flex
            flexDir={"column"}
            p={1}
            border={"1px"}
            maxW={"500px"}
            w={"90%"}
          >
            <Box
              className="shoe-list"
              _hover={{ bg: "black", color: "white" }}
              pos={"relative"}
              maxW={"500px"}
              w={"100%"}
              h={"500px"}
              border={"1px solid black"}
            >
              <Image
                src={`${process.env.REACT_APP_API_BASE_URL}/${val.stock?.Sho?.ShoeImages[0]?.shoe_img}`}
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
    </>
  );
}
