import { InputRightAddon, InputGroup, ButtonGroup } from "@chakra-ui/react";
import { useDisclosure, TableContainer, MenuButton } from "@chakra-ui/react";
import { Select, Menu, MenuList, MenuItem, Image } from "@chakra-ui/react";
import { Box, Button, Divider, Flex, Icon, Input } from "@chakra-ui/react";
import { Table, Thead, Tbody, Tr, Th, Td, IconButton } from "@chakra-ui/react";
import { AiOutlinePlus } from "react-icons/ai";
import { GrClose, GrMenu } from "react-icons/gr";
import { FaSearch } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { useFetchBrand } from "../hooks/useFetchBrand";
import ImageModal from "../components/dashboard/imageModal";
import { AddBrand } from "../components/dashboard/addCategory";
import { DeleteBrand } from "../components/dashboard/deleteCategory";

export default function BrandPage() {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const addModal = useDisclosure();
  const deleteModal = useDisclosure();
  const editModal = useDisclosure();
  const [img, setImg] = useState();
  const userSelector = useSelector((state) => state.auth);
  const inputFileRef = useRef(null);
  const [search, setSearch] = useState();
  const { brands, fetch } = useFetchBrand();
  const [brandId, setBrandId] = useState();

  return (
    <>
      <Box id="content" pt={"52px"}>
        <Box mx={2} my={3}>
          <Flex justify={"space-between"} flexWrap={"wrap"}>
            <Box fontSize={"30px"}>Brand</Box>
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
                  Brand
                </Button>
              </ButtonGroup>
            ) : null}
            <AddBrand
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
              {brands &&
                brands?.map((brand, idx) => (
                  <Flex
                    p={1}
                    m={1}
                    flexDir={"column"}
                    key={brand.id}
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
                                    setBrandId(brand.id);
                                    editModal.onOpen();
                                  }}
                                >
                                  Edit
                                </MenuItem>
                                <MenuItem
                                  onClick={() => {
                                    setBrandId(brand.id);
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
                    <Box>name: {brand?.name}</Box>
                    <Divider />
                    <Flex gap={2}>
                      <Image
                        cursor={"pointer"}
                        onClick={() => {
                          setImg(brand.logo_img);
                          onOpen();
                        }}
                        src={brand?.logo_img}
                        w={"100px"}
                        h={"100px"}
                        objectFit={"cover"}
                      />
                      <Image
                        cursor={"pointer"}
                        onClick={() => {
                          setImg(brand.brand_img);
                          onOpen();
                        }}
                        src={brand?.brand_img}
                        w={"100px"}
                        h={"100px"}
                        objectFit={"cover"}
                      />
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
                  <Th>name</Th>
                  <Th>Image</Th>
                </Tr>
              </Thead>
              <Tbody>
                {brands &&
                  brands?.map((brand, idx) => (
                    <Tr>
                      <Td w={"5%"}>{idx + 1}</Td>
                      <Td>{brand.name}</Td>
                      <Td>
                        <Flex gap={2}>
                          <Image
                            cursor={"pointer"}
                            onClick={() => {
                              setImg(brand.logo_img);
                              onOpen();
                            }}
                            src={brand.logo_img}
                            w={"50px"}
                            h={"50px"}
                            objectFit={"cover"}
                          />
                          <Image
                            cursor={"pointer"}
                            onClick={() => {
                              setImg(brand.brand_img);
                              onOpen();
                            }}
                            src={brand.brand_img}
                            w={"50px"}
                            h={"50px"}
                            objectFit={"cover"}
                          />
                        </Flex>
                      </Td>

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
                                      setBrandId(brand.id);
                                      editModal.onOpen();
                                    }}
                                  >
                                    Edit
                                  </MenuItem>
                                  <MenuItem
                                    onClick={() => {
                                      setBrandId(brand.id);
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

              {/* <EditCategory
                id={categoyId}
                isOpen={editModal.isOpen}
                onClose={editModal.onClose}
                fetch={fetch}
                setId={setCategoryId}
              /> */}
              <DeleteBrand
                id={brandId}
                isOpen={deleteModal.isOpen}
                onClose={deleteModal.onClose}
                fetch={fetch}
              />
              <ImageModal isOpen={isOpen} onClose={onClose} image={img} />
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </>
  );
}
