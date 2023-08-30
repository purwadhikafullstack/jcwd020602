import { Box, Button, Center } from "@chakra-ui/react";
import { Divider, Flex, Icon, Input, Table } from "@chakra-ui/react";
import { InputGroup, InputRightAddon, useDisclosure } from "@chakra-ui/react";
import { Thead, Tbody, Tr, Th, Td, TableContainer } from "@chakra-ui/react";
import { Select, Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/react";
import { GrClose, GrMenu } from "react-icons/gr";
import { FaSearch } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import {
  useFetchCategory,
  useFetchSubcategory,
} from "../hooks/useFetchCategory";
import { EditSubcategory } from "../components/dashboard/editCategory";
import { DeleteSubcategory } from "../components/dashboard/deleteCategory";
import NavbarDashboard from "../components/dashboard/navbarDashboard";
import Pagination from "../components/dashboard/pagination";

export default function SubcategoryPage() {
  const deleteModal = useDisclosure();
  const editModal = useDisclosure();
  const userSelector = useSelector((state) => state.auth);
  const inputFileRef = useRef(null);
  const [subId, setSubId] = useState();
  const { categories } = useFetchCategory();
  const [filter, setFilter] = useState({
    page: 1,
    category: "",
    order: "",
    search: "",
  });
  const { subFilter, fetch } = useFetchSubcategory(filter);
  // -------------------------- pagination
  const [pages, setPages] = useState([]);
  const [shown, setShown] = useState({ page: 1 });

  function pageHandler() {
    const output = [];
    for (let i = 1; i <= subFilter?.totalPages; i++) {
      output.push(i);
    }
    setPages(output);
  }
  useEffect(() => {
    pageHandler();
  }, [subFilter]);
  useEffect(() => {
    if (shown.page > 0 && shown.page <= subFilter?.totalPages) {
      setFilter({ ...filter, page: shown.page });
    }
  }, [shown]);
  //  -------------------------

  useEffect(() => {
    fetch();
  }, [filter]);

  function MenuBurger({ sub }) {
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
    );
  }
  return (
    <>
      <NavbarDashboard />
      <Box id="content" pt={"52px"}>
        <Box mx={2} my={3}>
          <Box fontSize={"30px"} fontWeight={"bold"}>
            Subcategory
          </Box>
          <Flex gap={5} my={2}>
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
            <Box className="select-filter">
              <Box id="title">CATEGORY</Box>
              <Select
                size={"sm"}
                placeholder="select"
                onChange={(e) => {
                  setShown({ page: 1 });
                  setFilter({
                    ...filter,

                    category: e.target.value,
                  });
                }}
              >
                {categories?.map((val) => (
                  <option value={val.name}>{val.name}</option>
                ))}
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
              {subFilter &&
                subFilter?.rows?.map((sub, idx) => (
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
                        <MenuBurger sub={sub} />
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
          {subFilter?.rows?.length ? (
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
                  {subFilter &&
                    subFilter?.rows?.map((sub, idx) => (
                      <Tr>
                        <Td w={"5%"}>{idx + 1}</Td>
                        <Td>{sub.name}</Td>
                        <Td>{sub.Category.name}</Td>
                        <Td w={"5%"}>
                          {userSelector.role == "SUPERADMIN" ? (
                            <MenuBurger sub={sub} />
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
          ) : (
            <Center border={"1px"} h={"550px"}>
              Subcategory not found
            </Center>
          )}
        </Box>
        <Flex p={2} m={2} justify={"center"}>
          <Pagination
            shown={shown}
            setShown={setShown}
            datas={subFilter?.totalPages}
            pages={pages}
          />
        </Flex>
      </Box>
    </>
  );
}
