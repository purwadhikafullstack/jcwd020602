import { useEffect, useState } from "react";
import { api } from "../api/api";

export const useFetchShoe = (category, sub, filter) => {
  const [shoes, setShoes] = useState({ rows: [] });

  const fetch = async () => {
    try {
      const res = await api.get(`/shoes`, {
        params: { category, sub, filter },
      });
      setShoes(res.data);
    } catch (err) {
      console.log(err?.response?.data);
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  return { shoes, fetch };
};
