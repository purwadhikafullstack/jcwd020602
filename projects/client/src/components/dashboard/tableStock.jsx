import { Menu, MenuButton, MenuList, MenuItem, Center } from "@chakra-ui/react";
import { Tr, Th, Td, TableContainer } from "@chakra-ui/react";
import { Flex, Icon, Thead, Button } from "@chakra-ui/react";
import { Tbody, Table } from "@chakra-ui/react";
import { GrClose, GrMenu } from "react-icons/gr";
import { useSelector } from "react-redux";
export default function TableStock({ stocks, deleteS, editS, setStockId }) {
  const userSelector = useSelector((state) => state.auth);
  return (
    <>
      {/* tampilan desktop table */}
      {!stocks?.rows?.length ? (
        <Center border={"1px"} h={"550px"} w={"100%"}>
          Product not found
        </Center>
      ) : (
        <TableContainer id="table-content">
          <Table size="sm">
            <Thead>
              <Tr>
                <Th>#</Th>
                <Th>Stock</Th>
                <Th>Booked Stock</Th>
                <Th>Size</Th>
                <Th>Shoe</Th>
                <Th>Warehouse</Th>
                <Th>Action</Th>
              </Tr>
            </Thead>
            <Tbody>
              {stocks?.rows?.map((stock, idx) => (
                <Tr>
                  <Td w={"5%"}>{idx + 1}</Td>
                  <Td>{stock?.stock}</Td>
                  <Td>{stock?.booked_stock}</Td>
                  <Td>{stock?.shoeSize?.size}</Td>
                  <Td>{`${stock?.Sho?.name} (${stock?.Sho?.brand?.name})`}</Td>
                  <Td w={"10%"}>{stock?.warehouse?.name}</Td>
                  <Td w={"5%"}>
                    {userSelector.role == "SUPERADMIN" ||
                    userSelector.role == "ADMIN" ? (
                      <Flex justify={"space-between"} gap={1}>
                        <Menu>
                          {({ isOpen }) => (
                            <>
                              <MenuButton isActive={isOpen} as={Button} p={0}>
                                <Icon as={isOpen ? GrClose : GrMenu} />
                              </MenuButton>
                              <MenuList>
                                <MenuItem
                                  onClick={() => {
                                    setStockId(stock.id);
                                    editS.onOpen();
                                  }}
                                >
                                  Edit
                                </MenuItem>
                                <MenuItem
                                  onClick={() => {
                                    setStockId(stock.id);
                                    deleteS.onOpen();
                                  }}
                                >
                                  Delete
                                </MenuItem>
                              </MenuList>
                            </>
                          )}
                        </Menu>
                      </Flex>
                    ) : null}
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      )}
    </>
  );
}
