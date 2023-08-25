import {
  Box,
  Flex,
  Icon,
  Input,
  InputGroup,
  InputRightAddon,
  Select,
} from "@chakra-ui/react";
import { FaSearch } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { useFetchWareProv, useFetchWareCity } from "../hooks/useFetchWarehouse";
import { api } from "../api/api";
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

export default function SalesReportPage() {
  const userSelector = useSelector((state) => state.auth);
  const { provinces } = useFetchWareProv();
  const [province, setprovince] = useState(0);
  const { cities } = useFetchWareCity(province);
  const inputFileRef = useRef(null);
  const [timeFrom, setTimeFrom] = useState();
  const [timeTo, setTimeTo] = useState();
  const [filter, setFilter] = useState({
    search: "",
    warehouse_id: "",
    timeFrom: "",
    timeTo: "",
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
  useEffect(() => {
    if (timeFrom && timeTo) {
      setFilter({ ...filter, timeFrom, timeTo });
    }
  }, [timeFrom, timeTo]);
  useEffect(() => {
    const token = JSON.parse(localStorage.getItem("user"));
    if (token && userSelector.role == "ADMIN") {
      warehouseAdmin(token);
    }
  }, []);
  async function warehouseAdmin(token) {
    const warehouse = await api().get("/warehouses/fetchDefault", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
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
            <Box fontSize={"30px"}>Sales Report</Box>
          </Flex>

          <Flex flexWrap={"wrap"} gap={2} my={2} justify={"space-between"}>
            <InputGroup size={"sm"} w={"500px"}>
              <Input placeholder="Search..." ref={inputFileRef} />
              <InputRightAddon
                cursor={"pointer"}
                onClick={() => {
                  setFilter({ ...filter, search: inputFileRef.current.value });
                }}
              >
                <Icon as={FaSearch} color={"black"} />
              </InputRightAddon>
            </InputGroup>
          </Flex>

          <Box className="orderlist-filter">
            {userSelector.role != "SUPERADMIN" ? null : (
              <>
                <Select
                  id="province"
                  onChange={(e) => {
                    setprovince(e.target.value);
                  }}
                  size={"sm"}
                >
                  <option key={""} value={""}>
                    choose province..
                  </option>
                  {provinces &&
                    provinces.map((val, idx) => (
                      <option value={val?.city?.province}>
                        {val?.city?.province}
                      </option>
                    ))}
                </Select>
                <Select
                  onChange={(e) => {
                    setFilter({ ...filter, warehouse_id: e.target.value });
                  }}
                  id="warehouse_id"
                  size={"sm"}
                  value={filter.warehouse_id}
                >
                  <option key={""} value={""}>
                    choose city..
                  </option>
                  {cities &&
                    cities.map((val, idx) => (
                      <option key={val.id} value={val.id}>
                        {`Warehouse ${val.name} (${val.city.type} ${val.city.city_name})`}
                      </option>
                    ))}
                </Select>
              </>
            )}
            <Box pos={"relative"}>
              <Box
                pos={"absolute"}
                bg={"white"}
                zIndex={2}
                fontSize={10}
                transform={"translate(10px,-7px)"}
              >
                Time from:
              </Box>
              <Input
                size={"sm"}
                id="time"
                type="date"
                onChange={(e) => {
                  setTimeFrom(e.target.value);
                }}
              />
            </Box>
            <Box pos={"relative"}>
              <Box
                pos={"absolute"}
                bg={"white"}
                zIndex={2}
                fontSize={10}
                transform={"translate(10px,-7px)"}
              >
                Time to:
              </Box>
              <Input
                size={"sm"}
                id="time"
                type="date"
                onChange={(e) => {
                  setTimeTo(e.target.value);
                }}
              />
            </Box>
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
