import {Center,HStack,Icon} from "@chakra-ui/react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
export default function Pagination({ currentPage, totalPages, onPageChange }) {
    const visiblePages = [];
  
    if (totalPages <= 3) {
      for (let i = 1; i <= totalPages; i++) {
        visiblePages.push(i);
      }
    } else {
      if (currentPage <= 2) {
        visiblePages.push(1, 2, 3);
      } else if (currentPage >= totalPages - 1) {
        visiblePages.push(totalPages - 2, totalPages - 1, totalPages);
      } else {
        visiblePages.push(currentPage - 1, currentPage, currentPage + 1);
      }
    }
  
    return (
      <HStack spacing={2}>
        <Center
          w={"30px"}
          h={"30px"}
          as="button"
          bg={currentPage === 1 ? "gray.200" : "white"}
          borderColor={currentPage === 1 ? "gray.400" : "gray.200"}
          borderWidth="1px"
          borderRadius="md"
          p={2}
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          <Icon as={FaChevronLeft} />
        </Center>
        {visiblePages.map((pageNumber) => (
          <Center
            w={"30px"}
            h={"30px"}
            key={pageNumber}
            as="button"
            bg={currentPage === pageNumber ? "black" : "white"}
            color={currentPage === pageNumber ? "white" : "gray.500"}
            borderColor={currentPage === pageNumber ? "black" : "gray.200"}
            borderWidth="1px"
            borderRadius="md"
            p={2}
            disabled={currentPage === pageNumber}
            onClick={() => onPageChange(pageNumber)}
            fontSize={"sm"}
          >
            {pageNumber}
          </Center>
        ))}
        <Center
          w={"30px"}
          h={"30px"}
          as="button"
          bg={currentPage === totalPages ? "gray.200" : "white"}
          borderColor={currentPage === totalPages ? "gray.400" : "gray.200"}
          borderWidth="1px"
          borderRadius="md"
          p={2}
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          <Icon as={FaChevronRight} />
        </Center>
      </HStack>
    );
  }