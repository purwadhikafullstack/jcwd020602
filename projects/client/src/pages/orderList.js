import { Box, Flex, Select } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useFetchOrderList } from "../hooks/useFetchOrder";
import NavbarDashboard from "../components/dashboard/navbarDashboard";
import StatusCard from "../components/dashboard/statusCard";
import FilterTime from "../components/dashboard/filterTime";
import Pagination from "../components/dashboard/pagination";
import moment from "moment";
import WarehouseSelect from "../components/dashboard/warehouseSelect";
import SearchFilter from "../components/dashboard/searchFilter";
import OrderListAdmin from "../components/dashboard/orderListAdminCard";
export default function OrderListPage() {
  const [selected, setSelected] = useState(0);
  const [filter, setFilter] = useState({
    page: 1,
    sort: "",
    order: "DESC",
    search: "",
    warehouse_id: "",
    timeFrom: moment().startOf("W").format("YYYY-MM-DD"),
    timeTo: moment().format("YYYY-MM-DD"),
    status: "",
  });
  //pagination ------------------------------------------------------
  const [pages, setPages] = useState([]);
  const [shown, setShown] = useState({ page: 1 });
  const { orders } = useFetchOrderList(filter);
  function pageHandler() {
    const output = [];
    for (let i = 1; i <= orders.totalPages; i++) {
      output.push(i);
    }
    setPages(output);
  }
  useEffect(() => {
    pageHandler();
  }, [orders]);
  useEffect(() => {
    if (shown.page > 0 && shown.page <= orders.totalPages) {
      setFilter({ ...filter, page: shown.page });
    }
  }, [shown]);
  return (
    <>
      <NavbarDashboard />
      <Box id="content" pt={"52px"}>
        <Box mx={2} my={3}>
          <Flex justify={"space-between"} flexWrap={"wrap"}>
            <Box fontSize={"30px"}>Order List</Box>
          </Flex>
          <SearchFilter
            filter={filter}
            setShown={setShown}
            setFilter={setFilter}
            placeholder={"search.. (transaction code, customer name)"}
            onClick={() => {
              setSelected(0);
              setShown({ page: 1 });
              setFilter({
                ...filter,
                page: 1,
                sort: "",
                order: "DESC",
                search: "",
                timeFrom: moment().startOf("W").format("YYYY-MM-DD"),
                timeTo: moment().format("YYYY-MM-DD"),
                status: "",
              });
            }}
          />
          <Flex my={"10px"} justify={"center"}>
            <StatusCard
              selected={selected}
              setSelected={setSelected}
              filter={filter}
              setFilter={setFilter}
              setShown={setShown}
            />
          </Flex>
          <Box className="orderlist-filter">
            <WarehouseSelect
              filter={filter}
              setFilter={setFilter}
              setShown={setShown}
            />
            <FilterTime
              filter={filter}
              setFilter={setFilter}
              setShown={setShown}
            />
            <Select
              onChange={(e) => {
                setShown({ page: 1 });
                setFilter({
                  ...filter,
                  sort: e.target.value,
                  order: "ASC",
                });
              }}
              size={"sm"}
            >
              <option value={""}>select..</option>
              <option value={"createdAt"} selected>
                Date Time
              </option>
              <option value={"updatedAt"}>Last Handled</option>
              <option value={`status`}>Status</option>
              <option value={`name`}>User</option>
              <option value={`transaction_code`}>Order code</option>
            </Select>
            <Select
              onChange={(e) => {
                setShown({ page: 1 });
                setFilter({ ...filter, order: e.target.value });
              }}
              value={filter.order}
              size={"sm"}
              placeholder="select.."
            >
              <option value={"ASC"}>ASC</option>
              <option value={"DESC"} selected>
                DESC
              </option>
            </Select>
          </Box>
          {/* card */}
          <Flex flexDir={"column"} py={1}>
            <OrderListAdmin filter={filter} />
          </Flex>
          <Flex p={2} m={2} justify={"center"}>
            <Pagination
              shown={shown}
              setShown={setShown}
              datas={orders?.totalPages}
              pages={pages}
            />
          </Flex>
        </Box>
      </Box>
    </>
  );
}
