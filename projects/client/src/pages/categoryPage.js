import { IconButton, InputGroup, InputRightAddon } from "@chakra-ui/react";
import { ButtonGroup, Divider, Flex, Icon, Input } from "@chakra-ui/react";
import { Table, Thead, Tbody, Tr, Th, Td, Box, Button } from "@chakra-ui/react";
import { Select, Menu, MenuList, MenuItem, Image, Tag } from "@chakra-ui/react";
import { useDisclosure, TableContainer, MenuButton } from "@chakra-ui/react";
import { AiOutlinePlus } from "react-icons/ai";
import { GrClose, GrMenu } from "react-icons/gr";
import { FaSearch } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { useFetchCategory } from "../hooks/useFetchCategory";
import {
  AddCategory,
  AddSubCategory,
} from "../components/dashboard/addCategory";
import { EditCategory } from "../components/dashboard/editCategory";
import { DeleteCategory } from "../components/dashboard/deleteCategory";
import ImageModal from "../components/dashboard/imageModal";
import NavbarDashboard from "../components/dashboard/navbarDashboard";
import Pagination from "../components/dashboard/pagination";

export default function CategoryPage() {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const addModal = useDisclosure();
  const addSub = useDisclosure();
  const deleteModal = useDisclosure();
  const editModal = useDisclosure();
  const userSelector = useSelector((state) => state.auth);
  const [img, setImg] = useState();
  const inputFileRef = useRef(null);
  const [search, setSearch] = useState();
  const [categoyId, setCategoryId] = useState();
  const [filter, setFilter] = useState({
    page: 1,
    sort: "",
    order: "",
    search: "",
  });
  const { categoriesFilter, fetch } = useFetchCategory(filter);

  // -------------------------- pagination
  const [pages, setPages] = useState([]);
  const [shown, setShown] = useState({ page: 1 });

  function pageHandler() {
    const output = [];
    for (let i = 1; i <= categoriesFilter?.totalPages; i++) {
      output.push(i);
    }
    setPages(output);
  }
  useEffect(() => {
    pageHandler();
  }, [categoriesFilter]);
  useEffect(() => {
    if (shown.page > 0 && shown.page <= categoriesFilter?.totalPages) {
      setFilter({ ...filter, page: shown.page });
    }
  }, [shown]);
  //  -------------------------

  useEffect(() => {
    fetch();
  }, [filter]);
  return (
    <>
      <NavbarDashboard />
      <Box id="content" pt={"52px"}>
        <Box mx={2} my={3}>
          <Flex justify={"space-between"} flexWrap={"wrap"}>
            <Box fontSize={"30px"}>Category</Box>
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
                  Category
                </Button>
              </ButtonGroup>
            ) : null}
            <AddCategory
              isOpen={addModal.isOpen}
              onClose={addModal.onClose}
              fetch={fetch}
            />
          </Flex>

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
              {categoriesFilter &&
                categoriesFilter?.rows.map((category, idx) => (
                  <Flex
                    p={1}
                    m={1}
                    flexDir={"column"}
                    key={category.id}
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
                                    setCategoryId(category.id);
                                    addSub.onOpen();
                                  }}
                                >
                                  + Subcategory
                                </MenuItem>
                                <MenuItem
                                  onClick={() => {
                                    setCategoryId(category.id);
                                    editModal.onOpen();
                                  }}
                                >
                                  Edit
                                </MenuItem>
                                <MenuItem
                                  onClick={() => {
                                    setCategoryId(category.id);
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
                    <Box>name: {category?.name}</Box>
                    <Divider />
                    {category?.subcategories?.length == 0 ? (
                      <Box>subcategory: No have subcategory</Box>
                    ) : (
                      <Box py={1}>
                        subcategory:
                        {category?.subcategories?.map((val, idx) => (
                          <Tag mx={1}>{val?.name}</Tag>
                        ))}
                      </Box>
                    )}
                    <Divider />
                    <Image
                      src={`${process.env.REACT_APP_API_BASE_URL}/${category.category_img}`}
                      w={"100px"}
                      h={"100px"}
                      objectFit={"cover"}
                    />
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
                  <Th>Image</Th>
                  <Th>name</Th>
                  <Th>Subcategory</Th>
                  <Th>Action</Th>
                </Tr>
              </Thead>
              <Tbody>
                {categoriesFilter &&
                  categoriesFilter?.rows.map((category, idx) => (
                    <Tr>
                      <Td w={"5%"}>{idx + 1}</Td>
                      <Td>
                        <Image
                          cursor={"pointer"}
                          onClick={() => {
                            setImg(category.category_img);
                            onOpen();
                          }}
                          src={`${process.env.REACT_APP_API_BASE_URL}/${category.category_img}`}
                          w={"30px"}
                        />
                      </Td>
                      <Td>{category.name}</Td>

                      {category?.subcategories?.length == 0 ? (
                        <Td>no hve subcategory</Td>
                      ) : (
                        <Td>
                          {category?.subcategories?.map((val, idx) => (
                            <Tag mr={1}>{val.name}</Tag>
                          ))}
                        </Td>
                      )}
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
                                      setCategoryId(category.id);
                                      addSub.onOpen();
                                    }}
                                  >
                                    + Subcategory
                                  </MenuItem>
                                  <MenuItem
                                    onClick={() => {
                                      setCategoryId(category.id);
                                      editModal.onOpen();
                                    }}
                                  >
                                    Edit
                                  </MenuItem>
                                  <MenuItem
                                    onClick={() => {
                                      setCategoryId(category.id);
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
              <AddSubCategory
                isOpen={addSub.isOpen}
                onClose={addSub.onClose}
                fetch={fetch}
                id={categoyId}
              />
              <EditCategory
                id={categoyId}
                isOpen={editModal.isOpen}
                onClose={editModal.onClose}
                fetch={fetch}
                setId={setCategoryId}
              />
              <DeleteCategory
                id={categoyId}
                isOpen={deleteModal.isOpen}
                onClose={deleteModal.onClose}
                fetch={fetch}
              />
              <ImageModal isOpen={isOpen} onClose={onClose} image={img} />
            </Table>
          </TableContainer>
        </Box>
        <Flex p={2} m={2} justify={"center"}>
          <Pagination
            shown={shown}
            setShown={setShown}
            datas={categoriesFilter?.totalPages}
            pages={pages}
          />
        </Flex>
      </Box>
    </>
  );
}
