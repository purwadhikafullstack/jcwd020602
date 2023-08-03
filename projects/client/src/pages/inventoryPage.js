import { Select, Icon, useDisclosure, TableContainer } from "@chakra-ui/react";
import { ButtonGroup, IconButton, InputGroup } from "@chakra-ui/react";
import { Box, Button, Divider, Flex, InputRightAddon } from "@chakra-ui/react";
import { Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/react";
import { Table, Thead, Tbody, Tr, Th, Td, Input } from "@chakra-ui/react";
import { AiOutlinePlus } from "react-icons/ai";
import { GrClose, GrMenu } from "react-icons/gr";
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
  const [wareAdmin, setWareAdmin] = useState({});
  const [filter, setFilter] = useState({
    page: 1,
    sort: "",
    order: "ASC",
    search: "",
    city_id: "",
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
    warehouseAdmin();
  }, []);
  async function warehouseAdmin() {
    const warehouse = await api.get("/auth/warehousebytoken");
    setWareAdmin(warehouse?.data?.warehouse);
    setFilter({
      ...filter,
      city_id: warehouse?.data?.city_id || warehouse.data,
    });
  }
  return (
    <>
      <Box id="content" pt={"52px"}>
        <Box mx={2} my={3}>
          <Flex justify={"space-between"} flexWrap={"wrap"}>
            <Box fontSize={"30px"}>Stock</Box>
            <ButtonGroup onClick={onOpen} isAttached variant="outline">
              <IconButton
                icon={<AiOutlinePlus />}
                bg={"black"}
                color={"white"}
              />
              <Button id="button-add" bg={"white"}>
                Stock
              </Button>
            </ButtonGroup>
            <AddStock
              isOpen={isOpen}
              onClose={onClose}
              fetch={fetch}
              ware={wareAdmin}
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
                          <option
                            key={val?.city?.province}
                            value={val?.city?.province}
                          >
                            {val?.city?.province}
                          </option>
                        ))}
                    </Select>

                    <Box whiteSpace={"nowrap"}>city:</Box>
                    <Select
                      onChange={(e) => {
                        setShown({ page: 1 });
                        setFilter({ ...filter, city_id: e.target.value });
                      }}
                      id="city"
                      size={"sm"}
                      value={filter.city_id}
                    >
                      <option key={""} value={""}>
                        choose city..
                      </option>
                      {cities &&
                        cities.map((val, idx) => (
                          <option
                            key={val.city.city_name}
                            value={val.city.city_id}
                          >
                            {`${val.city.type} ${val.city.city_name}`}
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
                    <Flex justify={"space-between"}>
                      <Box>#{idx + 1}</Box>{" "}
                      {userSelector.role == "SUPERADMIN" ||
                      userSelector.role == "ADMIN" ? (
                        <Flex gap={1}>
                          <Menu>
                            {({ isOpen }) => (
                              <>
                                <MenuButton isActive={isOpen} as={Button} p={0}>
                                  <Icon as={isOpen ? GrClose : GrMenu} />
                                </MenuButton>
                                <MenuList>
                                  <MenuItem
                                    onClick={() => {
                                      setStockId(stock.id);
                                      editS.onOpen();
                                    }}
                                  >
                                    Edit
                                  </MenuItem>
                                  <MenuItem
                                    onClick={() => {
                                      setStockId(stock.id);
                                      deleteS.onOpen();
                                    }}
                                  >
                                    Delete
                                  </MenuItem>
                                </MenuList>
                              </>
                            )}
                          </Menu>
                        </Flex>
                      ) : null}
                    </Flex>
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
                  <Th>Warehouse</Th>
                  <Th>Action</Th>
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
                      <Td w={"10%"}>{stock.warehouse.name}</Td>
                      <Td w={"5%"}>
                        {userSelector.role == "SUPERADMIN" ||
                        userSelector.role == "ADMIN" ? (
                          <Flex justify={"space-between"} gap={1}>
                            <Menu>
                              {({ isOpen }) => (
                                <>
                                  <MenuButton
                                    isActive={isOpen}
                                    as={Button}
                                    p={0}
                                  >
                                    <Icon as={isOpen ? GrClose : GrMenu} />
                                  </MenuButton>
                                  <MenuList>
                                    <MenuItem
                                      onClick={() => {
                                        setStockId(stock.id);
                                        editS.onOpen();
                                      }}
                                    >
                                      Edit
                                    </MenuItem>
                                    <MenuItem
                                      onClick={() => {
                                        setStockId(stock.id);
                                        deleteS.onOpen();
                                      }}
                                    >
                                      Delete
                                    </MenuItem>
                                  </MenuList>
                                </>
                              )}
                            </Menu>
                            <EditStock
                              id={stockId}
                              isOpen={editS.isOpen}
                              onClose={editS.onClose}
                              fetch={fetch}
                              setId={setStockId}
                            />
                            <DeleteStock
                              id={stockId}
                              setShown={setShown}
                              isOpen={deleteS.isOpen}
                              onClose={deleteS.onClose}
                              fetch={fetch}
                              setId={setStockId}
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
              datas={stocks.totalPages}
              pages={pages}
            />
          </Flex>
        </Box>
      </Box>
    </>
  );
}
