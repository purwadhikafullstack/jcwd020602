import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Input,
  Textarea,
  Select,
  Box,
  useToast,
  Image,
  Flex,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { api } from "../../api/api";
import { useFetchBrand } from "../../hooks/useFetchBrand";
import {
  useFetchCategory,
  useFetchSubcategory,
} from "../../hooks/useFetchCategory";
export default function AddShoe(props) {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const { brands } = useFetchBrand();
  const { categories } = useFetchCategory();
  const { sub: subcategories } = useFetchSubcategory();
  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [sub, setSub] = useState();
  const [shoe, setShoe] = useState({
    name: "",
    description: "",
    price: "",
    weight: "",
    brand_id: 0,
    category_id: 0,
    subcategory_id: 0,
    shoe_img: [],
  });
  console.log(shoe);
  function inputHandler(e) {
    const { id, value } = e.target;
    const temp = { ...shoe };
    temp[id] = value;
    setShoe(temp);
  }

  const uploadShoe = () => {
    const formData = new FormData();
    formData.append("name", shoe.name);
    formData.append("description", shoe.description);
    formData.append("price", shoe.price);
    formData.append("weight", shoe.weight);
    formData.append("brand_id", shoe.brand_id);
    formData.append("category_id", shoe.category_id);
    formData.append("subcategory_id", shoe.subcategory_id);
    for (const files of selectedFiles) {
      formData.append("shoe", files);
    }
    api
      .post("/shoes", formData)
      .then((res) => {
        toast({
          title: res.data.message,
          status: "success",
          position: "top",
        });
        props.fetch();
        props.onClose();
      })
      .catch((err) => console.log(err));
  };

  const handleImageChange = (e) => {
    const files = e.target.files;
    setSelectedFiles(files);
    const images = [];
    const maxImages = 4; // Set the maximum number of images to 5

    for (let i = 0; i < Math.min(files.length, maxImages); i++) {
      const file = files[i];
      const imageUrl = URL.createObjectURL(file);
      images.push(imageUrl);
    }
    setSelectedImages(images);

    const shoeImages = [];
    for (const file of files) {
      shoeImages.push(file);
    }
    setShoe((prevShoe) => ({ ...prevShoe, shoe_img: shoeImages }));
  };
  return (
    <>
      <Modal
        scrollBehavior="inside"
        isOpen={props.isOpen}
        onClose={props.onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader p={2}>Add Shoe</ModalHeader>
          <ModalCloseButton />
          <ModalBody display={"flex"} flexDir={"column"} gap={2}>
            <Box>
              name: <Input id="name" type="text" onChange={inputHandler} />
            </Box>
            <Box>
              description:
              <Textarea id="description" onChange={inputHandler} />
            </Box>
            <Box>
              price:
              <Input id="price" type={"number"} onChange={inputHandler} />
            </Box>
            <Box>
              weight:
              <Input id="weight" type={"number"} onChange={inputHandler} />
            </Box>
            <Box>
              Brand:
              <Select
                id="brand_id"
                placeholder="choose Brand.."
                onChange={(e) => {
                  inputHandler(e);
                }}
              >
                {brands &&
                  brands.map((val, idx) => (
                    <option key={val.id} value={val.id}>
                      {val.name}
                    </option>
                  ))}
              </Select>
            </Box>
            <Box>
              Category:
              <Select
                id="category_id"
                placeholder="choose category.."
                onChange={(e) => {
                  inputHandler(e);
                  setSub(e.target.value);
                }}
              >
                {categories &&
                  categories.map((val, idx) => (
                    <option key={val.id} value={val.id}>
                      {val.name}
                    </option>
                  ))}
              </Select>
            </Box>
            <Box>
              Subcategory:
              <Select
                id="subcategory_id"
                placeholder="choose Brand.."
                onChange={(e) => {
                  inputHandler(e);
                }}
              >
                {subcategories &&
                  subcategories
                    .filter((val) => val.category_id == sub)
                    .map((val) => (
                      <option key={val.id} value={val.id}>
                        {val.name}
                      </option>
                    ))}
              </Select>
            </Box>
            <Box>
              Image:
              <Input
                accept="image/png, image/jpeg"
                type="file"
                id="productImg"
                paddingTop={"4px"}
                multiple
                onChange={handleImageChange}
              />
            </Box>
            {/* Preview the selected images */}
            {selectedImages.length ? (
              <Flex flexDir={"column"} borderColor={"#E6EBF2"} gap={1}>
                {selectedImages.map((imageUrl, index) => (
                  <Image
                    key={index}
                    src={imageUrl}
                    alt={`Product Image ${index + 1}`}
                  />
                ))}
              </Flex>
            ) : null}
          </ModalBody>

          <ModalFooter>
            <Button
              isLoading={isLoading}
              onClick={() => {
                setIsLoading(true);
                setTimeout(() => {
                  setIsLoading(false);
                  uploadShoe();
                }, 2000);
              }}
            >
              confirm
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
