import { Box, Flex, Icon } from "@chakra-ui/react";
import {
  MdOutlineArrowBackIos,
  MdOutlineArrowForwardIos,
} from "react-icons/md";
export default function Pagination({ shown, setShown, datas, pages }) {
  const PageCard = ({ val }) => {
    return (
      <Box
        p={2}
        bgColor={Math.ceil(shown.page) == val ? "black" : "white"}
        color={Math.ceil(shown.page) == val ? "white" : "black"}
        borderRadius={5}
        mx={2}
      >
        <Flex
          cursor={"pointer"}
          w={"16px"}
          h={"16px"}
          justifyContent={"center"}
          alignItems={"center"}
          onClick={() => setShown({ ...shown, page: val })}
          key={val}
        >
          {val}
        </Flex>
      </Box>
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
      <Flex>
        {pages.length <= 3 ? (
          pages.map((val) => <PageCard val={val} />)
        ) : (
          <>
            {shown.page < Math.ceil(pages.length / 3) && (
              <>
                {pages.slice(0, 3).map((val) => (
                  <PageCard val={val} />
                ))}
              </>
            )}
            {shown.page >= Math.ceil(pages.length / 3) &&
              shown.page <= pages.length - 2 && (
                <>
                  {pages.slice(shown.page - 2, shown.page + 1).map((val) => (
                    <PageCard val={val} />
                  ))}
                </>
              )}
            {shown.page > pages.length - 2 && (
              <>
                {pages.slice(-3).map((val) => (
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
        display={shown.page < datas ? "flex" : "none"}
      >
        <Icon as={MdOutlineArrowForwardIos} />
      </Flex>
    </>
  );
}
