import { Table, Thead, Tbody, Tr, Th, Td, Center } from "@chakra-ui/react";
import { TableContainer } from "@chakra-ui/react";
import moment from "moment";
export default function TableHistory({ stockHistories }) {
  return (
    <>
      {/* tampilan mobile card */}
      {!stockHistories?.rows?.length ? (
        <Center border={"1px"} h={"550px"} w={"100%"}>
          Product not found
        </Center>
      ) : (
        <TableContainer id="table-content">
          <Table size="sm">
            <Thead>
              <Tr>
                <Th textAlign={"center"}>#</Th>
                <Th textAlign={"center"}>Reference</Th>
                <Th textAlign={"center"}>Stock Before</Th>
                <Th textAlign={"center"}>Stock After</Th>
                <Th textAlign={"center"}>Quantity</Th>
                <Th textAlign={"center"}>Shoe</Th>
                <Th textAlign={"center"}>Size</Th>
                <Th textAlign={"center"}>Datetime</Th>
                <Th textAlign={"center"}>Warehouse</Th>
              </Tr>
            </Thead>
            <Tbody>
              {stockHistories?.rows?.map((stockHistory, idx) => (
                <Tr>
                  <Td textAlign={"center"} w={"5%"}>
                    {idx + 1}
                  </Td>
                  <Td textAlign={"center"}>{stockHistory?.reference}</Td>
                  <Td textAlign={"center"}>{stockHistory?.stock_before}</Td>
                  <Td textAlign={"center"}>{stockHistory?.stock_after}</Td>
                  <Td textAlign={"center"}>{`${stockHistory?.qty}`}</Td>
                  <Td
                    textAlign={"center"}
                  >{`${stockHistory?.stock?.Sho?.name} (${stockHistory?.stock?.Sho.brand?.name})`}</Td>
                  <Td textAlign={"center"}>
                    {stockHistory?.stock?.shoeSize?.size}
                  </Td>
                  <Td textAlign={"center"}>
                    {moment(stockHistory?.createdAt).format(
                      "DD/MM/YYYY, HH:MM"
                    )}
                  </Td>
                  <Td textAlign={"center"}>
                    {stockHistory.stock.warehouse.name}
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
