import { Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/react";
import { Tr, Th, Td, TableContainer } from "@chakra-ui/react";
import { Tbody, useDisclosure, Table } from "@chakra-ui/react";
import { Box, Button, ButtonGroup, Divider } from "@chakra-ui/react";
import { Flex, Icon, IconButton, Thead, Select } from "@chakra-ui/react";
import { AiOutlinePlus } from "react-icons/ai";
import { GrClose, GrMenu } from "react-icons/gr";
import moment from "moment";
export default function TableMutation({
  filter,
  stockMutations,
  deleteSM,
  editSM,
  confirmSM,
  setStatus,
  setStockMutId,
}) {
  return (
    <>
      {/* tampilan desktop table */}
      <TableContainer id="table-content">
        <Table size="sm">
          <Thead>
            <Tr>
              <Th>#</Th>
              <Th>Mutation Code</Th>
              <Th>Requester</Th>
              <Th>Responder</Th>
              <Th>From-To</Th>
              <Th>Shoe</Th>
              <Th>Stock</Th>
              <Th>Status</Th>
              <Th>Date Time</Th>
              <Th>Action</Th>
            </Tr>
          </Thead>
          <Tbody>
            {stockMutations?.rows &&
              stockMutations?.rows.map((stockMutation, idx) => (
                <Tr>
                  <Td w={"5%"}>{idx + 1}</Td>
                  <Td>{stockMutation?.mutation_code}</Td>
                  <Td w={"10%"}>{`${
                    stockMutation?.requestedBy?.name || "AUTO"
                  }`}</Td>
                  <Td w={"10%"}>{`${
                    stockMutation?.requestedBy?.name
                      ? stockMutation?.respondedBy?.name || "PENDING"
                      : "AUTO"
                  }`}</Td>
                  <Td w={"10%"}>
                    {filter.warehouse_id == stockMutation?.fromWarehouse?.id
                      ? `${stockMutation?.fromWarehouse?.name} >>> ${stockMutation?.toWarehouse?.name}`
                      : `${stockMutation?.toWarehouse?.name} <<< ${stockMutation?.fromWarehouse?.name}`}
                  </Td>
                  <Td>{`${stockMutation?.stock?.Sho?.name}-${stockMutation?.stock?.shoeSize?.size}-${stockMutation?.stock?.Sho?.brand?.name}`}</Td>
                  <Td>
                    {filter.warehouse_id == stockMutation?.fromWarehouse?.id
                      ? "-"
                      : "+"}{" "}
                    {stockMutation?.qty}
                  </Td>
                  <Td>{stockMutation?.status}</Td>
                  <Td>
                    {moment(stockMutation?.createdAt).format(
                      "DD/MM/YYYY, HH:MM"
                    )}
                  </Td>
                  <Td w={"5%"}>
                    {stockMutation?.status == "PENDING" ? (
                      <Flex justify={"space-between"} gap={1}>
                        <Menu>
                          {({ isOpen }) => (
                            <>
                              <MenuButton isActive={isOpen} as={Button} p={0}>
                                <Icon as={isOpen ? GrClose : GrMenu} />
                              </MenuButton>
                              {filter.warehouse_id ==
                              stockMutation?.fromWarehouse?.id ? (
                                <MenuList>
                                  <MenuItem
                                    onClick={() => {
                                      setStatus("REJECTED");
                                      setStockMutId(stockMutation?.id);
                                      confirmSM.onOpen();
                                    }}
                                  >
                                    Reject
                                  </MenuItem>
                                  <MenuItem
                                    onClick={() => {
                                      setStatus("APPROVED");
                                      setStockMutId(stockMutation?.id);
                                      confirmSM.onOpen();
                                    }}
                                  >
                                    Approve
                                  </MenuItem>
                                </MenuList>
                              ) : (
                                <MenuList>
                                  <MenuItem
                                    onClick={() => {
                                      setStockMutId(stockMutation?.id);
                                      editSM.onOpen();
                                    }}
                                  >
                                    Edit
                                  </MenuItem>
                                  <MenuItem
                                    onClick={() => {
                                      setStockMutId(stockMutation?.id);
                                      deleteSM.onOpen();
                                    }}
                                  >
                                    Delete
                                  </MenuItem>
                                </MenuList>
                              )}
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
    </>
  );
}
