import { Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/react";
import { Box, Button, Divider, Flex, Icon } from "@chakra-ui/react";
import { GrClose, GrMenu } from "react-icons/gr";
import { useSelector } from "react-redux";
export default function CardStock({ stocks, setStockId, editS, deleteS }) {
  const userSelector = useSelector((state) => state.auth);
  return (
    <>
      {/* tampilan mobile card */}
      <Box id="card-content" display={"none"}>
        <Flex flexDir={"column"} py={1}>
          {stocks &&
            stocks?.rows?.map((stock, idx) => (
              <Flex
                p={1}
                m={1}
                flexDir={"column"}
                key={stock.id}
                border={"solid"}
                gap={1}
              >
                <Flex justify={"space-between"}>
                  <Box>#{idx + 1}</Box>{" "}
                  {userSelector.role == "SUPERADMIN" ||
                  userSelector.role == "ADMIN" ? (
                    <Flex gap={1}>
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
                </Flex>
                <Box>Stock: {stock?.stock}</Box>
                <Divider />
                <Box>Booked Stock: {stock?.booked_stock}</Box>
                <Divider />
                <Box>Size: {stock?.shoeSize?.size}</Box>
                <Divider />
                <Box>
                  Shoe: {`${stock?.Sho?.name} (${stock?.Sho?.brand?.name})`}
                </Box>
                <Divider />
                <Box>Warehouse: {stock?.warehouse?.name}</Box>
                <Divider />
              </Flex>
            ))}
        </Flex>
      </Box>
    </>
  );
}
