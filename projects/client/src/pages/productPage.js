import { Icon, Input, InputGroup, InputRightAddon } from "@chakra-ui/react";
import { useDisclosure, TableContainer, Select, Image } from "@chakra-ui/react";
import { Box, Button, ButtonGroup, Divider, Flex, Tag } from "@chakra-ui/react";
import { Table, Thead, Tbody, Tr, Th, Td, IconButton } from "@chakra-ui/react";
import { Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/react";
import { AiOutlinePlus } from "react-icons/ai";
import { GrClose, GrMenu } from "react-icons/gr";
import { FaSearch } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useRef, useState } from "react";
import { useFetchShoe } from "../hooks/useFetchShoe";
import AddShoe from "../components/dashboard/addProduct";
import ImageModal from "../components/dashboard/imageModal";
import { DeleteProduct } from "../components/dashboard/deleteProduct";
import EditProduct from "../components/dashboard/editProduct";

export default function ProductPage() {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const addModal = useDisclosure();
  const deleteModal = useDisclosure();
  const editModal = useDisclosure();
  const [img, setImg] = useState();
  const userSelector = useSelector((state) => state.auth);
  const inputFileRef = useRef(null);
  const [search, setSearch] = useState();
  const [shoeId, setShoeId] = useState();
  const { shoes, fetch } = useFetchShoe();
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
                  <option>brand</option>
                  <option>category</option>
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
              {shoes &&
                shoes.rows.map((shoe, idx) => (
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
                    <Flex gap={2}>
                      {shoe?.ShoeImages?.map((val) => (
                        <Image
                          cursor={"pointer"}
                          onClick={() => {
                            setImg(val.shoe_img);
                            onOpen();
                          }}
                          src={val?.shoe_img}
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
                  <Th>name</Th>
                  <Th>Brand</Th>
                  <Th>Category</Th>
                  <Th>Subcategory</Th>
                </Tr>
              </Thead>
              <Tbody>
                {shoes &&
                  shoes.rows.map((shoe, idx) => (
                    <Tr>
                      <Td w={"5%"}>{idx + 1}</Td>
                      <Td>
                        <Flex gap={2}>
                          {shoe?.ShoeImages?.map((val) => (
                            <Image
                              cursor={"pointer"}
                              onClick={() => {
                                setImg(val.shoe_img);
                                onOpen();
                              }}
                              src={val?.shoe_img}
                              w={10}
                            />
                          ))}
                        </Flex>
                      </Td>
                      <Td>{shoe.name}</Td>
                      <Td>{shoe?.brand?.name}</Td>
                      <Td>{shoe?.Category?.name}</Td>
                      <Td>{shoe?.subcategory?.name}</Td>

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
      </Box>
    </>
  );
}
