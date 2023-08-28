import { Box, Input } from "@chakra-ui/react";
import moment from "moment";
export default function FilterTime({ filter, setFilter, setShown }) {
  return (
    <>
      <Box pos={"relative"}>
        <Box
          pos={"absolute"}
          bg={"white"}
          zIndex={2}
          fontSize={10}
          transform={"translate(10px,-7px)"}
        >
          Time from:
        </Box>
        <Input
          size={"sm"}
          id="time"
          type="date"
          value={filter.timeFrom}
          onChange={(e) => {
            if (moment(e.target.value).isBefore(moment(filter.timeTo))) {
              setShown({ page: 1 });
              setFilter({ ...filter, timeFrom: e.target.value });
            }
          }}
        />
      </Box>
      <Box pos={"relative"}>
        <Box
          pos={"absolute"}
          bg={"white"}
          zIndex={2}
          fontSize={10}
          transform={"translate(10px,-7px)"}
        >
          Time to:
        </Box>
        <Input
          size={"sm"}
          id="time"
          type="date"
          value={filter.timeTo}
          onChange={(e) => {
            if (moment(e.target.value).isAfter(moment(filter.timeFrom))) {
              setShown({ page: 1 });
              setFilter({ ...filter, timeTo: e.target.value });
            }
          }}
        />
      </Box>
    </>
  );
}
