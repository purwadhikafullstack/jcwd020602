import {
  Box,
  Center,
  Flex,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Button,
} from "@chakra-ui/react";
import { Chart as ChartJS } from "chart.js/auto";
import moment from "moment";
import { useEffect, useState } from "react";
import { Bar, Line } from "react-chartjs-2";
import { useFetchExcelReport } from "../../hooks/useFetchOrder";

export default function BarChart(props) {
  const { setExcel } = useFetchExcelReport();
  const { salesData } = props;
  const [mapData, setMapData] = useState([]);
  const options = {
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        stacked: true,
        grid: {
          display: true,
          color: "rgba(255,99,132,0.2)",
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };
  const style = {
    hoverBackgroundColor: "rgba(0,0,0,0.8)",
    backgroundColor: "rgba(0,0,0,0.1)",
    hoverBorderColor: "rgba(0,0,0,1)",
    borderColor: "rgba(0,0,0,1)",
    borderWidth: 2,
    fill: true,
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
  useEffect(() => {
    if (salesData) {
      dataTotPrc();
      dataTotSho();
      dataTotTra();
    }
  }, [salesData]);
  useEffect(() => {
    setMapData([priceData, traData, shoeData]);
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
                <Box w={"100%"}>
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
                <Button
                  onClick={() => {
                    setExcel({
                      header: val.datasets[0].label,
                      label: val.labels,
                      data: val.datasets[0].data,
                    });
                  }}
                  color={"white"}
                  backgroundColor={"black"}
                >
                  Export excel
                </Button>
              </Flex>
            </Center>
          ))
        : null}
    </Box>
  );
}
