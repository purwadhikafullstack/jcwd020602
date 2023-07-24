import { useEffect, useState } from "react";
import { api } from "../api/api";

export const useFetchShoeSize = () => {
  const [sizes, setSizes] = useState([]);
  const fetch = async () => {
    try {
      await api.get(`/shoeSizes`).then((res) => {
        setSizes(res.data);
      });
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    fetch();
  }, []);
  return { sizes, fetch };
};
