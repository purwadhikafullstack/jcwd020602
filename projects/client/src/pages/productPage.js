import {
  Grid,
  Icon,
  Input,
  InputGroup,
  InputRightAddon,
} from "@chakra-ui/react";
import { useDisclosure, TableContainer, Select, Image } from "@chakra-ui/react";
import { Box, Button, ButtonGroup, Divider, Flex, Tag } from "@chakra-ui/react";
import { Table, Thead, Tbody, Tr, Th, Td, IconButton } from "@chakra-ui/react";
import { Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/react";
import { AiOutlinePlus } from "react-icons/ai";
import { GrClose, GrMenu } from "react-icons/gr";
import { FaSearch } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { useFetchShoe } from "../hooks/useFetchShoe";
import AddShoe from "../components/dashboard/addProduct";
import ImageModal from "../components/dashboard/imageModal";
import { DeleteProduct } from "../components/dashboard/deleteProduct";
import EditProduct from "../components/dashboard/editProduct";
import Pagination from "../components/dashboard/pagination";

export default function ProductPage() {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const addModal = useDisclosure();
  const deleteModal = useDisclosure();
  const editModal = useDisclosure();
  const [img, setImg] = useState();
  const userSelector = useSelector((state) => state.auth);
  const inputFileRef = useRef(null);
  const [shoeId, setShoeId] = useState();
  const [category, setCategory] = useState();
  const [filter, setFilter] = useState({
    page: 1,
    sort: "",
    order: "",
    search: "",
    brand: "",
  });
  const { shoes, fetch } = useFetchShoe(category, "", filter);
  console.log(category);
  console.log(shoes);

  // -------------------------- pagination
  const [pages, setPages] = useState([]);
  const [shown, setShown] = useState({ page: 1 });

  function pageHandler() {
    const output = [];
    for (let i = 1; i <= shoes?.totalPages; i++) {
      output.push(i);
    }
    setPages(output);
  }
  useEffect(() => {
    pageHandler();
  }, [shoes]);
  useEffect(() => {
    if (shown.page > 0 && shown.page <= shoes?.totalPages) {
      setFilter({ ...filter, page: shown.page });
    }
  }, [shown]);
  //  -------------------------

  useEffect(() => {
    fetch();
  }, [filter]);

  return (
    <>
      <Box id="content" pt={"52px"}>
        <Box mx={2} my={3}>
          <Flex justify={"space-between"} flexWrap={"wrap"}>
            <Box fontSize={"30px"}>Product</Box>
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
                  Product
                </Button>
              </ButtonGroup>
            ) : null}
            <AddShoe
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
                  setShown({ page: 1 });
                  setFilter({ ...filter, search: inputFileRef.current.value });
                }}
              >
                <Icon as={FaSearch} color={"black"} />
              </InputRightAddon>
            </InputGroup>

            <Flex gap={2}>
              <Select
                size={"sm"}
                onChange={(e) => {
                  setShown({ page: 1 });
                  setFilter({ ...filter, brand: e.target.value });
                }}
              >
                <option value={""}>FILTER BY BRAND:</option>
                <option value={"Adidas"}>Adidas</option>
                <option value={"Nike"}>Nike</option>
                <option value={"Converse"}>Converse</option>
                <option value={"Vans"}>Vans</option>
                <option value={"Puma"}>Puma</option>
                <option value={"New Balance"}>New Balance</option>
              </Select>
              <Select
                size={"sm"}
                onChange={(e) => {
                  setShown({ page: 1 });
                  setCategory(e.target.value);
                }}
              >
                <option value={""}>FILTER BY CATEGORY:</option>
                <option value={"Men"}>Men</option>
                <option value={"Women"}>Women</option>
                <option value={"Kid"}>Kid</option>
              </Select>

              <Select
                size={"sm"}
                onChange={(e) => {
                  setShown({ page: 1 });
                  setFilter({
                    ...filter,
                    sort: e.target.value.split(",")[0],
                    order: e.target.value.split(",")[1],
                  });
                }}
              >
                <option value={","}>ORDER BY: </option>
                <option value={"name,ASC"}>Name: A to Z</option>
                <option value={"name,DESC"}>Name: Z to A</option>
                <option value={"price,ASC"}>Price: LOW to HIGH</option>
                <option value={"price,DESC"}>Price: HIGH to LOW</option>
              </Select>
            </Flex>
          </Flex>

          {/* tampilan mobile card */}
          <Box id="card-content" display={"none"}>
            <Flex flexDir={"column"} py={1}>
              {shoes.rows &&
                shoes?.rows?.map((shoe, idx) => (
                  <Flex
                    p={1}
                    m={1}
                    flexDir={"column"}
                    key={shoe.id}
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
                                    setShoeId(shoe.id);
                                    editModal.onOpen();
                                  }}
                                >
                                  Edit
                                </MenuItem>
                                <MenuItem
                                  onClick={() => {
                                    setShoeId(shoe.id);
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
                    <Box>name: {shoe.name} </Box>
                    <Divider />
                    <Box>Brand: {shoe?.brand?.name} </Box>
                    <Divider />
                    <Box>Category: {shoe?.Category?.name} </Box>
                    <Divider />
                    <Box>Subcategory: {shoe?.subcategory?.name} </Box>
                    <Divider />
                    <Box>status: {shoe?.status} </Box>
                    <Divider />
                    <Flex gap={2}>
                      {shoe?.ShoeImages?.map((val) => (
                        <Image
                          cursor={"pointer"}
                          onClick={() => {
                            setImg(val.shoe_img);
                            onOpen();
                          }}
                          src={`${process.env.REACT_APP_API_BASE_URL}/${val?.shoe_img}`}
                          w={10}
                        />
                      ))}
                    </Flex>
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
                  <Th>Name</Th>
                  <Th>Price</Th>
                  <Th>Brand</Th>
                  <Th>Category</Th>
                  <Th>Subcategory</Th>
                  <Th>status</Th>
                </Tr>
              </Thead>
              <Tbody>
                {shoes?.rows &&
                  shoes?.rows?.map((shoe, idx) => (
                    <Tr>
                      <Td w={"5%"}>{idx + 1}</Td>
                      <Td>
                        <Grid templateColumns={"repeat(2, 1fr)"} w={"100px"}>
                          {shoe?.ShoeImages?.map((val) => (
                            <Image
                              cursor={"pointer"}
                              onClick={() => {
                                setImg(val.shoe_img);
                                onOpen();
                              }}
                              src={`${process.env.REACT_APP_API_BASE_URL}/${val?.shoe_img}`}
                              // w={10}
                            />
                          ))}
                        </Grid>
                      </Td>
                      <Td>{shoe?.name}</Td>
                      <Td>{shoe?.price}</Td>
                      <Td>{shoe?.brand?.name}</Td>
                      <Td>{shoe?.Category?.name}</Td>
                      <Td>{shoe?.subcategory?.name}</Td>
                      <Td>{shoe?.status}</Td>

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
                                      setShoeId(shoe.id);
                                      editModal.onOpen();
                                    }}
                                  >
                                    Edit
                                  </MenuItem>
                                  <MenuItem
                                    onClick={() => {
                                      setShoeId(shoe.id);
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
              <ImageModal isOpen={isOpen} onClose={onClose} image={img} />
              <DeleteProduct
                id={shoeId}
                isOpen={deleteModal.isOpen}
                onClose={deleteModal.onClose}
                fetch={fetch}
              />
              <EditProduct
                id={shoeId}
                isOpen={editModal.isOpen}
                onClose={editModal.onClose}
                fetch={fetch}
                setId={setShoeId}
              />
            </Table>
          </TableContainer>
        </Box>
        <Flex p={2} m={2} justify={"center"} border={"2px"}>
          <Pagination
            shown={shown}
            setShown={setShown}
            datas={shoes?.totalPages}
            pages={pages}
          />
        </Flex>
      </Box>
    </>
  );
}
