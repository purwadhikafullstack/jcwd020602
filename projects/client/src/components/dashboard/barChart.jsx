import {
  Box,
  Center,
  Flex,
  Grid,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { Chart as ChartJS } from "chart.js/auto";
import moment from "moment";
import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";

export default function BarChart(props) {
  const { salesData } = props;
  const [mapData, setMapData] = useState([]);
  const [priceData, setPriceData] = useState({
    labels: [],
    datasets: [
      {
        label: "Incomes",
        data: [],
        backgroundColor: ["black", "blue", "red"],
      },
    ],
    options: {
      responsive: true,
      width: 400, // Adjust width as needed
      height: 300, // Adjust height as needed
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
  const [shoeData, setShoeData] = useState({
    labels: [],
    datasets: [
      {
        label: "Shoes Sold",
        data: [],
        backgroundColor: ["black", "blue", "red"],
      },
    ],
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
  const [traData, setTraData] = useState({
    labels: [],
    datasets: [
      {
        label: "Transactions Made",
        data: [],
        backgroundColor: ["black", "blue", "red"],
      },
    ],
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
  async function dataTotPrc() {
    const priceData = salesData?.data?.reduce((prev, curr) => {
      const date = moment(curr.createdAt?.split("T")[0]).format("DD-MM-YYYY");
      if (prev[date]) {
        prev[date] += curr?.price;
      } else {
        prev[date] = curr?.price;
      }
      return prev;
    }, {});
    const labels = Object.keys(priceData);
    const values = Object.values(priceData);
    setPriceData((prevData) => ({
      ...prevData,
      labels: labels,
      datasets: [
        {
          ...prevData.datasets[0],
          data: values,
        },
      ],
    }));
  }
  async function dataTotSho() {
    const shoeData = salesData?.data?.reduce((prev, curr) => {
      const date = moment(curr.createdAt?.split("T")[0]).format("DD-MM-YYYY");
      if (prev[date]) {
        prev[date] += curr?.qty;
      } else {
        prev[date] = curr?.qty;
      }
      return prev;
    }, {});
    const labels = Object.keys(shoeData);
    const values = Object.values(shoeData);
    setShoeData((prevData) => ({
      ...prevData,
      labels: labels,
      datasets: [
        {
          ...prevData.datasets[0],
          data: values,
        },
      ],
    }));
  }
  async function dataTotTra() {
    const processedOrders = [];
    const traData = salesData?.data?.reduce((prev, curr) => {
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
    const labels = Object.keys(traData);
    const values = Object.values(traData);
    setTraData((prevData) => ({
      ...prevData,
      labels: labels,
      datasets: [
        {
          ...prevData.datasets[0],
          data: values,
        },
      ],
    }));
  }
  useEffect(() => {
    if (salesData) {
      dataTotPrc();
      dataTotSho();
      dataTotTra();
    }
  }, [salesData]);
  useEffect(() => {
    setMapData([priceData, shoeData, traData]);
  }, [priceData, shoeData, traData]);
  return (
    <Box className="barChart">
      {mapData
        ? mapData?.map((val) => (
            <Center>
              <Flex
                flexDir={"column"}
                p={1}
                border={"1px"}
                maxW={"400px"}
                w={"100%"}
              >
                <Box maxW={"500px"} w={"100%"}>
                  <Line data={val} options={val?.options} />
                </Box>
                <Box maxW={"500px"} w={"100%"}>
                  <TableContainer mt={2}>
                    <Table variant="simple">
                      <Thead>
                        <Tr>
                          <Th>Date</Th>
                          <Th>{val?.datasets[0].label}</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {val.labels
                          ? val?.labels?.map((label, idx) => {
                              return (
                                <Tr>
                                  <Td>{label}</Td>
                                  <Td>{val.datasets[0].data[idx]}</Td>
                                </Tr>
                              );
                            })
                          : null}
                      </Tbody>
                    </Table>
                  </TableContainer>
                </Box>
              </Flex>
            </Center>
          ))
        : null}
    </Box>
  );
}
