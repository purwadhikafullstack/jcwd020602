import { Box, Flex, Select } from "@chakra-ui/react";
import { useState } from "react";
import { useFetchSalesReport } from "../hooks/useFetchOrder";
import {
  useFetchSelectCategory,
  useFetchSelectSubcategory,
} from "../hooks/useFetchCategory";
import { useFetchSelectBrand } from "../hooks/useFetchBrand";
import { useFetchSelectShoe } from "../hooks/useFetchShoe";
import ReportCard from "../components/dashboard/reportCard";
import BarChart from "../components/dashboard/barChart";
import NavbarDashboard from "../components/dashboard/navbarDashboard";
import SearchFilter from "../components/dashboard/searchFilter";
import moment from "moment";
import WarehouseSelect from "../components/dashboard/warehouseSelect";
import FilterTime from "../components/dashboard/filterTime";
export default function SalesReportPage() {
  const [filter, setFilter] = useState({
    search: "",
    warehouse_id: "",
    timeFrom: moment().startOf("W").format("YYYY-MM-DD"),
    timeTo: moment().format("YYYY-MM-DD"),
    brand_id: "",
    category_id: "",
    subcategory_id: "",
    shoe_id: "",
  });
  const { brands } = useFetchSelectBrand();
  const { categories } = useFetchSelectCategory();
  const { sub } = useFetchSelectSubcategory(filter);
  const { shoes } = useFetchSelectShoe(filter);
  const { salesData } = useFetchSalesReport(filter);
  return (
    <>
      <NavbarDashboard />
      <Box id="content" pt={"52px"}>
        <Box mx={2} my={3}>
          <Flex justify={"space-between"} flexWrap={"wrap"}>
            <Box fontSize={"30px"}>Sales Report</Box>
          </Flex>
          <SearchFilter
            filter={filter}
            setShown={(a) => a}
            setFilter={setFilter}
            placeholder={"search.. (transaction code, customer name)"}
            onClick={() => {
              setFilter({
                ...filter,
                search: "",
                timeFrom: moment().startOf("W").format("YYYY-MM-DD"),
                timeTo: moment().format("YYYY-MM-DD"),
                brand_id: "",
                category_id: "",
                subcategory_id: "",
                shoe_id: "",
              });
            }}
          />
          <Box className="orderlist-filter">
            <WarehouseSelect
              filter={filter}
              setFilter={setFilter}
              setShown={(a) => a}
            />
            <FilterTime
              filter={filter}
              setFilter={setFilter}
              setShown={(a) => a}
            />
            <Select
              onChange={(e) => {
                setFilter({
                  ...filter,
                  brand_id: e.target.value,
                  shoe_id: "",
                });
              }}
              id="brand_id"
              size={"sm"}
              value={filter?.brand_id}
            >
              <option key={""} value={""}>
                choose brand..
              </option>
              {brands &&
                brands?.map((val, idx) => (
                  <option key={val?.id} value={val?.id}>
                    {val?.name}
                  </option>
                ))}
            </Select>
            <Select
              onChange={(e) => {
                setFilter({
                  ...filter,
                  category_id: e.target.value,
                  subcategory_id: "",
                  shoe_id: "",
                });
              }}
              id="category_id"
              size={"sm"}
              value={filter?.category_id}
            >
              <option key={""} value={""}>
                choose category..
              </option>
              {categories &&
                categories?.map((val, idx) => (
                  <option key={val?.id} value={val?.id}>
                    {val?.name}
                  </option>
                ))}
            </Select>
            <Select
              onChange={(e) => {
                setFilter({
                  ...filter,
                  subcategory_id: e.target.value,
                  shoe_id: "",
                });
              }}
              id="subcategory_id"
              size={"sm"}
              value={filter?.subcategory_id}
            >
              <option key={""} value={""}>
                choose subcategory..
              </option>
              {sub &&
                sub?.map((val, idx) => (
                  <option key={val?.id} value={val?.id}>
                    {val?.name}
                  </option>
                ))}
            </Select>
            <Select
              onChange={(e) => {
                setFilter({
                  ...filter,
                  shoe_id: e.target.value,
                });
              }}
              id="shoe_id"
              size={"sm"}
              value={filter?.shoe_id}
            >
              <option key={""} value={""}>
                choose shoe..
              </option>
              {shoes &&
                shoes?.map((val, idx) => (
                  <option key={val?.id} value={val?.id}>
                    {val?.name}
                  </option>
                ))}
            </Select>
          </Box>
          <ReportCard salesData={salesData} />
          <BarChart salesData={salesData} />
        </Box>
      </Box>
    </>
  );
}
