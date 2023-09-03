import { Icon, Image, Select, Text } from "@chakra-ui/react";
import { Box, Center, Divider, Flex } from "@chakra-ui/react";
import { useFetchShoe } from "../hooks/useFetchShoe";
import { useFetchCategory } from "../hooks/useFetchCategory";
import { useFetchBrand } from "../hooks/useFetchBrand";
import { useFetchShoeSize } from "../hooks/useFetchShoeSize";
import React, { lazy, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Footer from "../components/website/footer";
import { RiEmotionUnhappyLine } from "react-icons/ri";
import Pagination from "../components/dashboard/pagination";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
const Navbar = lazy(() => import("../components/website/navbar"));

export default function ProductList() {
  const loc = useLocation();
  const b = loc.pathname.split("/")[1];
  const search = loc?.search?.split("=")[1]?.replace(/-/g, " ");
  const category = loc?.pathname?.split("/")[2]?.replace(/-/g, " ");
  const sub = loc.pathname.split("/")[3];
  const [filter, setFilter] = useState({
    page: 1,
    sort: "",
    order: "",
    brand: "",
    gender: "",
    size: "",
  });
  const { shoes, fetch } = useFetchShoe(category, sub, { ...filter, search });
  const { categories } = useFetchCategory();
  const { brands } = useFetchBrand();
  const { sizes } = useFetchShoeSize();

  // -------------------------- pagination
  const [pages, setPages] = useState([]);
  const [shown, setShown] = useState({ page: 1 });

  function pageHandler() {
    const output = [];
    for (let i = 1; i <= shoes?.totalPages; i++) {
      output.push(i);
    }
    setPages(output);
  }
  useEffect(() => {
    pageHandler();
  }, [shoes]);
  useEffect(() => {
    if (shown.page > 0 && shown.page <= shoes?.totalPages) {
      setFilter({ ...filter, page: shown.page });
    }
  }, [shown]);
  //  -------------------------

  useEffect(() => {
    fetch();
  }, [category, sub, filter, search]);

  useEffect(() => {
    setFilter({ ...filter, brand: "", gender: "", size: "" });
    setShown({ page: 1 });
  }, [category, sub, search]);

  return (
    <Center flexDir={"column"}>
      <Navbar />
      <Flex
        flexDir={"column"}
        w={"100%"}
        maxW={"1533px"}
        p={"0rem 1rem"}
        mt={"100px"}
      >
        <Box display={"flex"} className="select-custom" border={"1px"}>
          {b == "b" ? (
            <Select
              id="select"
              placeholder="FILTER BY GENDER:"
              value={filter?.gender}
              onChange={(e) => {
                setFilter({ ...filter, gender: e.target.value });
                setShown({ page: 1 });
              }}
            >
              {categories?.map((val) => (
                <option value={val.name}>{val.name}</option>
              ))}
            </Select>
          ) : (
            <Select
              id="select"
              value={filter?.brand}
              placeholder="FILTER BY BRAND:"
              onChange={(e) => {
                setShown({ page: 1 });
                setFilter({ ...filter, brand: e.target.value });
              }}
            >
              {brands?.map((val) => (
                <option value={val.name}>{val.name}</option>
              ))}
            </Select>
          )}
          <Select
            id="select"
            value={filter.size}
            placeholder="FILTER BY SIZE:"
            onChange={(e) => {
              setShown({ page: 1 });
              setFilter({ ...filter, size: e.target.value });
            }}
          >
            {sizes.map((val) => (
              <option value={val.size}>{val.size}</option>
            ))}
          </Select>
          <Select
            id="select"
            placeholder="SORT BY:"
            onChange={(e) => {
              setFilter({
                ...filter,
                sort: e.target.value.split(",")[0],
                order: e.target.value.split(",")[1],
              });
            }}
          >
            <option value={"name,ASC"}>Name: A to Z</option>
            <option value={"name,DESC"}>Name: Z to A</option>
            <option value={"price,ASC"}>Price: LOW to HIGH</option>
            <option value={"price,DESC"}>Price: HIGH to LOW</option>
          </Select>
        </Box>
        {shoes?.rows?.length > 0 ? (
          <>
            <Box
              border={"2px"}
              display={"grid"}
              className="product"
              gridGap={5}
              my={5}
              p={2}
            >
              {shoes &&
                shoes?.rows?.map((shoe) => (
                  <Link to={`/${shoe.name.replace(/ /g, "-")}`}>
                    <Box
                      className="shoe-list"
                      key={shoe.id}
                      cursor={"pointer"}
                      _hover={{ bg: "black", color: "white" }}
                      pos={"relative"}
                      onMouseEnter={(e) => {
                        const images = e.currentTarget.querySelectorAll("img");
                        images[1].style.opacity = 1;
                      }}
                      onMouseLeave={(e) => {
                        const images = e.currentTarget.querySelectorAll("img");
                        images[1].style.opacity = 0;
                      }}
                    >
                      <LazyLoadImage
                        effect="blur"
                        src={`${process.env.REACT_APP_API_BASE_URL}/${shoe.ShoeImages[0]?.shoe_img}`}
                        key={shoe.id}
                      />
                      <Image
                        src={`${process.env.REACT_APP_API_BASE_URL}/${shoe.ShoeImages[1]?.shoe_img}`}
                        pos={"absolute"}
                        top={0}
                        opacity={0}
                        transition="opacity 0.5s"
                      />

                      <Flex flexDir={"column"} p={2}>
                        <Text fontWeight={"bold"}>{shoe.name}</Text>
                        <Divider />
                        <Text>{shoe.brand.name}</Text>
                        <Divider />
                        <Text fontSize={13} color={"gray"}>
                          {shoe.Category.name} {shoe.subcategory.name}
                        </Text>
                        <Divider />
                        <Text>
                          {shoe.price.toLocaleString("id-ID", {
                            style: "currency",
                            currency: "IDR",
                          })}
                        </Text>
                      </Flex>
                    </Box>
                  </Link>
                ))}
            </Box>
            <Flex p={2} mb={5} justify={"center"} border={"2px"}>
              <Pagination
                shown={shown}
                setShown={setShown}
                datas={shoes?.totalPages}
                pages={pages}
              />
            </Flex>
          </>
        ) : (
          <Center border={"2px"} my={5} p={2} h={"460px"}>
            <Box fontSize={30} textAlign={"center"}>
              sorry, product not found / product not updated
              <Icon as={RiEmotionUnhappyLine} />
            </Box>
          </Center>
        )}
      </Flex>
      <Footer />
    </Center>
  );
}
