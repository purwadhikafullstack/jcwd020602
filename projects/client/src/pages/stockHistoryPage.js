import { Box, Center, Flex, Select, Spinner } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import Pagination from "../components/dashboard/pagination";
import { useFetchStockHistory } from "../hooks/useFetchStockHistory";
import moment from "moment";
import { useFetchSelectBrand } from "../hooks/useFetchBrand";
import NavbarDashboard from "../components/dashboard/navbarDashboard";
import SearchFilter from "../components/dashboard/searchFilter";
import WarehouseSelect from "../components/dashboard/warehouseSelect";
import FilterTime from "../components/dashboard/filterTime";
import CardHistory from "../components/dashboard/cardHistory";
import TableHistory from "../components/dashboard/tableHistory";
export default function StockHistoryPage() {
  const { brands } = useFetchSelectBrand();
  const [filter, setFilter] = useState({
    page: 1,
    sort: "",
    order: "DESC",
    search: "",
    warehouse_id: "",
    brand_id: "",
    timeFrom: moment().startOf("M").format("YYYY-MM-DD"),
    timeTo: moment().format("YYYY-MM-DD"),
  });
  //pagination ------------------------------------------------------
  const [pages, setPages] = useState([]);
  const [shown, setShown] = useState({ page: 1 });
  const { stockHistories, isLoading } = useFetchStockHistory(filter);
  function pageHandler() {
    const output = [];
    for (let i = 1; i <= stockHistories.totalPages; i++) {
      output.push(i);
    }
    setPages(output);
  }
  useEffect(() => {
    pageHandler();
  }, [stockHistories]);
  useEffect(() => {
    if (shown.page > 0 && shown.page <= stockHistories.totalPages) {
      setFilter({ ...filter, page: shown.page });
    }
  }, [shown]);
  return (
    <>
      <NavbarDashboard />
      <Box id="content" pt={"52px"}>
        <Box mx={2} my={3}>
          <Flex justify={"space-between"} flexWrap={"wrap"}>
            <Box fontSize={"30px"}>Stock History</Box>
          </Flex>
          <SearchFilter
            filter={filter}
            setShown={setShown}
            setFilter={setFilter}
            placeholder={
              "search.. (reference, shoe name, brand name, shoe size)"
            }
            onClick={() => {
              setShown({ page: 1 });
              setFilter({
                ...filter,
                page: 1,
                sort: "",
                order: "DESC",
                search: "",
                brand_id: "",
                timeFrom: moment().startOf("M").format("YYYY-MM-DD"),
                timeTo: moment().format("YYYY-MM-DD"),
              });
            }}
          />
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
                  brand_id: e.target.value,
                });
              }}
              id="brand_id"
              size={"sm"}
              value={filter?.brand_id}
            >
              <option key={""} value={""}>
                choose brand..
              </option>
              {brands?.length &&
                brands?.map((val, idx) => (
                  <option key={val?.id} value={val?.id}>
                    {val?.name}
                  </option>
                ))}
            </Select>
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
                Datetime
              </option>
              <option value={"status"}>Quantity</option>
              <option value={"reference"}>Reference</option>
              <option value={`brand`}>Brand</option>
              <option value={"name"}>Name</option>
              <option value={"size"}>Size</option>
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
          {isLoading ? (
            <Center border={"1px"} h={"550px"}>
              <Spinner />
            </Center>
          ) : (
            <>
              {/* tampilan mobile card */}
              <CardHistory stockHistories={stockHistories} />
              {/* tampilan desktop table */}
              <TableHistory stockHistories={stockHistories} />
            </>
          )}
          <Flex p={2} m={2} justify={"center"}>
            <Pagination
              shown={shown}
              setShown={setShown}
              datas={stockHistories.totalPages}
              pages={pages}
            />
          </Flex>
        </Box>
      </Box>
    </>
  );
}
