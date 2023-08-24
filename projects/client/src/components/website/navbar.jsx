import { Box, Center, Divider, Flex, Icon, Image } from "@chakra-ui/react";
import { InputGroup, useDisclosure, Input } from "@chakra-ui/react";
import { InputRightAddon, InputRightElement } from "@chakra-ui/react";
import { AiOutlineShoppingCart, AiOutlineSearch } from "react-icons/ai";
import { BiMenuAltLeft } from "react-icons/bi";
import { useEffect, useRef, useState } from "react";
import SideMenu from "./sideMenu";
import logo from "../../assets/newlogo.png";
import { useFetchCategory } from "../../hooks/useFetchCategory";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useFetchBrand } from "../../hooks/useFetchBrand";
import {
  cartSelector,
  getCarts,
  getTotalProductsInCart,
} from "../../redux/cart";

export default function Navbar() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [search, setSearch] = useState(false);
  const [brand, setBrand] = useState(false);
  const [subCategory, setSubCategory] = useState({});
  const { brands } = useFetchBrand();
  const { categories } = useFetchCategory();
  const userSelector = useSelector((state) => state.auth);
  const carts = useSelector(cartSelector.selectAll);
  const totalItem = useSelector(getTotalProductsInCart);

  const [keyword, setKeyword] = useState();
  const dispatch = useDispatch();
  window.addEventListener("scroll", function () {
    var navbar = document.querySelector(".navbar");
    navbar.classList.toggle("sticky", window.scrollY > 550);
  });
  const handleCategoryMouseEnter = (categoryId) => {
    setSubCategory({ [categoryId]: true });
  };
  const handleCategoryMouseLeave = (categoryId) => {
    setSubCategory({ [categoryId]: false });
  };

  useEffect(() => {
    dispatch(getCarts());
  }, [dispatch]);

  return (
    <>
      <Center className="navbar">
        <Box w={"100vw"} maxW={"1550px"} m={3}>
          {/* atas */}
          <Box className="navbar-atas">
            <text>Help</text>
            <Box>
              {userSelector?.role ? (
                <Flex gap={1}>
                  <text
                    onClick={() => {
                      localStorage.removeItem("user");
                      dispatch({ type: "logout" });
                    }}
                  >
                    Log out
                  </text>
                  <Link to="/my-account">
                    <text>Hi, {userSelector?.name}</text>
                  </Link>
                </Flex>
              ) : (
                <Link to={"/auth"}>
                  <text>Login/Signup</text>
                </Link>
              )}
            </Box>
          </Box>
          <Divider mb={1} />
          {/* bawah */}
          <Flex justify={"space-between"} align={"center"} h={"36px"}>
            <Box className="burger" onClick={onOpen}>
              <Image as={BiMenuAltLeft} h={"auto"} w={"30px"} />
            </Box>
            <SideMenu isOpen={isOpen} onClose={onClose} />
            <Link to={"/"}>
              <Image src={logo} w={"115px"} />
            </Link>
            <Box h={"30px"} className="menu" transform={"translateY(7px)"}>
              {/* brands */}
              <Flex flexDir={"column"} pos={"relative"}>
                <Box
                  px={1}
                  onMouseEnter={() => setBrand(true)}
                  onMouseLeave={() => setBrand(false)}
                  border={brand ? "1px black solid" : ""}
                  color={brand ? "white" : ""}
                  bg={brand ? "black" : ""}
                >
                  brands
                </Box>
                <Box
                  className="categorymenu"
                  bg={"white"}
                  pos={"absolute"}
                  display={brand ? "flex" : "none"}
                  border={"1px"}
                  onMouseEnter={(e) => setBrand(true)}
                  onMouseLeave={(e) => setBrand(false)}
                >
                  <Box align={"center"}>
                    {brands &&
                      brands?.map((val) => (
                        <Link to={`/b/${val.name.replace(/ /g, "-")}`}>
                          <Box
                            p={2}
                            whiteSpace={"nowrap"}
                            w={"100%"}
                            key={val.id}
                            _hover={{ bg: "black", color: "white" }}
                          >
                            {val.name}
                          </Box>
                        </Link>
                      ))}
                  </Box>
                </Box>
              </Flex>
              {/* category */}
              {categories &&
                categories?.map((category) => (
                  <Flex flexDir={"column"} key={category.id} pos={"relative"}>
                    <Link to={`/c/${category.name}`}>
                      <Box
                        px={1}
                        onMouseEnter={() =>
                          handleCategoryMouseEnter(category.id)
                        }
                        onMouseLeave={() =>
                          handleCategoryMouseLeave(category.id)
                        }
                        bg={subCategory[category.id] ? "black" : ""}
                        color={subCategory[category.id] ? "white" : ""}
                        border={
                          subCategory[category.id] ? "1px black solid" : ""
                        }
                      >
                        {category.name}
                      </Box>
                    </Link>
                    <Box
                      className="categorymenu"
                      bg={"white"}
                      pos={"absolute"}
                      display={subCategory[category.id] ? "flex" : "none"}
                      border={"1px"}
                      onMouseEnter={() => handleCategoryMouseEnter(category.id)}
                      onMouseLeave={() => handleCategoryMouseLeave(category.id)}
                    >
                      <Box align={"center"}>
                        {category?.subcategories?.map((sub, idx) => (
                          <Link to={`/c/${category.name}/${sub.name}`}>
                            <Box
                              key={sub.id}
                              p={2}
                              whiteSpace={"nowrap"}
                              _hover={{ bg: "black", color: "white" }}
                            >
                              {sub.name}
                            </Box>
                          </Link>
                        ))}
                      </Box>
                    </Box>
                  </Flex>
                ))}
              <Link to={"/shoes"}>
                <Box px={1} _hover={{ bg: "black", color: "white" }}>
                  All Shoes
                </Box>
              </Link>
            </Box>
            <Flex gap={2} align={"center"}>
              <Box
                className="search"
                onClick={() => (search ? setSearch(false) : setSearch(true))}
              >
                <Image as={AiOutlineSearch} h={"auto"} w={"30px"} />
              </Box>
              <Box className="input">
                <InputGroup size={"sm"}>
                  <Input
                    w={"200px"}
                    bg={"gray.100"}
                    value={keyword}
                    onChange={(e) => {
                      setKeyword(e.target.value);
                    }}
                  />
                  <Link
                    to={
                      keyword ? `/search?=${keyword.replace(/ /g, "-")}` : null
                    }
                    onClick={() => setKeyword("")}
                  >
                    <InputRightElement cursor={"pointer"}>
                      <Icon as={AiOutlineSearch} />
                    </InputRightElement>
                  </Link>
                </InputGroup>
              </Box>

              {userSelector?.name ? (
                <Link to={"/cart"}>
                  <Box
                    className="cart"
                    display={"flex"}
                    alignItems={"center"}
                    gap={2}
                  >
                    <Box h={"auto"} pos={"relative"}>
                      <Image as={AiOutlineShoppingCart} w={"30px"} h={"auto"} />
                      {totalItem && totalItem > 0 ? (
                        <Flex
                          fontSize={"8px"}
                          color={"white"}
                          w={"15px"}
                          h={"15px"}
                          pos={"absolute"}
                          top={0}
                          right={0}
                          borderRadius={"full"}
                          bg={"red"}
                          align={"center"}
                          justify={"center"}
                        >
                          {totalItem}
                        </Flex>
                      ) : null}
                    </Box>
                  </Box>
                </Link>
              ) : null}
            </Flex>
          </Flex>

          {/* search */}
          <Box
            display={search ? "flex" : "none"}
            alignItems={"center"}
            flexDir={"column"}
          >
            <Divider my={2} />
            <InputGroup p={2}>
              <Input
                bg={"gray.100"}
                value={keyword}
                onChange={(e) => {
                  setKeyword(e.target.value);
                }}
              />
              <Link
                to={keyword ? `/search?=${keyword.replace(/ /g, "-")}` : null}
                onClick={() => {
                  setKeyword("");
                  setSearch(false);
                }}
              >
                <InputRightAddon bg={"white"} cursor={"pointer"}>
                  <Icon as={AiOutlineSearch} />
                </InputRightAddon>
              </Link>
            </InputGroup>
          </Box>
        </Box>
      </Center>
    </>
  );
}
