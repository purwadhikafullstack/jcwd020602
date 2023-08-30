import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { api } from "../api/api";

export const useFetchStockHistory = (filter) => {
  const [isLoading, setIsLoading] = useState(false);
  const userSelector = useSelector((state) => state.auth);
  const [stockHistories, setStockHistories] = useState({ rows: [] });
  const fetch = async () => {
    setIsLoading(true);
    try {
      const res = await api().get("/stockHistories", { params: filter });
      setStockHistories(res.data);
    } catch (err) {
      setStockHistories({ rows: [] });
    }
  };

  useEffect(() => {
    if (filter.city_id != "" || userSelector.role == "SUPERADMIN") {
      fetch();
    }
  }, [filter]);
  useEffect(() => {
    setIsLoading(false);
  }, [stockHistories]);

  return { stockHistories, fetch, isLoading };
};
