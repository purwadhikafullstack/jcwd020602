import { useEffect, useState } from "react";
import { api } from "../api/api";
import { useSelector } from "react-redux";

export const useFetchStock = (filter) => {
  const [stocks, setStocks] = useState({ rows: [] });
  const fetch = async () => {
    try {
      const res = await api.get(`/stocks`, {
        params: { ...filter },
      });
      setStocks(res.data);

    } catch (err) {
      console.log(err.response.data);
    }
  };

  useEffect(() => {
    if (filter.city_id != "") {
      fetch();
    }
  }, [filter]);

  return { stocks, fetch };
};
export const useFetchFromStock = (from_warehouse_id) => {
  const userSelector = useSelector((state) => state.auth);
  const [stocks, setStocks] = useState([]);
  const fetch = async () => {
    try {
      const resGetFW = await api.get(`/stocks/fromStock`, {
        params: {
          warehouse_id: from_warehouse_id,
        },
      });
      setStocks(resGetFW.data);
    } catch (err) {
      console.log(err);
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
