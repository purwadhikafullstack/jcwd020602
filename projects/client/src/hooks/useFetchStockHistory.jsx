import { useEffect, useState } from "react";
import { api } from "../api/api";

export const useFetchStockHistory = (filter) => {
  const [stockHistories, setStockHistories] = useState({ rows: [] });
  const fetch = async () => {
    try {
      await api.get("/stockHistories", { params: filter }).then((res) => {
        console.log(res.data);
        setStockHistories(res.data);
      });
    } catch (err) {
      return err;
    }
  };
  useEffect(() => {
    if (filter.city != "") {
      fetch();
    }
  }, [filter]);
  return { stockHistories, fetch };
};
