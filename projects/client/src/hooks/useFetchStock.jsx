import { useEffect, useState } from "react";
import { api } from "../api/api";

export const useFetchStock = (filter) => {
  const [stocks, setStocks] = useState({ rows: [] });
  const fetch = async () => {
    try {
      const res = await api.get(`/stocks`, {
        params: { ...filter },
      });
      setStocks(res.data);
    } catch (err) {
      console.log(err.response.data);
    }
  };

  useEffect(() => {
    if (filter.city != "") {
      fetch();
    }
  }, [filter]);

  return { stocks, fetch };
};
