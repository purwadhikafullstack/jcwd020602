import {
  Box,
  Flex,
  Icon,
  Input,
  InputGroup,
  InputRightAddon,
  Select,
} from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { api } from "../api/api";
import { useFetchSalesReport } from "../hooks/useFetchOrder";
import ReportCard from "../components/dashboard/reportCard";
import DashboardChart from "../components/dashboard/dashboardChart";
import moment from "moment";
import NavbarDashboard from "../components/dashboard/navbarDashboard";

export default function Dashboard() {
  const userSelector = useSelector((state) => state.auth);
  const [filter, setFilter] = useState({
    warehouse_id: "",
    timeFrom: moment().startOf("month"),
    timeTo: moment().endOf("month"),
  });
  const { salesData } = useFetchSalesReport(filter);
  useEffect(() => {
    const token = JSON.parse(localStorage.getItem("user"));
    if (token && userSelector.role == "ADMIN") {
      warehouseAdmin(token);
    }
  }, []);
  async function warehouseAdmin(token) {
    const warehouse = await api().get("/warehouses/fetchDefault");
    setFilter({
      ...filter,
      warehouse_id: warehouse?.data[0]?.id,
    });
  }
  return (
    <>
      <NavbarDashboard />
      <Box id="content" pt={"52px"}>
        <Box mx={2} my={3}>
          <Flex justify={"space-between"} flexWrap={"wrap"}>
            <Box fontSize={"30px"}>Dashboard</Box>
          </Flex>
          <ReportCard salesData={salesData} />
          <DashboardChart salesData={salesData} />
        </Box>
      </Box>
    </>
  );
}
