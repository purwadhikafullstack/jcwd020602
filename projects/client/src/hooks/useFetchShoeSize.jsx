import { useEffect, useState } from "react";
import { api } from "../api/api";

export const useFetchShoeSize = () => {
  const [sizes, setSizes] = useState([]);
  const fetch = async () => {
    try {
      const res = await api().get(`/shoeSizes`);
      setSizes(res.data);
    } catch (err) {
      console.log(err.response.data);
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  return { sizes, fetch };
};
