import { Box, Divider, Flex, Icon, Input, Select } from "@chakra-ui/react";
import { InputGroup, InputRightAddon, TableContainer } from "@chakra-ui/react";
import { Table, Thead, Tbody, Tr, Th, Td } from "@chakra-ui/react";
import { FaSearch } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { useFetchWareProv, useFetchWareCity } from "../hooks/useFetchWarehouse";
import Pagination from "../components/dashboard/pagination";
import { api } from "../api/api";
import { useFetchStockHistory } from "../hooks/useFetchStockHistory";
import moment from "moment";
import { useFetchSelectBrand } from "../hooks/useFetchBrand";
import NavbarDashboard from "../components/dashboard/navbarDashboard";

export default function StockHistoryPage() {
  const userSelector = useSelector((state) => state.auth);
  const inputFileRef = useRef(null);
  const { provinces } = useFetchWareProv();
  const [province, setprovince] = useState(0);
  const { cities } = useFetchWareCity(province);
  const { brands } = useFetchSelectBrand();
  const [filter, setFilter] = useState({
    page: 1,
    sort: "",
    order: "ASC",
    search: "",
    warehouse_id: "",
    brand_id: "",
    time: "",
  });
  //pagination ------------------------------------------------------
  const [pages, setPages] = useState([]);
  const [shown, setShown] = useState({ page: 1 });
  const { stockHistories } = useFetchStockHistory(filter);
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
  //-------------------------------------------------------------
  useEffect(() => {
    const token = JSON.parse(localStorage.getItem("user"));
    if (token) {
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
            <Box fontSize={"30px"}>Stock History</Box>
          </Flex>

          <Flex flexWrap={"wrap"} gap={2} my={2} justify={"space-between"}>
            <InputGroup size={"sm"} w={"500px"}>
              <Input placeholder="Search..." ref={inputFileRef} />
              <InputRightAddon
                cursor={"pointer"}
                onClick={() => {
                  setShown({ page: 1 });
                  setFilter({ ...filter, search: inputFileRef.current.value });
                }}
              >
                <Icon as={FaSearch} color={"black"} />
              </InputRightAddon>
            </InputGroup>
            <Flex gap={2} flexWrap={"wrap"}>
              <Flex align={"center"} gap={1}>
                {userSelector.role != "SUPERADMIN" ? null : (
                  <>
                    <Box whiteSpace={"nowrap"}>province:</Box>
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
                          <option
                            key={val.city.province}
                            value={val.city.province}
                          >
                            {val.city.province}
                          </option>
                        ))}
                    </Select>
                    <Box whiteSpace={"nowrap"}>city:</Box>
                    <Select
                      onChange={(e) => {
                        setShown({ page: 1 });
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
                <Box whiteSpace={"nowrap"}>Date Range:</Box>
                <InputGroup size={"sm"}>
                  <Input
                    id="time"
                    placeholder="Month & Year..."
                    type="month"
                    onChange={(e) => {
                      setShown({ page: 1 });
                      setFilter({ ...filter, time: e.target.value });
                    }}
                  />
                  <Box whiteSpace={"nowrap"}>Brand:</Box>
                  <Select
                    onChange={(e) => {
                      setShown({ page: 1 });
                      setFilter({ ...filter, brand_id: e.target.value });
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
                </InputGroup>
                <Box whiteSpace={"nowrap"}> Sort By:</Box>
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
                  <option value={"createdAt"}>Datetime</option>
                  <option value={"status"}>Quantity</option>
                  <option value={"reference"}>Reference</option>
                  <option value={`brand`}>Brand</option>
                  <option value={"name"}>Name</option>
                  <option value={"size"}>Size</option>
                </Select>
              </Flex>
              <Flex align={"center"} gap={1}>
                <Box whiteSpace={"nowrap"}> Order By:</Box>
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
                  <option value={"DESC"}>DESC</option>
                </Select>
              </Flex>
            </Flex>
          </Flex>
          {/* tampilan mobile card */}
          <Box id="card-content" display={"none"}>
            <Flex flexDir={"column"} py={1}>
              {stockHistories &&
                stockHistories.rows.map((stockHistory, idx) => (
                  <Flex
                    p={1}
                    m={1}
                    flexDir={"column"}
                    key={stockHistory?.id}
                    border={"solid"}
                    gap={1}
                  >
                    <Box>#{idx + 1}</Box>
                    <Box>
                      Reference:{stockHistory?.reference}
                      {}
                    </Box>
                    <Divider />
                    <Box>Stock Before: {stockHistory?.stock_before}</Box>
                    <Divider />
                    <Box>Stock After: {stockHistory?.stock_after}</Box>
                    <Divider />
                    <Box>Quantity: {`${stockHistory?.qty}`}</Box>
                    <Divider />
                    <Box>
                      Shoe:{" "}
                      {`${stockHistory?.stock?.Sho?.name} (${stockHistory?.stock?.Sho?.brand?.name})`}
                    </Box>
                    <Divider />
                    <Box>
                      Datetime:{" "}
                      {moment(stockHistory?.createdAt).format(
                        "DD/MM/YYYY, HH:MM"
                      )}
                    </Box>
                    <Divider />
                    <Box>Warehouse: {stockHistory.stock.warehouse.name}</Box>
                    <Divider />
                  </Flex>
                ))}
            </Flex>
          </Box>
          {/* tampilan desktop table */}
          <TableContainer id="table-content">
            <Table size="sm">
              <Thead>
                <Tr>
                  <Th textAlign={"center"}>#</Th>
                  <Th textAlign={"center"}>Reference</Th>
                  <Th textAlign={"center"}>Stock Before</Th>
                  <Th textAlign={"center"}>Stock After</Th>
                  <Th textAlign={"center"}>Quantity</Th>
                  <Th textAlign={"center"}>Shoe</Th>
                  <Th textAlign={"center"}>Size</Th>
                  <Th textAlign={"center"}>Datetime</Th>
                  <Th textAlign={"center"}>Warehouse</Th>
                </Tr>
              </Thead>
              <Tbody>
                {stockHistories &&
                  stockHistories.rows.map((stockHistory, idx) => (
                    <Tr>
                      <Td textAlign={"center"} w={"5%"}>
                        {idx + 1}
                      </Td>
                      <Td textAlign={"center"}>{stockHistory?.reference}</Td>
                      <Td textAlign={"center"}>{stockHistory?.stock_before}</Td>
                      <Td textAlign={"center"}>{stockHistory?.stock_after}</Td>
                      <Td textAlign={"center"}>{`${stockHistory?.qty}`}</Td>
                      <Td
                        textAlign={"center"}
                      >{`${stockHistory?.stock?.Sho?.name} (${stockHistory?.stock?.Sho.brand?.name})`}</Td>
                      <Td textAlign={"center"}>
                        {stockHistory?.stock?.shoeSize?.size}
                      </Td>
                      <Td textAlign={"center"}>
                        {moment(stockHistory?.createdAt).format(
                          "DD/MM/YYYY, HH:MM"
                        )}
                      </Td>
                      <Td textAlign={"center"}>
                        {stockHistory.stock.warehouse.name}
                      </Td>
                    </Tr>
                  ))}
              </Tbody>
            </Table>
          </TableContainer>
          <Flex p={2} m={2} justify={"center"} border={"2px"}>
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
