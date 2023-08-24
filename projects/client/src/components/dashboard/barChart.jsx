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
import moment from "moment";
import { useEffect, useState } from "react";
import { Chart as ChartJS } from "chart.js/auto"; // tolong jangan dihapus
import { Bar } from "react-chartjs-2";
import { useFetchExcelReport } from "../../hooks/useFetchOrder";

export default function BarChart(props) {
  const [isLoading, setIsLoading] = useState(false);
  const { excel, setExcel } = useFetchExcelReport(setIsLoading);
  const { salesData } = props;
  const [mapData, setMapData] = useState([]);
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
  async function dataTotalPrc() {
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
  async function dataTotalSho() {
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
  async function dataTotalTra() {
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
  useEffect(() => {
    dataTotalPrc();
    dataTotalSho();
    dataTotalTra();
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
                              {
                                return idx < 2 ? (
                                  <Tr>
                                    <Td>{label}</Td>
                                    <Td>
                                      {val.datasets[0].data[idx].toLocaleString(
                                        "id-ID"
                                      )}
                                    </Td>
                                  </Tr>
                                ) : null;
                              }
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
                    setIsLoading(true);
                  }}
                  _hover={{ color: "black", backgroundColor: "white" }}
                  color={"white"}
                  backgroundColor={"rgba(0,0,0,1)"}
                  isLoading={isLoading}
                >
                  To see all download excel
                </Button>
              </Flex>
            </Center>
          ))
        : null}
    </Box>
  );
}
