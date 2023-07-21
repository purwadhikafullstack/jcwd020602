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
} from "@chakra-ui/react";
import { AiOutlinePlus } from "react-icons/ai";
import { FaSearch } from "react-icons/fa";
import AddWarehouse from "../components/dashboard/addWarehouse";
import { useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { useFetchWarehouse } from "../hooks/useFetchWarehouse";
import EditWarehouse from "../components/dashboard/editWarehouse";
import DeleteWarehouse from "../components/dashboard/deleteWarehouse";

export default function WarehousePage() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const deleteW = useDisclosure();
  const editW = useDisclosure();
  const userSelector = useSelector((state) => state.auth);
  const inputFileRef = useRef(null);
  const [search, setSearch] = useState();
  const { warehouses, fetch } = useFetchWarehouse();

  return (
    <>
      <Box id="content" pt={"52px"} maxW={"1536px"}>
        <Box m={2}>
          <Flex justify={"space-between"} flexWrap={"wrap"}>
            <Box fontSize={"30px"}>Warehouse</Box>
            {userSelector.role == "SUPERADMIN" ? (
              <ButtonGroup onClick={onOpen} isAttached variant="outline">
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
            <AddWarehouse isOpen={isOpen} onClose={onClose} fetch={fetch} />
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
                    <Box bg={"white"} color={"black"}>
                      #{idx + 1}
                    </Box>
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
                    <Divider />
                    {userSelector.role == "SUPERADMIN" ? (
                      <Flex gap={1}>
                        <Button
                          size={"sm"}
                          colorScheme={"green"}
                          onClick={editW.onOpen}
                        >
                          Edit
                        </Button>
                        <Button
                          size={"sm"}
                          colorScheme={"red"}
                          onClick={deleteW.onOpen}
                        >
                          Delete
                        </Button>
                      </Flex>
                    ) : null}
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
                      <Td>
                        {userSelector.role == "SUPERADMIN" ? (
                          <Flex gap={1}>
                            <Button
                              size={"sm"}
                              colorScheme={"green"}
                              onClick={editW.onOpen}
                            >
                              Edit
                            </Button>
                            <EditWarehouse
                              data={warehouse}
                              isOpen={editW.isOpen}
                              onClose={editW.onClose}
                              fetch={fetch}
                            />
                            <Button
                              size={"sm"}
                              colorScheme={"red"}
                              onClick={deleteW.onOpen}
                            >
                              Delete
                            </Button>
                            <DeleteWarehouse
                              data={warehouse}
                              isOpen={deleteW.isOpen}
                              onClose={deleteW.onClose}
                              fetch={fetch}
                            />
                          </Flex>
                        ) : null}
                      </Td>
                    </Tr>
                  ))}
              </Tbody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </>
  );
}
