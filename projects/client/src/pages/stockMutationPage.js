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
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import { AiOutlinePlus } from "react-icons/ai";
import { GrClose, GrMenu } from "react-icons/gr";
import { FaSearch } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { useFetchWareProv, useFetchWareCity } from "../hooks/useFetchWarehouse";
import Pagination from "../components/dashboard/pagination";
import { api } from "../api/api";
import { useFetchStockMutation } from "../hooks/useFetchStockMutation";
import AddStockMutation from "../components/dashboard/addStockMutation";
import DeleteStockMutation from "../components/dashboard/deleteStockMutation";
import EditStockMutation from "../components/dashboard/editStockMutation";
import ConfirmStockMutation from "../components/dashboard/confirmStockMutation";
import moment from "moment";
import { useFetchSelectBrand } from "../hooks/useFetchBrand";
import NavbarDashboard from "../components/dashboard/navbarDashboard";

export default function StockMutationPage() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const deleteSM = useDisclosure();
  const editSM = useDisclosure();
  const confirmSM = useDisclosure();
  const userSelector = useSelector((state) => state.auth);
  const inputFileRef = useRef(null);
  const { provinces } = useFetchWareProv();
  const [province, setprovince] = useState(0);
  const { cities } = useFetchWareCity(province);
  const { brands } = useFetchSelectBrand();
  const [stockMutId, setStockMutId] = useState();
  const [status, setStatus] = useState();
  const [wareAdmin, setWareAdmin] = useState({});
  const [filter, setFilter] = useState({
    page: 1,
    sort: "",
    order: "DESC",
    search: "",
    warehouse_id: "",
    time: "",
    brand_id: "",
  });
  //pagination ------------------------------------------------------
  const [pages, setPages] = useState([]);
  const [shown, setShown] = useState({ page: 1 });
  const { stockMutations, fetch } = useFetchStockMutation(filter);
  function pageHandler() {
    const output = [];
    for (let i = 1; i <= stockMutations.totalPages; i++) {
      output.push(i);
    }
    setPages(output);
  }
  useEffect(() => {
    pageHandler();
  }, [stockMutations]);
  useEffect(() => {
    if (shown.page > 0 && shown.page <= stockMutations.totalPages) {
      setFilter({ ...filter, page: shown.page });
    }
  }, [shown]);
  //----------------------------------------------------------------
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
    setWareAdmin(warehouse?.data?.warehouse);
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
            <Box fontSize={"30px"}>Stock Mutation</Box>
            <ButtonGroup onClick={onOpen} isAttached variant="outline">
              <IconButton
                icon={<AiOutlinePlus />}
                bg={"black"}
                color={"white"}
              />
              <Button id="button-add" bg={"white"}>
                Stock Mutation
              </Button>
            </ButtonGroup>
            <AddStockMutation
              isOpen={isOpen}
              onClose={onClose}
              ware={wareAdmin}
              fetch={fetch}
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
                          <option value={val?.city?.province}>
                            {val?.city?.province}
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
                </InputGroup>
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
                  <option value={"createdAt"} selected>
                    Date Time
                  </option>
                  <option value={`status`}>Status</option>
                  <option value={`qty`}>Quantity</option>
                  <option value={`brand`}>Brand</option>
                  <option value={"name"}>Product Name</option>
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
                  <option value={"DESC"} selected>
                    DESC
                  </option>
                </Select>
              </Flex>
            </Flex>
          </Flex>
          {/* tampilan mobile card */}
          <Box id="card-content" display={"none"}>
            <Flex flexDir={"column"} py={1}>
              {stockMutations?.rows &&
                stockMutations?.rows.map((stockMutation, idx) => (
                  <Flex
                    p={1}
                    m={1}
                    flexDir={"column"}
                    key={stockMutation?.id}
                    border={"solid"}
                    gap={1}
                  >
                    <Flex justify={"space-between"}>
                      <Box>#{idx + 1}</Box>{" "}
                      {stockMutation.status == "PENDING" ? (
                        <Flex gap={1}>
                          <Menu>
                            {({ isOpen }) => (
                              <>
                                <MenuButton isActive={isOpen} as={Button} p={0}>
                                  <Icon as={isOpen ? GrClose : GrMenu} />
                                </MenuButton>
                                {filter.warehouse_id ==
                                stockMutation?.fromWarehouse?.id ? (
                                  <MenuList>
                                    <MenuItem
                                      onClick={() => {
                                        setStatus("REJECTED");
                                        setStockMutId(stockMutation?.id);
                                        confirmSM.onOpen();
                                      }}
                                    >
                                      Reject
                                    </MenuItem>
                                    <MenuItem
                                      onClick={() => {
                                        setStatus("APPROVED");
                                        setStockMutId(stockMutation?.id);
                                        confirmSM.onOpen();
                                      }}
                                    >
                                      Approve
                                    </MenuItem>
                                  </MenuList>
                                ) : (
                                  <MenuList>
                                    <MenuItem
                                      onClick={() => {
                                        setStockMutId(stockMutation?.id);
                                        editSM.onOpen();
                                      }}
                                    >
                                      Edit
                                    </MenuItem>
                                    <MenuItem
                                      onClick={() => {
                                        setStockMutId(stockMutation?.id);
                                        deleteSM.onOpen();
                                      }}
                                    >
                                      Delete
                                    </MenuItem>
                                  </MenuList>
                                )}
                              </>
                            )}
                          </Menu>
                        </Flex>
                      ) : null}
                    </Flex>
                    <Box>
                      Mutation Code:
                      {stockMutation?.mutation_code}
                    </Box>
                    <Divider />
                    <Box>
                      REQUESTER:{" "}
                      {`${stockMutation?.requestedBy?.name || "AUTO"}`}
                    </Box>
                    <Divider />
                    <Box>
                      RESPONDER:{" "}
                      {`${
                        stockMutation?.requestedBy?.name
                          ? stockMutation?.respondedBy?.name || "PENDING"
                          : "AUTO"
                      }`}
                    </Box>
                    <Divider />
                    <Box>
                      FROM - TO Warehouses:{" "}
                      {filter.warehouse_id == stockMutation?.fromWarehouse?.id
                        ? `${stockMutation?.fromWarehouse?.name} >>> ${stockMutation?.toWarehouse?.name}`
                        : `${stockMutation?.toWarehouse?.name} >>> ${stockMutation?.fromWarehouse?.name}`}
                    </Box>
                    <Divider />
                    <Box>
                      Shoe:{" "}
                      {`${stockMutation?.stock?.Sho?.name}-${stockMutation?.stock?.Sho?.shoeSize?.size}-${stockMutation?.stock?.Sho?.brand?.name}`}
                    </Box>
                    <Divider />
                    <Divider />
                    <Box>
                      Stock:{" "}
                      {filter.warehouse_id == stockMutation?.fromWarehouse?.id
                        ? "-"
                        : "+"}{" "}
                      {stockMutation?.qty}
                    </Box>
                    <Divider />
                    <Divider />
                    <Box>Status: {stockMutation?.status}</Box>
                    <Divider />
                    <Divider />
                    <Box>
                      Date Time:{" "}
                      {moment(stockMutation?.createdAt).format(
                        "DD/MM/YYYY, HH:MM"
                      )}
                    </Box>
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
                  <Th>Mutation Code</Th>
                  <Th>Requester</Th>
                  <Th>Responder</Th>
                  <Th>From-To</Th>
                  <Th>Shoe</Th>
                  <Th>Stock</Th>
                  <Th>Status</Th>
                  <Th>Date Time</Th>
                  <Th>Action</Th>
                </Tr>
              </Thead>
              <Tbody>
                {stockMutations?.rows &&
                  stockMutations?.rows.map((stockMutation, idx) => (
                    <Tr>
                      <Td w={"5%"}>{idx + 1}</Td>
                      <Td>{stockMutation?.mutation_code}</Td>
                      <Td w={"10%"}>{`${
                        stockMutation?.requestedBy?.name || "AUTO"
                      }`}</Td>
                      <Td w={"10%"}>{`${
                        stockMutation?.requestedBy?.name
                          ? stockMutation?.respondedBy?.name || "PENDING"
                          : "AUTO"
                      }`}</Td>
                      <Td w={"10%"}>
                        {filter.warehouse_id == stockMutation?.fromWarehouse?.id
                          ? `${stockMutation?.fromWarehouse?.name} >>> ${stockMutation?.toWarehouse?.name}`
                          : `${stockMutation?.toWarehouse?.name} <<< ${stockMutation?.fromWarehouse?.name}`}
                      </Td>
                      <Td>{`${stockMutation?.stock?.Sho?.name}-${stockMutation?.stock?.shoeSize?.size}-${stockMutation?.stock?.Sho?.brand?.name}`}</Td>
                      <Td>
                        {filter.warehouse_id == stockMutation?.fromWarehouse?.id
                          ? "-"
                          : "+"}{" "}
                        {stockMutation?.qty}
                      </Td>
                      <Td>{stockMutation?.status}</Td>
                      <Td>
                        {moment(stockMutation?.createdAt).format(
                          "DD/MM/YYYY, HH:MM"
                        )}
                      </Td>
                      <Td w={"5%"}>
                        {stockMutation?.status == "PENDING" ? (
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
                                  {filter.warehouse_id ==
                                  stockMutation?.fromWarehouse?.id ? (
                                    <MenuList>
                                      <MenuItem
                                        onClick={() => {
                                          setStatus("REJECTED");
                                          setStockMutId(stockMutation?.id);
                                          confirmSM.onOpen();
                                        }}
                                      >
                                        Reject
                                      </MenuItem>
                                      <MenuItem
                                        onClick={() => {
                                          setStatus("APPROVED");
                                          setStockMutId(stockMutation?.id);
                                          confirmSM.onOpen();
                                        }}
                                      >
                                        Approve
                                      </MenuItem>
                                    </MenuList>
                                  ) : (
                                    <MenuList>
                                      <MenuItem
                                        onClick={() => {
                                          setStockMutId(stockMutation?.id);
                                          editSM.onOpen();
                                        }}
                                      >
                                        Edit
                                      </MenuItem>
                                      <MenuItem
                                        onClick={() => {
                                          setStockMutId(stockMutation?.id);
                                          deleteSM.onOpen();
                                        }}
                                      >
                                        Delete
                                      </MenuItem>
                                    </MenuList>
                                  )}
                                </>
                              )}
                            </Menu>
                            <EditStockMutation
                              id={stockMutId}
                              isOpen={editSM.isOpen}
                              onClose={editSM.onClose}
                              fetch={fetch}
                              setId={setStockMutId}
                            />
                            <DeleteStockMutation
                              id={stockMutId}
                              setShown={setShown}
                              isOpen={deleteSM.isOpen}
                              onClose={deleteSM.onClose}
                              setId={setStockMutId}
                            />
                            <ConfirmStockMutation
                              id={stockMutId}
                              status={status}
                              setStatus={setStatus}
                              isOpen={confirmSM.isOpen}
                              onClose={confirmSM.onClose}
                              fetch={fetch}
                              setId={setStockMutId}
                            />
                          </Flex>
                        ) : null}
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
              datas={stockMutations?.totalPages}
              pages={pages}
            />
          </Flex>
        </Box>
      </Box>
    </>
  );
}
