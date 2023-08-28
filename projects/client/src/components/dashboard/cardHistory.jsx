import { Box, Divider, Flex } from "@chakra-ui/react";
import moment from "moment";
export default function CardHistory({ stockHistories }) {
  return (
    <>
      {/* tampilan mobile card */}
      <Box id="card-content" display={"none"}>
        <Flex flexDir={"column"} py={1}>
          {stockHistories &&
            stockHistories.rows.map((stockHistory, idx) => (
              <Flex
                p={1}
                m={1}
                flexDir={"column"}
                key={stockHistory?.id}
                border={"solid"}
                gap={1}
              >
                <Box>#{idx + 1}</Box>
                <Box>
                  Reference:{stockHistory?.reference}
                  {}
                </Box>
                <Divider />
                <Box>Stock Before: {stockHistory?.stock_before}</Box>
                <Divider />
                <Box>Stock After: {stockHistory?.stock_after}</Box>
                <Divider />
                <Box>Quantity: {`${stockHistory?.qty}`}</Box>
                <Divider />
                <Box>
                  Shoe:{" "}
                  {`${stockHistory?.stock?.Sho?.name} (${stockHistory?.stock?.Sho?.brand?.name})`}
                </Box>
                <Divider />
                <Box>
                  Datetime:{" "}
                  {moment(stockHistory?.createdAt).format("DD/MM/YYYY, HH:MM")}
                </Box>
                <Divider />
                <Box>Warehouse: {stockHistory.stock.warehouse.name}</Box>
                <Divider />
              </Flex>
            ))}
        </Flex>
      </Box>
    </>
  );
}
