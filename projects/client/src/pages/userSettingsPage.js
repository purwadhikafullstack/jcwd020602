import { Flex, Icon, IconButton } from "@chakra-ui/react";
import { Box, Button, ButtonGroup, Divider } from "@chakra-ui/react";
import { Input, InputGroup, InputRightAddon } from "@chakra-ui/react";
import { useDisclosure, Table, Thead, Tbody } from "@chakra-ui/react";
import { Tr, Th, Td, TableContainer, Select, Avatar } from "@chakra-ui/react";
import { Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/react";
import { AiOutlinePlus } from "react-icons/ai";
import { FaSearch } from "react-icons/fa";
import { GrClose, GrMenu } from "react-icons/gr";
import { useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { useFetchUser } from "../hooks/useFetchUser";
import AssignAdmin, {
  ReassignAdmin,
} from "../components/dashboard/assignAdmin";
import AddAdmin from "../components/dashboard/addAdmin";
import EditAdmin from "../components/dashboard/editAdmin";
import DeleteAdmin from "../components/dashboard/deleteAdmin";
import NavbarDashboard from "../components/dashboard/navbarDashboard";

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
      <NavbarDashboard />
      <Box id="content" pt={"52px"}>
        <Box mx={2} my={3}>
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
                  ADMIN
                </Button>
              </ButtonGroup>
            ) : null}
            <AddAdmin isOpen={isOpen} onClose={onClose} fetch={fetch} />
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
                      <Avatar src={user.avatar_url} />
                      {userSelector.role == "SUPERADMIN" ? (
                        user.role == "ADMIN" ? (
                          <Menu>
                            {({ isOpen }) => (
                              <>
                                <MenuButton isActive={isOpen} as={Button} p={0}>
                                  <Icon as={isOpen ? GrClose : GrMenu} />
                                </MenuButton>
                                <MenuList>
                                  {!user.assign ? (
                                    <MenuItem
                                      onClick={() => {
                                        assignModal.onOpen();
                                        setAdminId(user.id);
                                      }}
                                    >
                                      Assign
                                    </MenuItem>
                                  ) : (
                                    <MenuItem
                                      onClick={() => {
                                        reassignModal.onOpen();
                                        setAdminId(user.id);
                                      }}
                                    >
                                      Reassign
                                    </MenuItem>
                                  )}
                                  <MenuItem
                                    onClick={() => {
                                      editModal.onOpen();
                                      setAdminId(user.id);
                                    }}
                                  >
                                    Edit
                                  </MenuItem>
                                  <MenuItem
                                    onClick={() => {
                                      deleteModal.onOpen();
                                      setAdminId(user.id);
                                    }}
                                  >
                                    Delete
                                  </MenuItem>
                                </MenuList>
                              </>
                            )}
                          </Menu>
                        ) : null
                      ) : null}
                    </Flex>
                    <Box>Name: {user.name}</Box>
                    <Divider />
                    <Box>Phone: {user.phone}</Box>
                    <Divider />
                    <Box>Email: {user.email}</Box>
                    <Divider />
                    <Box>Role: {user.role}</Box>
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
                        <Avatar
                          src={`${process.env.REACT_APP_API_BASE_URL}/${user.avatar_url}`}
                          size={"sm"}
                        />
                      </Td>
                      <Td>{user.name}</Td>
                      <Td>{user.phone}</Td>
                      <Td>{user.email}</Td>
                      <Td w={"5%"}>{user.role}</Td>
                      <Td w={"5%"}>
                        {userSelector.role == "SUPERADMIN" ? (
                          user.role == "ADMIN" ? (
                            <Menu>
                              {({ isOpen }) => (
                                <>
                                  <MenuButton
                                    isActive={isOpen}
                                    as={Button}
                                    p={0}
                                  >
                                    <Icon as={isOpen ? GrClose : GrMenu} />
                                  </MenuButton>
                                  <MenuList>
                                    {!user.assign ? (
                                      <MenuItem
                                        onClick={() => {
                                          assignModal.onOpen();
                                          setAdminId(user.id);
                                        }}
                                      >
                                        Assign
                                      </MenuItem>
                                    ) : (
                                      <MenuItem
                                        onClick={() => {
                                          reassignModal.onOpen();
                                          setAdminId(user.id);
                                        }}
                                      >
                                        Reassign
                                      </MenuItem>
                                    )}
                                    <MenuItem
                                      onClick={() => {
                                        editModal.onOpen();
                                        setAdminId(user.id);
                                      }}
                                    >
                                      Edit
                                    </MenuItem>
                                    <MenuItem
                                      onClick={() => {
                                        deleteModal.onOpen();
                                        setAdminId(user.id);
                                      }}
                                    >
                                      Delete
                                    </MenuItem>
                                  </MenuList>
                                </>
                              )}
                            </Menu>
                          ) : null
                        ) : null}
                      </Td>
                    </Tr>
                  ))}
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
                <EditAdmin
                  isOpen={editModal.isOpen}
                  onClose={editModal.onClose}
                  id={adminId}
                  fetch={fetch}
                  setAdminId={setAdminId}
                />
                <DeleteAdmin
                  isOpen={deleteModal.isOpen}
                  onClose={deleteModal.onClose}
                  id={adminId}
                  fetch={fetch}
                />
              </Tbody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </>
  );
}
