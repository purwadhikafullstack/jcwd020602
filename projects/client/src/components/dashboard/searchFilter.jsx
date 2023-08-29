import {
  Button,
  Flex,
  Icon,
  Input,
  InputGroup,
  InputRightAddon,
} from "@chakra-ui/react";
import { FaSearch } from "react-icons/fa";
import { useRef, useState } from "react";
export default function SearchFilter({
  filter,
  setFilter,
  setShown,
  onClick,
  placeholder,
}) {
  const [search, setSearch] = useState("");
  const inputSearchRef = useRef(null);
  return (
    <Flex flexWrap={"wrap"} gap={2} my={2} justify={"space-between"}>
      <InputGroup size={"sm"} w={"500px"}>
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={placeholder}
          ref={inputSearchRef}
        />
        <InputRightAddon
          cursor={"pointer"}
          onClick={() => {
            setShown({ page: 1 });
            setFilter({
              ...filter,
              search: inputSearchRef.current.value,
            });
          }}
        >
          <Icon as={FaSearch} color={"black"} />
        </InputRightAddon>
      </InputGroup>
      <Button
        fontWeight={"bold"}
        color={"#383F6A"}
        cursor={"pointer"}
        onClick={() => {
          onClick();
          setSearch("");
        }}
      >
        Reset Filter
      </Button>
    </Flex>
  );
}
