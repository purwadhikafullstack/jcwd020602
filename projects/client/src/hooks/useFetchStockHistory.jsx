import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { api } from "../api/api";

export const useFetchStockHistory = (filter) => {
  const userSelector = useSelector((state) => state.auth);
  const [stockHistories, setStockHistories] = useState({ rows: [] });
  const fetch = async () => {
    try {
      const res = await api().get("/stockHistories", { params: filter });
      setStockHistories(res.data);
    } catch (err) {
      console.log(err.response.data);
    }
  };

  useEffect(() => {
    if (filter.city_id != "" || userSelector.role == "SUPERADMIN") {
      fetch();
    }
  }, [filter]);

  return { stockHistories, fetch };
};
