import { Box, Button, ButtonGroup, IconButton, Tag } from "@chakra-ui/react";
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

export default function WarehousePage() {
  const addModal = useDisclosure();
  const deleteModal = useDisclosure();
  const editModal = useDisclosure();
  const userSelector = useSelector((state) => state.auth);
  const inputFileRef = useRef(null);
  const [search, setSearch] = useState();
  const { warehouses, fetch } = useFetchWarehouse();
  const [warehouseId, setWarehouseId] = useState();

  return (
    <>
      <NavbarDashboard />
      <Box id="content" pt={"52px"}>
        <Box mx={2} my={3}>
          <Flex justify={"space-between"} flexWrap={"wrap"}>
            <Box fontSize={"30px"}>Warehouse</Box>
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

          <Flex flexWrap={"wrap"} gap={2} my={2} justify={"space-between"}>
            <InputGroup size={"sm"} w={"500px"}>
              <Input placeholder="Search..." ref={inputFileRef} />
              <InputRightAddon
                cursor={"pointer"}
                onClick={() => {
                  setSearch(inputFileRef.current.value);
                }}
              >
                <Icon as={FaSearch} color={"black"} />
              </InputRightAddon>
            </InputGroup>
            <Flex gap={2}>
              <Flex align={"center"} gap={1}>
                <Box whiteSpace={"nowrap"}> Sort By:</Box>
                <Select size={"sm"} placeholder="select..">
                  <option>name</option>
                  <option>city</option>
                  <option>province</option>
                </Select>
              </Flex>
              <Flex align={"center"} gap={1}>
                <Box whiteSpace={"nowrap"}> Order By:</Box>
                <Select size={"sm"} placeholder="select..">
                  <option>ASC</option>
                  <option>DESC</option>
                </Select>
              </Flex>
            </Flex>
          </Flex>

          {/* tampilan mobile card */}
          <Box id="card-content" display={"none"}>
            <Flex flexDir={"column"} py={1}>
              {warehouses &&
                warehouses?.map((warehouse, idx) => (
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
                        <Menu>
                          {({ isOpen }) => (
                            <>
                              <MenuButton isActive={isOpen} as={Button} p={0}>
                                <Icon as={isOpen ? GrClose : GrMenu} />
                              </MenuButton>
                              <MenuList>
                                <MenuItem
                                  onClick={() => {
                                    setWarehouseId(warehouse.id);
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
                    <Box>address: {warehouse.address}</Box>
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
                  <Th>name</Th>
                  <Th>Phone</Th>
                  <Th>Admin</Th>
                  <Th>Address</Th>
                  <Th>Action</Th>
                </Tr>
              </Thead>
              <Tbody>
                {warehouses &&
                  warehouses?.map((warehouse, idx) => (
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
                      <Td>{warehouse.address}</Td>
                      <Td w={"5%"}>
                        {userSelector.role == "SUPERADMIN" ? (
                          <Menu>
                            {({ isOpen }) => (
                              <>
                                <MenuButton isActive={isOpen} as={Button} p={0}>
                                  <Icon as={isOpen ? GrClose : GrMenu} />
                                </MenuButton>
                                <MenuList>
                                  <MenuItem
                                    onClick={() => {
                                      setWarehouseId(warehouse.id);
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
                        ) : null}
                      </Td>
                    </Tr>
                  ))}
              </Tbody>
              <EditWarehouse
                id={warehouseId}
                isOpen={editModal.isOpen}
                onClose={editModal.onClose}
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
        </Box>
      </Box>
    </>
  );
}
