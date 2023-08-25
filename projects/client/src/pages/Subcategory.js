import { Box, Button } from "@chakra-ui/react";
import { Divider, Flex, Icon, Input, Table } from "@chakra-ui/react";
import { InputGroup, InputRightAddon, useDisclosure } from "@chakra-ui/react";
import { Thead, Tbody, Tr, Th, Td, TableContainer } from "@chakra-ui/react";
import { Select, Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/react";
import { GrClose, GrMenu } from "react-icons/gr";
import { FaSearch } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { useFetchSubcategory } from "../hooks/useFetchCategory";
import { EditSubcategory } from "../components/dashboard/editCategory";
import { DeleteSubcategory } from "../components/dashboard/deleteCategory";
import NavbarDashboard from "../components/dashboard/navbarDashboard";

export default function SubcategoryPage() {
  const deleteModal = useDisclosure();
  const editModal = useDisclosure();
  const userSelector = useSelector((state) => state.auth);
  const inputFileRef = useRef(null);
  const [search, setSearch] = useState();
  const { sub: subcategory, fetch } = useFetchSubcategory();
  const [subId, setSubId] = useState();
  return (
    <>
      <NavbarDashboard />
      <Box id="content" pt={"52px"}>
        <Box mx={2} my={3}>
          <Box fontSize={"30px"}>Subcategory</Box>
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
              {subcategory &&
                subcategory?.map((sub, idx) => (
                  <Flex
                    p={1}
                    m={1}
                    flexDir={"column"}
                    key={sub.id}
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
                                    setSubId(sub.id);
                                    editModal.onOpen();
                                  }}
                                >
                                  Edit
                                </MenuItem>
                                <MenuItem
                                  onClick={() => {
                                    setSubId(sub.id);
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
                    <Divider />
                    <Box>name: {sub.name}</Box>
                    <Divider />
                    <Box>Category: {sub.Category.name}</Box>
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
                  <Th>Category</Th>
                  <Th>Action</Th>
                </Tr>
              </Thead>
              <Tbody>
                {subcategory &&
                  subcategory?.map((sub, idx) => (
                    <Tr>
                      <Td w={"5%"}>{idx + 1}</Td>
                      <Td>{sub.name}</Td>
                      <Td>{sub.Category.name}</Td>
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
                                      setSubId(sub.id);
                                      editModal.onOpen();
                                    }}
                                  >
                                    Edit
                                  </MenuItem>
                                  <MenuItem
                                    onClick={() => {
                                      setSubId(sub.id);
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
              <EditSubcategory
                id={subId}
                setId={setSubId}
                isOpen={editModal.isOpen}
                onClose={editModal.onClose}
                fetch={fetch}
              />
              <DeleteSubcategory
                id={subId}
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
