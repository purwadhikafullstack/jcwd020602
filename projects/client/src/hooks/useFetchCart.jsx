import { useEffect, useState } from "react";
import { api } from "../api/api";

export const useFetchCart = () => {
  const [totalPages, setTotalPages] = useState();
  const fetch = async () => {
    try {
      const res = await api().get("/carts/getCart");
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.log(err.response?.data);
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  return { totalPages, fetch };
};
