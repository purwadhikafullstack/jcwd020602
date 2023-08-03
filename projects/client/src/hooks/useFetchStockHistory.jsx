import { useEffect, useState } from "react";
import { api } from "../api/api";

export const useFetchStockHistory = (filter) => {
  const [stockHistories, setStockHistories] = useState({ rows: [] });
  const fetch = async () => {
    try {
      await api.get("/stockHistories", { params: filter }).then((res) => {
        setStockHistories(res.data);
      });
    } catch (err) {
      return err;
    }
  };
  useEffect(() => {
    if (filter.city_id != "") {
      fetch();
    }
  }, [filter]);
  return { stockHistories, fetch };
};
