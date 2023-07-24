import {
  Box,
  Button,
  ButtonGroup,
  Divider,
  Flex,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputRightAddon,
  Tag,
  useDisclosure,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Select,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Image,
} from "@chakra-ui/react";
import { AiOutlinePlus } from "react-icons/ai";
import { GrClose, GrMenu } from "react-icons/gr";
import { FaSearch } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFetchShoe } from "../hooks/useFetchShoe";
import AddShoe from "../components/dashboard/addShoe";
import ImageModal from "../components/dashboard/imageModal";

export default function ProductPage() {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [img, setImg] = useState();
  const addModal = useDisclosure();
  const deleteModal = useDisclosure();
  const editModal = useDisclosure();
  const userSelector = useSelector((state) => state.auth);
  const inputFileRef = useRef(null);
  const [search, setSearch] = useState();
  const [shoeId, setShoeId] = useState();
  const { shoes, fetch } = useFetchShoe();
  console.log(shoes);
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
                shoes.map((shoe, idx) => (
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
                  shoes.map((shoe, idx) => (
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

              {/* <EditCategory
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
              />  */}
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </>
  );
}
