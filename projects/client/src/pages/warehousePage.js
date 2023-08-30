import {
  Box,
  Button,
  ButtonGroup,
  Center,
  IconButton,
  Tag,
  filter,
} from "@chakra-ui/react";
import { Input, InputGroup, InputRightAddon, Icon } from "@chakra-ui/react";
import { Divider, useDisclosure, TableContainer, Flex } from "@chakra-ui/react";
import { Table, Thead, Tbody, Tr, Th, Td, Select } from "@chakra-ui/react";
import { Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/react";
import { AiOutlinePlus } from "react-icons/ai";
import { GrClose, GrMenu } from "react-icons/gr";
import { FaSearch } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { useFetchWarehouse } from "../hooks/useFetchWarehouse";
import AddWarehouse from "../components/dashboard/addWarehouse";
import EditWarehouse from "../components/dashboard/editWarehouse";
import DeleteWarehouse from "../components/dashboard/deleteWarehouse";
import NavbarDashboard from "../components/dashboard/navbarDashboard";
import Pagination from "../components/dashboard/pagination";

export default function WarehousePage() {
  const addModal = useDisclosure();
  const deleteModal = useDisclosure();
  const editModal = useDisclosure();
  const userSelector = useSelector((state) => state.auth);
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  const inputFileRef = useRef(null);
  const [filter, setFilter] = useState({
    page: 1,
    sort: "",
    order: "",
    search: "",
  });
  const { warehouseFilter, fetch } = useFetchWarehouse(filter);
  const [warehouseId, setWarehouseId] = useState();

  // -------------------------- pagination
  const [pages, setPages] = useState([]);
  const [shown, setShown] = useState({ page: 1 });

  function pageHandler() {
    const output = [];
    for (let i = 1; i <= warehouseFilter?.totalPages; i++) {
      output.push(i);
    }
    setPages(output);
  }
  useEffect(() => {
    pageHandler();
  }, [warehouseFilter]);
  useEffect(() => {
    if (shown.page > 0 && shown.page <= warehouseFilter?.totalPages) {
      setFilter({ ...filter, page: shown.page });
    }
  }, [shown]);
  //  -------------------------

  useEffect(() => {
    fetch();
  }, [filter]);

  function MenuBurger({ warehouse }) {
    return (
      <Menu>
        {({ isOpen }) => (
          <>
            <MenuButton isActive={isOpen} as={Button} p={0}>
              <Icon as={isOpen ? GrClose : GrMenu} />
            </MenuButton>
            <MenuList>
              <MenuItem
                onClick={() => {
                  setSelectedWarehouse(warehouse);
                  editModal.onOpen();
                }}
              >
                Edit
              </MenuItem>
              <MenuItem
                onClick={() => {
                  setWarehouseId(warehouse.id);
                  deleteModal.onOpen();
                }}
              >
                Delete
              </MenuItem>
            </MenuList>
          </>
        )}
      </Menu>
    );
  }

  return (
    <>
      <NavbarDashboard />
      <Box id="content" pt={"52px"}>
        <Box mx={2} my={3}>
          <Flex justify={"space-between"} flexWrap={"wrap"}>
            <Box fontSize={"30px"} fontWeight={"bold"}>
              Warehouse
            </Box>
            {userSelector.role == "SUPERADMIN" ? (
              <ButtonGroup
                onClick={addModal.onOpen}
                isAttached
                variant="outline"
              >
                <IconButton
                  icon={<AiOutlinePlus />}
                  bg={"black"}
                  color={"white"}
                />
                <Button id="button-add" bg={"white"}>
                  Warehouse
                </Button>
              </ButtonGroup>
            ) : null}
            <AddWarehouse
              isOpen={addModal.isOpen}
              onClose={addModal.onClose}
              fetch={fetch}
            />
          </Flex>

          <Flex gap={2} my={2}>
            <InputGroup size={"sm"} maxW={"500px"}>
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
            <Box className="select-filter" w={"100px"}>
              <Box id="title">SORT BY</Box>
              <Select
                size={"sm"}
                placeholder="select.."
                onChange={(e) => {
                  setShown({ page: 1 });
                  setFilter({
                    ...filter,
                    sort: e.target.value,
                  });
                }}
              >
                <option value={"name"}>name</option>
                <option value={"city"}>city</option>
                <option value={"province"}>province</option>
              </Select>
            </Box>
            <Box className="select-filter" w={"100px"}>
              <Box id="title">ORDER BY</Box>
              <Select
                size={"sm"}
                onChange={(e) => {
                  setShown({ page: 1 });
                  setFilter({
                    ...filter,
                    order: e.target.value,
                  });
                }}
              >
                <option value={"ASC"}>ASC</option>
                <option value={"DESC"}>DESC</option>
              </Select>
            </Box>
          </Flex>

          {/* tampilan mobile card */}
          <Box id="card-content" display={"none"}>
            <Flex flexDir={"column"} py={1}>
              {warehouseFilter &&
                warehouseFilter?.rows?.map((warehouse, idx) => (
                  <Flex
                    p={1}
                    m={1}
                    flexDir={"column"}
                    key={warehouse.id}
                    border={"solid"}
                    gap={1}
                  >
                    <Flex justify={"space-between"} align={"center"}>
                      <Box bg={"white"} color={"black"}>
                        #{idx + 1}
                      </Box>
                      {userSelector.role == "SUPERADMIN" ? (
                        <MenuBurger warehouse={warehouse} />
                      ) : null}
                    </Flex>
                    <Box>name: {warehouse.name}</Box>
                    <Divider />
                    <Box>phone: {warehouse.phone}</Box>
                    <Divider />
                    {warehouse?.Admins?.length == 0 ? (
                      <Box>admin: No have admin</Box>
                    ) : (
                      <Box py={1}>
                        admin:
                        {warehouse?.Admins?.map((val, idx) => (
                          <Tag mx={1}>{val.user.name}</Tag>
                        ))}
                      </Box>
                    )}
                    <Divider />
                    <Box>
                      address: {warehouse.address}, {warehouse?.city?.city_name}
                      , {warehouse?.city?.province}, {warehouse.postcode}
                    </Box>
                  </Flex>
                ))}
            </Flex>
          </Box>
          {/* tampilan desktop table */}
          {warehouseFilter?.rows?.length ? (
            <TableContainer id="table-content">
              <Table size="sm">
                <Thead>
                  <Tr>
                    <Th>#</Th>
                    <Th>name</Th>
                    <Th>Phone</Th>
                    <Th>Admin</Th>
                    <Th>Address</Th>
                    <Th>Action</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {warehouseFilter &&
                    warehouseFilter?.rows?.map((warehouse, idx) => (
                      <Tr>
                        <Td w={"5%"}>{idx + 1}</Td>

                        <Td>{warehouse.name}</Td>
                        <Td>{warehouse.phone}</Td>
                        {warehouse?.Admins?.length == 0 ? (
                          <Td>no hve admin</Td>
                        ) : (
                          <Td>
                            {warehouse?.Admins?.map((admin, idx) => (
                              <Tag mr={1}>{admin.user.name}</Tag>
                            ))}
                          </Td>
                        )}
                        <Td>
                          {warehouse.address},{warehouse?.city?.city_name},
                          {warehouse?.city?.province}, {warehouse.postcode}
                        </Td>
                        <Td w={"5%"}>
                          {userSelector.role == "SUPERADMIN" ? (
                            <MenuBurger warehouse={warehouse} />
                          ) : null}
                        </Td>
                      </Tr>
                    ))}
                </Tbody>
                <EditWarehouse
                  data={selectedWarehouse}
                  isOpen={editModal.isOpen}
                  onClose={() => {
                    setSelectedWarehouse(null);
                    editModal.onClose();
                  }}
                  fetch={fetch}
                />
                <DeleteWarehouse
                  id={warehouseId}
                  isOpen={deleteModal.isOpen}
                  onClose={deleteModal.onClose}
                  fetch={fetch}
                />
              </Table>
            </TableContainer>
          ) : (
            <Center border={"1px"} h={"550px"}>
              warehouse not found
            </Center>
          )}
        </Box>
        <Flex p={2} m={2} justify={"center"}>
          <Pagination
            shown={shown}
            setShown={setShown}
            datas={warehouseFilter?.totalPages}
            pages={pages}
          />
        </Flex>
      </Box>
    </>
  );
}
