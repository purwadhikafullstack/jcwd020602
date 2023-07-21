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
  useDisclosure,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Select,
  Avatar,
} from "@chakra-ui/react";
import { AiOutlinePlus } from "react-icons/ai";
import { FaSearch } from "react-icons/fa";
import AddWarehouse from "../components/dashboard/addWarehouse";
import { useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { useFetchUser } from "../hooks/useFetchUser";
import AssignAdmin, {
  ReassignAdmin,
} from "../components/dashboard/assignAdmin";

export default function UserSettingsPage() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const deleteModal = useDisclosure();
  const editModal = useDisclosure();
  const assignModal = useDisclosure();
  const reassignModal = useDisclosure();
  const userSelector = useSelector((state) => state.auth);
  const inputFileRef = useRef(null);
  const [search, setSearch] = useState();
  const { users, fetch } = useFetchUser();
  const [adminId, setAdminId] = useState();
  return (
    <>
      <Box id="content" pt={"52px"} maxW={"1536px"}>
        <Box m={2}>
          <Flex justify={"space-between"} flexWrap={"wrap"}>
            <Box fontSize={"30px"}>User</Box>
            {userSelector.role == "SUPERADMIN" ? (
              <ButtonGroup onClick={onOpen} isAttached variant="outline">
                <IconButton
                  icon={<AiOutlinePlus />}
                  bg={"black"}
                  color={"white"}
                />
                <Button id="button-add" bg={"white"}>
                  User
                </Button>
              </ButtonGroup>
            ) : null}
            {/* <AddWarehouse isOpen={isOpen} onClose={onClose} fetch={fetch} /> */}
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
                  <option>role</option>
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
              {users &&
                users?.map((user, idx) => (
                  <Flex
                    p={1}
                    m={1}
                    flexDir={"column"}
                    key={user.id}
                    border={"solid"}
                    gap={1}
                  >
                    <Flex justifyContent={"space-between"} align={"center"}>
                      <Box>#{idx + 1}</Box>
                      <Avatar src={user.avatar_url} />
                    </Flex>
                    <Box>Name: {user.name}</Box>
                    <Divider />
                    <Box>Phone: {user.phone}</Box>
                    <Divider />
                    <Box>Email: {user.email}</Box>
                    <Divider />
                    <Box>Role: {user.role}</Box>
                    <Divider />

                    {userSelector.role != "ADMIN" ? (
                      <Flex gap={1}>
                        <Button
                          size={"sm"}
                          colorScheme={"green"}
                          onClick={editModal.onOpen}
                        >
                          Edit
                        </Button>
                        {user.role == "ADMIN" ? (
                          !user.assign ? (
                            <Button
                              size={"sm"}
                              colorScheme={"blue"}
                              onClick={() => {
                                assignModal.onOpen();
                                setAdminId(user.id);
                              }}
                            >
                              Assign
                            </Button>
                          ) : (
                            <Button
                              size={"sm"}
                              colorScheme={"blue"}
                              onClick={() => {
                                reassignModal.onOpen();
                                setAdminId(user.id);
                              }}
                            >
                              Reassign
                            </Button>
                          )
                        ) : null}
                        <Button
                          size={"sm"}
                          colorScheme={"red"}
                          onClick={deleteModal.onOpen}
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
                  <Th>Avatar</Th>
                  <Th>Name</Th>
                  <Th>Phone</Th>
                  <Th>Email</Th>
                  <Th>Role</Th>
                  <Th>Action</Th>
                </Tr>
              </Thead>
              <Tbody>
                {users &&
                  users?.map((user, idx) => (
                    <Tr>
                      <Td w={"5%"}>{idx + 1}</Td>
                      <Td w={"5%"}>
                        <Avatar src={user.avatar_url} size={"sm"} />
                      </Td>
                      <Td>{user.name}</Td>
                      <Td>{user.phone}</Td>
                      <Td>{user.email}</Td>
                      <Td w={"10%"}>{user.role}</Td>
                      <Td w={"15%"}>
                        {userSelector.role == "SUPERADMIN" ? (
                          <Flex justify={"space-between"} gap={1}>
                            <Button
                              size={"sm"}
                              colorScheme={"green"}
                              onClick={editModal.onOpen}
                            >
                              Edit
                            </Button>
                            {user.role == "ADMIN" ? (
                              !user.assign ? (
                                <Button
                                  size={"sm"}
                                  colorScheme={"blue"}
                                  onClick={() => {
                                    assignModal.onOpen();
                                    setAdminId(user.id);
                                  }}
                                >
                                  Assign
                                </Button>
                              ) : (
                                <Button
                                  size={"sm"}
                                  colorScheme={"blue"}
                                  onClick={() => {
                                    reassignModal.onOpen();
                                    setAdminId(user.id);
                                  }}
                                >
                                  Reassign
                                </Button>
                              )
                            ) : null}
                            <AssignAdmin
                              isOpen={assignModal.isOpen}
                              onClose={assignModal.onClose}
                              id={adminId}
                              fetch={fetch}
                            />
                            <ReassignAdmin
                              isOpen={reassignModal.isOpen}
                              onClose={reassignModal.onClose}
                              id={adminId}
                              fetch={fetch}
                            />
                            <Button
                              size={"sm"}
                              colorScheme={"red"}
                              onClick={deleteModal.onOpen}
                            >
                              Delete
                            </Button>
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
