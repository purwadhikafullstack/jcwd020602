import { Center, Flex, Icon, IconButton } from "@chakra-ui/react";
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
import Pagination from "../components/dashboard/pagination";

export default function UserSettingsPage() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const deleteModal = useDisclosure();
  const editModal = useDisclosure();
  const assignModal = useDisclosure();
  const reassignModal = useDisclosure();
  const userSelector = useSelector((state) => state.auth);
  const inputFileRef = useRef(null);
  const [adminId, setAdminId] = useState();
  const [filter, setFilter] = useState({
    page: 1,
    sort: "",
    order: "",
    search: "",
    role: "",
  });
  const { userFilter, fetch } = useFetchUser(filter);
  // -------------------------- pagination
  const [pages, setPages] = useState([]);
  const [shown, setShown] = useState({ page: 1 });

  function pageHandler() {
    const output = [];
    for (let i = 1; i <= userFilter?.totalPages; i++) {
      output.push(i);
    }
    setPages(output);
  }
  useEffect(() => {
    pageHandler();
  }, [userFilter]);
  useEffect(() => {
    if (shown.page > 0 && shown.page <= userFilter?.totalPages) {
      setFilter({ ...filter, page: shown.page });
    }
  }, [shown]);
  //  -------------------------

  useEffect(() => {
    fetch();
  }, [filter]);

  function MenuBurger({ user }) {
    return (
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
    );
  }
  return (
    <>
      <NavbarDashboard />
      <Box id="content" pt={"52px"}>
        <Box mx={2} my={3}>
          <Flex justify={"space-between"} flexWrap={"wrap"}>
            <Box fontSize={"30px"} fontWeight={"bold"}>
              User
            </Box>
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

          <Flex gap={2} my={2}>
            <InputGroup size={"sm"} w={"500px"}>
              <Input placeholder="Search..." ref={inputFileRef} />
              <InputRightAddon
                cursor={"pointer"}
                onClick={() => {
                  setShown({ page: 1 });
                  setFilter({ role: "", search: inputFileRef.current.value });
                }}
              >
                <Icon as={FaSearch} color={"black"} />
              </InputRightAddon>
            </InputGroup>
            <Box className="select-filter">
              <Box id="title">ROLE</Box>
              <Select
                size={"sm"}
                placeholder="select"
                value={filter?.role}
                onChange={(e) => {
                  setShown({ page: 1 });
                  setFilter({
                    search: "",
                    role: e.target.value,
                  });
                }}
              >
                <option value={"ADMIN"}>Admin</option>
                <option value={"USER"}>User</option>
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
              {userFilter &&
                userFilter?.rows.map((user, idx) => (
                  <Flex
                    p={1}
                    m={1}
                    flexDir={"column"}
                    key={user.id}
                    border={"solid"}
                    gap={1}
                  >
                    <Flex justifyContent={"space-between"} align={"center"}>
                      <Avatar
                        src={`${process.env.REACT_APP_API_BASE_URL}/${user.avatar_url}`}
                      />
                      {userSelector.role == "SUPERADMIN" ? (
                        user.role == "ADMIN" ? (
                          <MenuBurger user={user} />
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
          {userFilter?.rows?.length ? (
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
                  {userFilter &&
                    userFilter?.rows.map((user, idx) => (
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
                              <MenuBurger user={user} />
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
          ) : (
            <Center border={"1px"} h={"550px"}>
              user not found
            </Center>
          )}
        </Box>
        <Flex p={2} m={2} justify={"center"}>
          <Pagination
            shown={shown}
            setShown={setShown}
            datas={userFilter?.totalPages}
            pages={pages}
          />
        </Flex>
      </Box>
    </>
  );
}
