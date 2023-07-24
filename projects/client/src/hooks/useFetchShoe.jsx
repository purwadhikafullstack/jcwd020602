import { useEffect, useState } from "react";
import { api } from "../api/api";

export const useFetchShoe = () => {
  const [shoes, setShoes] = useState([]);
  const fetch = async () => {
    try {
      await api.get(`/shoes`).then((res) => {
        setShoes(res.data);
      });
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    fetch();
  }, []);
  return { shoes, fetch };
};
