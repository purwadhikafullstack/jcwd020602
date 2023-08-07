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
  const [stockMutId, setStockMutId] = useState();
  const [status, setStatus] = useState();
  const [wareAdmin, setWareAdmin] = useState({});
  const [filter, setFilter] = useState({
    page: 1,
    sort: "",
    order: "DESC",
    search: "",
    city_id: "",
    time: "",
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
    warehouseAdmin();
  }, []);
  async function warehouseAdmin() {
    const warehouse = await api.get("/auth/warehousebytoken");
    setWareAdmin(warehouse?.data);
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
              {stockMutations &&
                stockMutations.rows.map((stockMutation, idx) => (
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
                                {filter.city_id ==
                                stockMutation?.fromWarehouse?.city_id ? (
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
                      Mutation Code: MUT/
                      {JSON.parse(stockMutation?.mutation_code).MUT}
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
                      {filter.city_id == stockMutation?.fromWarehouse?.city_id
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
                      {filter.city_id == stockMutation?.fromWarehouse?.city_id
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
                {stockMutations &&
                  stockMutations.rows.map((stockMutation, idx) => (
                    <Tr>
                      <Td w={"5%"}>{idx + 1}</Td>
                      <Td>
                        MUT/{JSON.parse(stockMutation?.mutation_code).MUT}
                      </Td>
                      <Td w={"10%"}>{`${
                        stockMutation?.requestedBy?.name || "AUTO"
                      }`}</Td>
                      <Td w={"10%"}>{`${
                        stockMutation?.requestedBy?.name
                          ? stockMutation?.respondedBy?.name || "PENDING"
                          : "AUTO"
                      }`}</Td>
                      <Td w={"10%"}>
                        {filter.city_id == stockMutation?.fromWarehouse?.city_id
                          ? `${stockMutation?.fromWarehouse?.name} >>> ${stockMutation?.toWarehouse?.name}`
                          : `${stockMutation?.toWarehouse?.name} <<< ${stockMutation?.fromWarehouse?.name}`}
                      </Td>
                      <Td>{`${stockMutation?.stock?.Sho?.name}-${stockMutation?.stock?.shoeSize?.size}-${stockMutation?.stock?.Sho?.brand?.name}`}</Td>
                      <Td>
                        {filter.city_id == stockMutation?.fromWarehouse?.city_id
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
                                  {filter.city_id ==
                                  stockMutation?.fromWarehouse?.city_id ? (
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
                              fetch={fetch}
                              setId={setStockMutId}
                            />
                            <ConfirmStockMutation
                              id={stockMutId}
                              setShown={setShown}
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
              datas={stockMutations?.totalPages}
              pages={pages}
            />
          </Flex>
        </Box>
      </Box>
    </>
  );
}
