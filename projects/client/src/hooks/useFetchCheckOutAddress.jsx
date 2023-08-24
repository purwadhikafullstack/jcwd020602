import { useEffect, useState } from "react";
import { api } from "../api/api";

export const useFetchAddress = (currentPage, perPage) => {
  const [address, setAddress] = useState();
  const [totalPages, setTotalPage] = useState();

  const fetch = async () => {
    const token = JSON.parse(localStorage.getItem("user"));
    const page = currentPage; // Get the current page
    const pageSize = perPage; // Get the addresses per page
    try {
      const res = await api().get(`/checkOuts`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          page,
          pageSize,
        },
      });
      setAddress(res.data?.data);
      setTotalPage(res.data?.totalPages);
    } catch (err) {
      console.log(err.response?.data);
    }
  };
  useEffect(() => {
    fetch();
  }, [currentPage]);

  return { address, totalPages, fetch };
};
