import { Box, Button, ButtonGroup, IconButton } from "@chakra-ui/react";
import { Flex, Select, useDisclosure } from "@chakra-ui/react";
import { AiOutlinePlus } from "react-icons/ai";
import AddStock from "../components/dashboard/addStock";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useFetchStock } from "../hooks/useFetchStock";
import Pagination from "../components/dashboard/pagination";
import DeleteStock from "../components/dashboard/deleteStock";
import EditStock from "../components/dashboard/editStock";
import { useFetchSelectBrand } from "../hooks/useFetchBrand";
import NavbarDashboard from "../components/dashboard/navbarDashboard";
import SearchFilter from "../components/dashboard/searchFilter";
import WarehouseSelect from "../components/dashboard/warehouseSelect";
import CardStock from "../components/dashboard/cardStock";
import TableStock from "../components/dashboard/tableStock";
export default function InventoryPage() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const deleteS = useDisclosure();
  const editS = useDisclosure();
  const userSelector = useSelector((state) => state.auth);
  const { brands } = useFetchSelectBrand();
  const [stockId, setStockId] = useState();
  const [wareAdmin, setWareAdmin] = useState({});
  const [filter, setFilter] = useState({
    page: 1,
    sort: "",
    order: "ASC",
    search: "",
    warehouse_id: "",
    brand_id: "",
  });
  //pagination ------------------------------------------------------
  const [pages, setPages] = useState([]);
  const [shown, setShown] = useState({ page: 1 });
  const { stocks, fetch } = useFetchStock(filter);
  function pageHandler() {
    const output = [];
    for (let i = 1; i <= stocks?.totalPages; i++) {
      output.push(i);
    }
    setPages(output);
  }
  useEffect(() => {
    pageHandler();
  }, [stocks]);
  useEffect(() => {
    if (shown.page > 0 && shown.page <= stocks?.totalPages) {
      setFilter({ ...filter, page: shown.page });
    }
  }, [shown]);
  return (
    <>
      <NavbarDashboard />
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
            />
          </Flex>
          <SearchFilter
            filter={filter}
            setShown={setShown}
            setFilter={setFilter}
            placeholder={"search.. (shoe name, brand name, shoe size)"}
            onClick={() => {
              setShown({ page: 1 });
              setFilter({
                ...filter,
                page: 1,
                sort: "",
                order: "ASC",
                search: "",
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
              value={filter.sort}
              size={"sm"}
            >
              <option value={""}>select..</option>
              <option value={"stock"}>Stock</option>
              <option value={`brand`}>Brand</option>
              <option value={"name"}>Name</option>
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
              <option value={"DESC"}>DESC</option>
            </Select>
          </Box>
          {/* tampilan mobile card */}
          <CardStock
            stocks={stocks}
            setStockId={setStockId}
            editS={editS}
            deleteS={deleteS}
          />
          {/* tampilan desktop table */}
          <TableStock
            stocks={stocks}
            setStockId={setStockId}
            editS={editS}
            deleteS={deleteS}
          />
          <Flex p={2} m={2} justify={"center"} border={"2px"}>
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
              setId={setStockId}
            />
            <Pagination
              shown={shown}
              setShown={setShown}
              datas={stocks?.totalPages}
              pages={pages}
            />
          </Flex>
        </Box>
      </Box>
    </>
  );
}
