import { useEffect, useState } from "react";
import { api } from "../api/api";

export const useFetchWarehouse = () => {
  const [warehouses, setWarehouses] = useState([]);
  const fetch = async () => {
    try {
      api.get(`/warehouses`).then((res) => {
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

export const useFetchWareProv = () => {
  const [provinces, setProvinces] = useState([]);
  const fetch = () => {
    try {
      api.get(`/warehouses/prov`).then((res) => {
        setProvinces(res.data);
      });
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    fetch();
  }, []);
  return { provinces, fetch };
};
export const useFetchWareCity = (province) => {
  const [cities, setCities] = useState([]);
  const fetch = async () => {
    try {
      if (province) {
        await api
          .get("/warehouses/city", { params: { province } })
          .then((res) => {
            setCities(res.data);
          });
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetch();
  }, [province]);

  return { cities, fetch };
};
