import { useEffect, useState } from "react";
import { api } from "../api/api";
import { useSelector } from "react-redux";

export const useFetchStockMutation = (filter) => {
  const [isLoading, setIsLoading] = useState(false);
  const userSelector = useSelector((state) => state.auth);
  const [stockMutations, setStockMutations] = useState({ rows: [] });
  const fetch = async () => {
    setIsLoading(true);
    try {
      const resMutation = await api().get("/stockMutations", {
        params: filter,
      });
      setStockMutations(resMutation.data);
    } catch (err) {
      setStockMutations({ rows: [] });
    }
  };
  useEffect(() => {
    if (filter.city_id != "" || userSelector.role == "SUPERADMIN") {
      fetch();
    }
  }, [filter]);
  useEffect(() => {
    setIsLoading(false);
  }, [stockMutations]);
  return { stockMutations, fetch, isLoading };
};
