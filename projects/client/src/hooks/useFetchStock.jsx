import { useEffect, useState } from "react";
import { api } from "../api/api";

export const useFetchStock = (filter) => {
  const [stocks, setStocks] = useState({ rows: [] });
  const fetch = async () => {
    try {
      await api
        .get(`/stocks`, {
          params: {
            ...filter,
          },
        })
        .then((res) => {
          setStocks(res.data);
        });
    } catch (err) {
      console.log(err);
      return err;
    }
  };
  useEffect(() => {
    if (filter.city != "") {
      fetch();
    }
  }, [filter]);
  return { stocks, fetch };
};
