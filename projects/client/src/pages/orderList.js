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
  Center,
  Grid,
  Image,
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
import { useFetchBrand } from "../hooks/useFetchBrand";
import { useFetchOrderList } from "../hooks/useFetchOrder";

export default function OrderListPage() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const deleteSM = useDisclosure();
  const editSM = useDisclosure();
  const confirmSM = useDisclosure();
  const userSelector = useSelector((state) => state.auth);
  const inputFileRef = useRef(null);
  const { provinces } = useFetchWareProv();
  const [province, setprovince] = useState(0);
  const { cities } = useFetchWareCity(province);
  const { brands } = useFetchBrand();
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
  });
  //pagination ------------------------------------------------------
  const [pages, setPages] = useState([]);
  const [shown, setShown] = useState({ page: 1 });
  const { orders, fetchOrdersList } = useFetchOrderList(filter);
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
  //----------------------------------------------------------------
  console.log(orders);
  useEffect(() => {
    const token = JSON.parse(localStorage.getItem("user"));
    if (token) {
      warehouseAdmin(token);
    }
  }, []);
  async function warehouseAdmin(token) {
    const warehouse = await api.get("/warehouses/fetchDefault", {
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
      <Box id="content" pt={"52px"}>
        <Box mx={2} my={3}>
          <Flex justify={"space-between"} flexWrap={"wrap"}>
            <Box fontSize={"30px"}>order list</Box>
          </Flex>

          {/*  */}
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
          </Flex>

          <Box className="orderlist-filter">
            {userSelector?.role != "SUPERADMIN" ? null : (
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
                {/* </Flex> */}
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
                  setShown({ page: 1 });
                  setFilter({ ...filter, time: e.target.value });
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
                  setShown({ page: 1 });
                  setFilter({ ...filter, time: e.target.value });
                }}
              />
            </Box>

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
            {orders?.rows &&
              orders?.rows.map((order, idx) => (
                <Box border={"1px"} m={1}>
                  <Flex
                    justify={"space-between"}
                    p={1}
                    bg={"black"}
                    align={"center"}
                  >
                    <Flex flexWrap={"wrap"} gap={1} color={"white"}>
                      <Box>{order?.status}/</Box>
                      <Box>{order?.transaction_code}/</Box>
                      <Box>{order?.user.name}/</Box>
                      <Box>
                        {moment(order?.createdAt).format("DD MMM YYYY, HH:MM")}
                      </Box>
                    </Flex>

                    {order.status != "PENDING" ? (
                      <Flex gap={1}>
                        <Menu>
                          {({ isOpen }) => (
                            <>
                              <MenuButton isActive={isOpen} as={Button} p={0}>
                                <Icon as={isOpen ? GrClose : GrMenu} />
                              </MenuButton>
                              {filter.warehouse_id ==
                              order?.fromWarehouse?.id ? (
                                <MenuList>
                                  <MenuItem
                                    onClick={() => {
                                      setStatus("REJECTED");
                                      setStockMutId(order?.id);
                                      confirmSM.onOpen();
                                    }}
                                  >
                                    Reject
                                  </MenuItem>
                                  <MenuItem
                                    onClick={() => {
                                      setStatus("APPROVED");
                                      setStockMutId(order?.id);
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
                                      setStockMutId(order?.id);
                                      editSM.onOpen();
                                    }}
                                  >
                                    Edit
                                  </MenuItem>
                                  <MenuItem
                                    onClick={() => {
                                      setStockMutId(order?.id);
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

                  {/*  */}
                  <Box className="orderlist-card" m={1}>
                    {/* product */}
                    <Box id="a">
                      {order?.orderDetails?.map((val) => (
                        <Flex gap={2} m={2} align={"center"} border={"1px"}>
                          <Image
                            src={`${process.env.REACT_APP_API_BASE_URL}/${val?.stock?.Sho?.ShoeImages[0]?.shoe_img}`}
                            w={"100%"}
                            objectFit={"cover"}
                            maxW={"140px"}
                            maxH={"140px"}
                          />
                          <Flex flexDir={"column"} gap={1} w={"100%"} mr={1}>
                            <Flex gap={1}>
                              <Box>Name: </Box>
                              <Box> {val?.stock?.Sho?.name} </Box>
                            </Flex>
                            <Flex gap={1}>
                              <Box>Size: </Box>
                              <Box> {val?.qty}</Box>
                            </Flex>
                            <Flex gap={1}>
                              <Box>Qty: </Box>
                              <Box> {val?.qty}</Box>
                            </Flex>
                            <Flex gap={1}>
                              <Box>Price: </Box>
                              <Box> {val?.price}</Box>
                            </Flex>
                          </Flex>
                        </Flex>
                      ))}
                    </Box>
                    {/* addrees */}
                    <Box id="a">
                      <Box px={2} fontWeight={"bold"} borderBottom={"1px"}>
                        Address
                      </Box>
                      <Box m={2}>{order?.address?.address}</Box>
                    </Box>
                    {/* courir */}
                    <Box id="a">
                      <Box px={2} fontWeight={"bold"} borderBottom={"1px"}>
                        Courier
                      </Box>
                      <Box m={2}> {order?.courier}</Box>
                      <Box></Box>
                    </Box>
                  </Box>

                  {/*  */}
                  <Flex justify={"space-between"} m={1} p={1} bg={"gray.100"}>
                    <Box>Total Price: </Box>
                    <Box>{order?.total_price}</Box>
                  </Flex>
                </Box>
              ))}
          </Flex>

          <Flex p={2} m={2} justify={"center"} border={"2px"}>
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
