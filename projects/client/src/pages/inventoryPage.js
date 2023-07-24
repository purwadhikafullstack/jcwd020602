import {
  Box,
  Button,
  ButtonGroup,
  Divider,
  Flex,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputRightAddon,
  useDisclosure,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Select,
  Avatar,
} from "@chakra-ui/react";
import { AiOutlinePlus } from "react-icons/ai";
import { FaSearch } from "react-icons/fa";
import AddStock from "../components/dashboard/addStock";
import { useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { useFetchWareProv, useFetchWareCity } from "../hooks/useFetchWarehouse";
import { useFetchStock } from "../hooks/useFetchStock";
import Pagination from "../components/dashboard/pagination";
import DeleteStock from "../components/dashboard/deleteStock";
import EditStock from "../components/dashboard/editStock";
import { api } from "../api/api";

export default function InventoryPage() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const deleteS = useDisclosure();
  const editS = useDisclosure();
  const userSelector = useSelector((state) => state.auth);
  const inputFileRef = useRef(null);
  const { provinces } = useFetchWareProv();
  const [province, setprovince] = useState(0);
  const { cities } = useFetchWareCity(province);
  const [stockId, setStockId] = useState();
  const [filter, setFilter] = useState({
    page: 1,
    sort: "",
    order: "ASC",
    search: "",
    city: "",
  });
  //pagination ------------------------------------------------------
  const [pages, setPages] = useState([]);
  const [shown, setShown] = useState({ page: 1 });
  const { stocks, fetch } = useFetchStock(filter);
  function pageHandler() {
    const output = [];
    for (let i = 1; i <= stocks.totalPages; i++) {
      output.push(i);
    }
    setPages(output);
  }
  useEffect(() => {
    pageHandler();
  }, [stocks]);
  useEffect(() => {
    if (shown.page > 0 && shown.page <= stocks.totalPages) {
      setFilter({ ...filter, page: shown.page });
    }
  }, [shown]);
  //-------------------------------------------------------------

  useEffect(() => {
    if (userSelector.role != "SUPERADMIN") {
      const token = JSON.parse(localStorage.getItem("user"));
      if (token) {
        warehouseAdmin(token);
      }
    } else if (userSelector.role == "SUPERADMIN") {
      setFilter({ ...filter, city: "Jakarta Selatan" });
    }
  }, []);
  async function warehouseAdmin(token) {
    const warehouse = await api.get("/auth/warehousebytoken", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setFilter({ ...filter, city: warehouse.data.city });
  }
  return (
    <>
      <Box id="content" pt={"52px"}>
        <Box mx={2} my={3}>
          <Flex justify={"space-between"} flexWrap={"wrap"}>
            <Box fontSize={"30px"}>Inventory</Box>
            <ButtonGroup onClick={onOpen} isAttached variant="outline">
              <IconButton
                icon={<AiOutlinePlus />}
                bg={"black"}
                color={"white"}
              />
              <Button id="button-add" bg={"white"}>
                Inventory
              </Button>
            </ButtonGroup>
            <AddStock
              isOpen={isOpen}
              onClose={onClose}
              fetch={fetch}
              city={filter.city}
              setShown={setShown}
            />
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
                          <option key={val.province} value={val.province}>
                            {val.province}
                          </option>
                        ))}
                    </Select>

                    <Box whiteSpace={"nowrap"}>city:</Box>
                    <Select
                      onChange={(e) => {
                        setShown({ page: 1 });
                        setFilter({ ...filter, city: e.target.value });
                      }}
                      id="city"
                      size={"sm"}
                      value={filter.city}
                    >
                      <option key={""} value={""}>
                        choose city..
                      </option>
                      {cities &&
                        cities.map((val, idx) => (
                          <option key={val.city} value={val.city}>
                            {val.city}
                          </option>
                        ))}
                    </Select>
                  </>
                )}

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
                  <option value={"stock"}>Stock</option>
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
              {stocks &&
                stocks.rows.map((stock, idx) => (
                  <Flex
                    p={1}
                    m={1}
                    flexDir={"column"}
                    key={stock.id}
                    border={"solid"}
                    gap={1}
                  >
                    <Box>#{idx + 1}</Box>
                    <Box>Stock: {stock.stock}</Box>
                    <Divider />
                    <Box>Size: {stock.shoeSize.size}</Box>
                    <Divider />
                    <Box>
                      Shoe: {`${stock.Sho.name} (${stock.Sho.brand.name})`}
                    </Box>
                    <Divider />
                    <Box>Warehouse: {stock.warehouse.name}</Box>
                    <Divider />
                    <Box>City: {stock.warehouse.city}</Box>
                    <Divider />
                    <Box>Province: {stock.warehouse.province}</Box>
                    <Divider />

                    {userSelector.role != "ADMIN" ? (
                      <Flex gap={1}>
                        <Button
                          size={"sm"}
                          colorScheme={"green"}
                          onClick={editS.onOpen}
                        >
                          Edit
                        </Button>
                        <Button
                          size={"sm"}
                          colorScheme={"red"}
                          onClick={deleteS.onOpen}
                        >
                          Delete
                        </Button>
                      </Flex>
                    ) : null}
                  </Flex>
                ))}
            </Flex>
          </Box>
          {/* tampilan desktop table */}
          <TableContainer id="table-content">
            <Table size="sm">
              <Thead>
                <Tr>
                  <Th>#</Th>
                  <Th>Stock</Th>
                  <Th>Size</Th>
                  <Th>Shoe</Th>
                  <Th>City</Th>
                  <Th>Province</Th>
                  <Th>Warehouse</Th>
                </Tr>
              </Thead>
              <Tbody>
                {stocks &&
                  stocks.rows.map((stock, idx) => (
                    <Tr>
                      <Td w={"5%"}>{idx + 1}</Td>
                      <Td>{stock.stock}</Td>
                      <Td>{stock.shoeSize.size}</Td>
                      <Td>{`${stock.Sho.name} (${stock.Sho.brand.name})`}</Td>
                      <Td>{stock.warehouse.city}</Td>
                      <Td>{stock.warehouse.province}</Td>
                      <Td w={"10%"}>{stock.warehouse.name}</Td>

                      <Td w={"15%"}>
                        {userSelector.role == "SUPERADMIN" ? (
                          <Flex justify={"space-between"} gap={1}>
                            <Button
                              size={"sm"}
                              colorScheme={"green"}
                              onClick={() => {
                                setStockId(stock.id);
                                editS.onOpen();
                              }}
                            >
                              Edit
                            </Button>
                            <EditStock
                              id={stockId}
                              isOpen={editS.isOpen}
                              onClose={editS.onClose}
                              fetch={fetch}
                              setId={setStockId}
                            />
                            <Button
                              size={"sm"}
                              colorScheme={"red"}
                              onClick={() => {
                                setStockId(stock.id);
                                deleteS.onOpen();
                              }}
                            >
                              Delete
                            </Button>
                            <DeleteStock
                              id={stockId}
                              setShown={setShown}
                              isOpen={deleteS.isOpen}
                              onClose={deleteS.onClose}
                              fetch={fetch}
                            />
                          </Flex>
                        ) : null}
                      </Td>
                    </Tr>
                  ))}
              </Tbody>
            </Table>
          </TableContainer>
          <Flex
            justifyContent={"center"}
            alignItems={"center"}
            gap={"16px"}
            h={"16px"}
            fontFamily={"Roboto"}
            fontStyle={"normal"}
            fontWeight={"400"}
            fontSize={"12px"}
            lineHeight={"14px"}
          >
            <Pagination
              shown={shown}
              setShown={setShown}
              stocks={stocks}
              pages={pages}
            />
          </Flex>
        </Box>
      </Box>
    </>
  );
}
