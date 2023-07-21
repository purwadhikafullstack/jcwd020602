import { Flex, Icon } from "@chakra-ui/react";
import {
  MdOutlineArrowBackIos,
  MdOutlineArrowForwardIos,
} from "react-icons/md";
export default function Pagination({ shown, setShown, stocks, pages }) {
  return (
    <>
      <Flex
        cursor={"pointer"}
        alignItems={"center"}
        onClick={() => {
          if (shown.page > 1) {
            setShown({ ...shown, page: shown.page - 1 });
          }
        }}
        display={shown.page > 1 ? "flex" : "none"}
      >
        <Icon as={MdOutlineArrowBackIos} />
      </Flex>
      <Flex flexDir={"row"} gap={"8px"}>
        {pages.length <= 4 ? (
          pages.map((val) => (
            <Flex
              cursor={"pointer"}
              bgColor={Math.ceil(shown.page) == val ? "black" : "white"}
              color={Math.ceil(shown.page) == val ? "white" : "black"}
              borderRadius={"3px"}
              w={"16px"}
              h={"16px"}
              justifyContent={"center"}
              alignItems={"center"}
              onClick={() => setShown({ ...shown, page: val })}
              key={val}
            >
              {val}
            </Flex>
          ))
        ) : (
          <>
            {Math.ceil(shown.page) < 4 && (
              <>
                {pages.slice(0, 4).map((val) => (
                  <Flex
                    cursor={"pointer"}
                    bgColor={shown.page == val ? "black" : "white"}
                    color={shown.page == val ? "white" : "black"}
                    borderRadius={"3px"}
                    w={"16px"}
                    h={"16px"}
                    justifyContent={"center"}
                    alignItems={"center"}
                    onClick={() => setShown({ ...shown, page: val })}
                    key={val}
                  >
                    {val}
                  </Flex>
                ))}
                <Flex>...</Flex>
              </>
            )}
            {shown.page >= 4 && shown.page < pages.length && (
              <>
                <Flex>...</Flex>
                {pages.slice(shown.page - 1, shown.page + 3).map((val) => (
                  <Flex
                    cursor={"pointer"}
                    bgColor={shown.page == val ? "black" : "white"}
                    color={shown.page == val ? "white" : "black"}
                    borderRadius={"3px"}
                    w={"16px"}
                    h={"16px"}
                    justifyContent={"center"}
                    alignItems={"center"}
                    onClick={() =>
                      setShown({
                        ...shown,
                        page: val,
                      })
                    }
                    key={val}
                  >
                    {val}
                  </Flex>
                ))}
                <Flex>...</Flex>
              </>
            )}
            {shown.page >= pages.length - 4 && (
              <>
                <Flex>...</Flex>
                {pages.slice(-4).map((val) => (
                  <Flex
                    cursor={"pointer"}
                    bgColor={shown.page == val ? "black" : "white"}
                    color={shown.page == val ? "white" : "black"}
                    borderRadius={"3px"}
                    w={"16px"}
                    h={"16px"}
                    justifyContent={"center"}
                    alignItems={"center"}
                    onClick={() => setShown({ ...shown, page: val })}
                    key={val}
                  >
                    {val}
                  </Flex>
                ))}
              </>
            )}
          </>
        )}
      </Flex>
      <Flex
        cursor={"pointer"}
        alignItems={"center"}
        onClick={() => {
          setShown({ ...shown, page: shown.page + 1 });
        }}
        display={shown.page < stocks.totalPages ? "flex" : "none"}
      >
        <Icon as={MdOutlineArrowForwardIos} />
      </Flex>
    </>
  );
}
