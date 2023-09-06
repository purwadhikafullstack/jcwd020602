import {
  InputRightAddon,
  InputGroup,
  ButtonGroup,
  Center,
} from "@chakra-ui/react";
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
import Pagination from "../components/dashboard/pagination";
import NavbarDashboard from "../components/dashboard/navbarDashboard";
// ----------------------------------------------- CLEAR -FAHMI
export default function BrandPage() {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const addModal = useDisclosure();
  const deleteModal = useDisclosure();
  const [img, setImg] = useState();
  const userSelector = useSelector((state) => state.auth);
  const inputFileRef = useRef(null);
  const [brandId, setBrandId] = useState();
  const [filter, setFilter] = useState({
    page: 1,
    sort: "",
    order: "",
    search: "",
  });
  const { brandsFilter, fetch } = useFetchBrand(filter);
  // -------------------------- pagination
  const [pages, setPages] = useState([]);
  const [shown, setShown] = useState({ page: 1 });

  function pageHandler() {
    const output = [];
    for (let i = 1; i <= brandsFilter?.totalPages; i++) {
      output.push(i);
    }
    setPages(output);
  }
  useEffect(() => {
    pageHandler();
  }, [brandsFilter]);
  useEffect(() => {
    if (shown.page > 0 && shown.page <= brandsFilter?.totalPages) {
      setFilter({ ...filter, page: shown.page });
    }
  }, [shown]);
  //  -------------------------

  useEffect(() => {
    fetch();
  }, [filter]);

  function MenuBurger({ brand }) {
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
    );
  }

  return (
    <>
      <NavbarDashboard />
      <Box id="content" pt={"52px"}>
        <Box mx={2} my={3}>
          <Flex justify={"space-between"} flexWrap={"wrap"}>
            <Box fontSize={"30px"} fontWeight={"bold"}>
              Brand
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
              {brandsFilter &&
                brandsFilter?.rows.map((brand, idx) => (
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
                        <MenuBurger brand={brand} />
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
                        src={`${process.env.REACT_APP_API_BASE_URL}/${brand.logo_img}`}
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
                        src={`${process.env.REACT_APP_API_BASE_URL}/${brand?.brand_img}`}
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
          {brandsFilter?.rows.length ? (
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
                  {brandsFilter &&
                    brandsFilter?.rows.map((brand, idx) => (
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
                              src={`${process.env.REACT_APP_API_BASE_URL}/${brand.logo_img}`}
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
                              src={`${process.env.REACT_APP_API_BASE_URL}/${brand.brand_img}`}
                              w={"50px"}
                              h={"50px"}
                              objectFit={"cover"}
                            />
                          </Flex>
                        </Td>

                        <Td w={"5%"}>
                          {userSelector.role == "SUPERADMIN" ? (
                            <MenuBurger brand={brand} />
                          ) : null}
                        </Td>
                      </Tr>
                    ))}
                  <DeleteBrand
                    id={brandId}
                    isOpen={deleteModal.isOpen}
                    onClose={deleteModal.onClose}
                    fetch={fetch}
                  />
                </Tbody>
              </Table>
            </TableContainer>
          ) : (
            <Center border={"1px"} h={"550px"}>
              Brand not found
            </Center>
          )}
        </Box>
        <Flex p={2} m={2} justify={"center"}>
          <Pagination
            shown={shown}
            setShown={setShown}
            datas={brandsFilter?.totalPages}
            pages={pages}
          />
        </Flex>
      </Box>

      <ImageModal isOpen={isOpen} onClose={onClose} image={img} />
    </>
  );
}
