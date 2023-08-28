import { Box, Button, ButtonGroup, useDisclosure } from "@chakra-ui/react";
import { Flex, IconButton, Select } from "@chakra-ui/react";
import { AiOutlinePlus } from "react-icons/ai";
import { useEffect, useState } from "react";
import Pagination from "../components/dashboard/pagination";
import { useFetchStockMutation } from "../hooks/useFetchStockMutation";
import AddStockMutation from "../components/dashboard/addStockMutation";
import DeleteStockMutation from "../components/dashboard/deleteStockMutation";
import EditStockMutation from "../components/dashboard/editStockMutation";
import ConfirmStockMutation from "../components/dashboard/confirmStockMutation";
import moment from "moment";
import { useFetchSelectBrand } from "../hooks/useFetchBrand";
import NavbarDashboard from "../components/dashboard/navbarDashboard";
import WarehouseSelect from "../components/dashboard/warehouseSelect";
import FilterTime from "../components/dashboard/filterTime";
import SearchFilter from "../components/dashboard/searchFilter";
import CardMutation from "../components/dashboard/cardMutation";
import TableMutation from "../components/dashboard/tableMutation";
export default function StockMutationPage() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const deleteSM = useDisclosure();
  const editSM = useDisclosure();
  const confirmSM = useDisclosure();
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
    timeFrom: moment().startOf("M").format("YYYY-MM-DD"),
    timeTo: moment().format("YYYY-MM-DD"),
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
          <SearchFilter
            filter={filter}
            setShown={setShown}
            setFilter={setFilter}
            placeholder={
              "search.. (mutation code, shoe name, brand name, shoe size)"
            }
            onClick={() => {
              setShown({ page: 1 });
              setFilter({
                ...filter,
                page: 1,
                sort: "",
                order: "DESC",
                search: "",
                timeFrom: moment().startOf("M").format("YYYY-MM-DD"),
                timeTo: moment().format("YYYY-MM-DD"),
                brand_id: "",
              });
            }}
          />
          <Box className="orderlist-filter">
            <WarehouseSelect
              filter={filter}
              setFilter={setFilter}
              setShown={setShown}
              setWareAdmin={setWareAdmin}
            />
            <FilterTime
              filter={filter}
              setFilter={setFilter}
              setShown={setShown}
            />
            <Select
              onChange={(e) => {
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
              {brands &&
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
          <CardMutation
            filter={filter}
            stockMutations={stockMutations}
            deleteSM={deleteSM}
            editSM={editSM}
            confirmSM={confirmSM}
            setStatus={setStatus}
            setStockMutId={setStockMutId}
          />
          <TableMutation
            filter={filter}
            stockMutations={stockMutations}
            deleteSM={deleteSM}
            editSM={editSM}
            confirmSM={confirmSM}
            setStatus={setStatus}
            setStockMutId={setStockMutId}
          />
          <Flex p={2} m={2} justify={"center"} border={"2px"}>
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
