import { useEffect, useState } from "react";
import { api } from "../api/api";
import { useSelector } from "react-redux";

export const useFetchStockMutation = (filter) => {
  const userSelector = useSelector((state) => state.auth);
  const [stockMutations, setStockMutations] = useState({ rows: [] });
  const fetch = async () => {
    try {
      await api()
        .get("/stockMutations", { params: filter })
        .then((res) => {
          setStockMutations(res.data);
        });
    } catch (err) {
      return err;
    }
  };
  useEffect(() => {
    if (filter.city_id != "" || userSelector.role == "SUPERADMIN") {
      fetch();
    }
  }, [filter]);
  return { stockMutations, fetch };
};
