import { Flex, Icon } from "@chakra-ui/react";
import {
  MdOutlineArrowBackIos,
  MdOutlineArrowForwardIos,
} from "react-icons/md";
export default function Pagination({ shown, setShown, stocks, pages }) {
  const PageCard = ({ val }) => {
    return (
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
    );
  };
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
          pages.map((val) => <PageCard val={val} />)
        ) : (
          <>
            {shown.page < Math.ceil(pages.length / 3) && (
              <>
                {pages.slice(0, 4).map((val) => (
                  <PageCard val={val} />
                ))}
                <Flex>...</Flex>
              </>
            )}
            {shown.page >= Math.ceil(pages.length / 3) &&
              shown.page < Math.ceil((pages.length / 3) * 2) && (
                <>
                  <Flex>...</Flex>
                  {pages.slice(shown.page - 1, shown.page + 2).map((val) => (
                    <PageCard val={val} />
                  ))}
                  <Flex>...</Flex>
                </>
              )}
            {shown.page >= Math.ceil((pages.length / 3) * 2) && (
              <>
                <Flex>...</Flex>
                {pages.slice(-4).map((val) => (
                  <PageCard val={val} />
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
