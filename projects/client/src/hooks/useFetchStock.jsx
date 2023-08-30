import { useEffect, useState } from "react";
import { api } from "../api/api";
import { useSelector } from "react-redux";
import { useToast } from "@chakra-ui/react";

export const useFetchStock = (filter) => {
  const [stocks, setStocks] = useState({ rows: [] });
  const [isLoading, setIsLoading] = useState(false);
  const fetch = async () => {
    setIsLoading(true);
    try {
      const resGetStocks = await api().get(`/stocks`, {
        params: { ...filter },
      });
      setStocks(resGetStocks.data);
    } catch (err) {
      setStocks({ rows: [] });
    }
  };
  useEffect(() => {
    if (filter.city_id != "") {
      fetch();
    }
  }, [filter]);
  useEffect(() => {
    setIsLoading(false);
  }, [stocks]);
  return { stocks, fetch, isLoading };
};
export const useFetchStockId = (id) => {
  const [isLoading, setIsLoading] = useState(false);
  const [stock, setStock] = useState({});
  const fetch = async () => {
    setIsLoading(true);
    try {
      const resGetStock = await api().get(`/stocks/${id}`);
      setStock(resGetStock?.data?.stock);
    } catch (err) {
      setStock({});
    }
  };
  useEffect(() => {
    if (id) {
      fetch();
    }
  }, [id]);
  useEffect(() => {
    setIsLoading(false);
  }, [stock]);
  return { stock, setStock, isLoading };
};
export const useFetchFromStock = (from_warehouse_id) => {
  const userSelector = useSelector((state) => state.auth);
  const [stocks, setStocks] = useState([]);
  const fetch = async () => {
    try {
      const resGetFW = await api().get(`/stocks/fromStock`, {
        params: {
          warehouse_id: from_warehouse_id,
        },
      });
      setStocks(resGetFW.data);
    } catch (err) {
      return err;
    }
  };
  useEffect(() => {
    if (from_warehouse_id != "" || userSelector.role == "SUPERADMIN") {
      fetch();
    }
  }, [from_warehouse_id]);
  return { stocks, fetch };
};
