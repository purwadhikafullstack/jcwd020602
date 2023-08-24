import {
  Box,
  Button,
  Flex,
  Icon,
  Input,
  InputGroup,
  InputRightAddon,
  useDisclosure,
  Select,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Image,
} from "@chakra-ui/react";
import { GrClose, GrMenu } from "react-icons/gr";
import { FaSearch } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { useFetchWareProv, useFetchWareCity } from "../hooks/useFetchWarehouse";
import Pagination from "../components/dashboard/pagination";
import { api } from "../api/api";
import moment from "moment";
import { useFetchOrderList } from "../hooks/useFetchOrder";
import PaymentImageModal from "../components/dashboard/paymentImageModal";
import OrderDetailModal from "../components/dashboard/orderDetailModal";
import NavbarDashboard from "../components/dashboard/navbarDashboard";

export default function OrderListPage() {
  const userSelector = useSelector((state) => state.auth);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const upOrder = useDisclosure();
  const odM = useDisclosure();
  const { provinces } = useFetchWareProv();
  const [province, setprovince] = useState(0);
  const { cities } = useFetchWareCity(province);
  const [proof, setProof] = useState();
  const [order_id, setOrder_id] = useState();
  const inputFileRef = useRef(null);
  const [timeFrom, setTimeFrom] = useState();
  const [timeTo, setTimeTo] = useState();
  const [filter, setFilter] = useState({
    page: 1,
    sort: "",
    order: "DESC",
    search: "",
    warehouse_id: "",
    timeFrom: "",
    timeTo: "",
    status: "",
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
  useEffect(() => {
    if (timeFrom && timeTo) {
      setFilter({ ...filter, timeFrom, timeTo });
    }
  }, [timeFrom, timeTo]);
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
            <Box fontSize={"30px"}>Order List</Box>
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
                setShown({ page: 1 });
                setFilter({
                  ...filter,
                  status: e.target.value,
                });
              }}
              size={"sm"}
            >
              <option value={""}>select..</option>
              <option value={"PAYMENT"}>Waiting for payment</option>
              <option value={`CONFIRM_PAYMENT`}>Pending</option>
              <option value={"CANCELED"}>Canceled</option>
              <option value={`PROCESSING`}>Processing</option>
              <option value={"DELIVERY"}>Delivery</option>
              <option value={"DONE"}>Done</option>
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
                Date Time
              </option>
              <option value={"updatedAt"} selected>
                Last Handled
              </option>
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

                    {order.status == "CONFIRM_PAYMENT" ? (
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
                                    setProof(order);
                                    upOrder.onOpen();
                                  }}
                                >
                                  Proceed Order
                                </MenuItem>
                              </MenuList>
                            </>
                          )}
                        </Menu>
                      </Flex>
                    ) : null}
                  </Flex>

                  <Box className="orderlist-card" m={1}>
                    {/* product */}
                    <Box id="a">
                      <Flex gap={2} m={2} align={"center"} border={"1px"}>
                        <Box>
                          <Image
                            src={`${process.env.REACT_APP_API_BASE_URL}/${order?.orderDetails[0]?.stock?.Sho?.ShoeImages[0]?.shoe_img}`}
                            objectFit={"cover"}
                            w={"250px"}
                            h={"200px"}
                          />
                        </Box>
                        <Flex flexDir={"column"} gap={1} w={"100%"} mr={1}>
                          <Box border={"1px"}>
                            <Box fontSize={10} bg="black" color="white" px={1}>
                              Name
                            </Box>
                            <Box px={1}>
                              {order?.orderDetails[0]?.stock?.Sho?.name}{" "}
                            </Box>
                          </Box>
                          <Box border={"1px"}>
                            <Box fontSize={10} bg="black" color="white" px={1}>
                              Size
                            </Box>
                            <Box px={1}>
                              {order?.orderDetails[0]?.stock?.shoeSize?.size}
                            </Box>
                          </Box>
                          <Box border={"1px"}>
                            <Box fontSize={10} bg="black" color="white" px={1}>
                              Qty
                            </Box>
                            <Box px={1}> {order?.orderDetails[0]?.qty}</Box>
                          </Box>
                          <Box border={"1px"}>
                            <Box fontSize={10} bg="black" color="white" px={1}>
                              Price
                            </Box>
                            <Box px={1}>
                              {order?.orderDetails[0]?.price?.toLocaleString(
                                "id-ID",
                                {
                                  style: "currency",
                                  currency: "IDR",
                                }
                              )}
                            </Box>
                          </Box>
                        </Flex>
                      </Flex>
                      <Flex justify={"center"} p={2} w={"100%"}>
                        <Button
                          id="button"
                          w={"100%"}
                          size={"sm"}
                          onClick={() => {
                            setOrder_id(order?.id);
                            odM.onOpen();
                          }}
                        >
                          {`View Order Details (${order?.orderDetails?.length})`}
                        </Button>
                      </Flex>
                    </Box>
                    {/* addrees */}
                    <Box id="a">
                      <Box px={2} fontWeight={"bold"} borderBottom={"1px"}>
                        Address
                      </Box>
                      <Box m={2}>
                        {`${order?.address?.name}, ${order?.address?.phone}
                        ${order?.address?.address}, ${order?.address?.city?.type},
                        ${order?.address?.city?.city_name},
                        ${order?.address?.city?.province},
                        ${order?.address?.city?.postal_code},
                        (footHub NOTE: ${order?.address?.address_details})`}
                      </Box>
                    </Box>
                    {/* courir */}
                    <Box id="a">
                      <Box px={2} fontWeight={"bold"} borderBottom={"1px"}>
                        Courier
                      </Box>
                      <Box m={2}>
                        {" "}
                        {order?.courier}, {order?.shipping_method},{" "}
                        {order?.shipping_service}, {order?.shipping_duration}
                      </Box>
                      <Box></Box>
                    </Box>
                  </Box>

                  <Flex justify={"space-between"} m={1} border={"1px"} px={1}>
                    <Box fontWeight={"bold"}>Total Price</Box>
                    <Box fontWeight={"bold"}>
                      {order?.total_price?.toLocaleString("id-ID", {
                        style: "currency",
                        currency: "IDR",
                      })}
                    </Box>
                  </Flex>
                </Box>
              ))}
            <PaymentImageModal
              isOpen={upOrder.isOpen}
              onClose={upOrder.onClose}
              order={proof}
              setOrder={setProof}
              fetch={fetchOrdersList}
            />
            <OrderDetailModal
              isOpen={odM.isOpen}
              onClose={odM.onClose}
              order={order_id}
            />
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
