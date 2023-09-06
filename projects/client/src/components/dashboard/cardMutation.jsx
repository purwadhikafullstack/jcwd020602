import { Menu, MenuButton, MenuList, MenuItem, Center } from "@chakra-ui/react";
import { Box, Button, Divider, Flex, Icon } from "@chakra-ui/react";
import { GrClose, GrMenu } from "react-icons/gr";
import moment from "moment";
export default function CardMutation({
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
      {/* tampilan mobile card */}
      <Box id="card-content" display={"none"}>
        <Flex flexDir={"column"} py={1}>
          {!stockMutations?.rows?.length ? (
            <Center border={"1px"} h={"550px"}>
              Product not found
            </Center>
          ) : (
            <>
              {stockMutations?.rows?.map((stockMutation, idx) => (
                <Flex
                  p={1}
                  m={1}
                  flexDir={"column"}
                  key={stockMutation?.id}
                  border={"solid"}
                  gap={1}
                >
                  <Flex justify={"space-between"}>
                    <Box>#{idx + 1}</Box>{" "}
                    {stockMutation.status == "PENDING" ? (
                      <Flex gap={1}>
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
                  </Flex>
                  <Box>{`Mutation Code: ${stockMutation?.mutation_code}`}</Box>
                  <Divider />
                  <Box>
                    REQUESTER: {`${stockMutation?.requestedBy?.name || "AUTO"}`}
                  </Box>
                  <Divider />
                  <Box>
                    RESPONDER:{" "}
                    {`${
                      stockMutation?.requestedBy?.name
                        ? stockMutation?.respondedBy?.name || "PENDING"
                        : "AUTO"
                    }`}
                  </Box>
                  <Divider />
                  <Box>
                    FROM - TO Warehouses:{" "}
                    {filter.warehouse_id == stockMutation?.fromWarehouse?.id
                      ? `${stockMutation?.fromWarehouse?.name} >>> ${stockMutation?.toWarehouse?.name}`
                      : `${stockMutation?.toWarehouse?.name} >>> ${stockMutation?.fromWarehouse?.name}`}
                  </Box>
                  <Divider />
                  <Box>
                    Shoe:{" "}
                    {`${stockMutation?.stock?.Sho?.name}-${stockMutation?.stock?.shoeSize?.size}-${stockMutation?.stock?.Sho?.brand?.name}`}
                  </Box>
                  <Divider />
                  <Divider />
                  <Box>
                    Stock:{" "}
                    {filter.warehouse_id == stockMutation?.fromWarehouse?.id
                      ? "-"
                      : "+"}{" "}
                    {stockMutation?.qty}
                  </Box>
                  <Divider />
                  <Divider />
                  <Box>Status: {stockMutation?.status}</Box>
                  <Divider />
                  <Divider />
                  <Box>
                    Date Time:{" "}
                    {moment(stockMutation?.createdAt).format(
                      "DD/MM/YYYY, HH:MM"
                    )}
                  </Box>
                  <Divider />
                </Flex>
              ))}
            </>
          )}
        </Flex>
      </Box>
    </>
  );
}
