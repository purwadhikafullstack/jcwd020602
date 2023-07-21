import { useEffect, useState } from "react";
import { api } from "../api/api";

export const useFetchWarehouse = () => {
  const [warehouses, setWarehouses] = useState();
  const fetch = async () => {
    try {
      await api.get(`/warehouses`).then((res) => {
        setWarehouses(res.data);
      });
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    fetch();
  }, []);
  return { warehouses, fetch };
};
