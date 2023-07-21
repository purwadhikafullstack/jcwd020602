import { useEffect, useState } from "react";
import { api } from "../api/api";

export const useFetchStock = (filter) => {
  const [stocks, setStocks] = useState({ rows: [] });
  const fetch = async () => {
    try {
      await api
        .get(`/stock`, {
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
    fetch();
  }, []);
  return { stocks, fetch };
};
