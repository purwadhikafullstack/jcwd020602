import { useEffect, useState } from "react";
import { api } from "../api/api";
import { useSelector } from "react-redux";

export const useFetchWarehouse = () => {
  const [warehouses, setWarehouses] = useState([]);

  const fetch = async () => {
    try {
      const res = await api.get(`/warehouses`);
      setWarehouses(res.data);
    } catch (err) {
      console.log(err.response.data);
    }
  };
  useEffect(() => {
    fetch();
  }, []);
  return { warehouses, fetch };
};

export const useFetchWareProv = () => {
  const [provinces, setProvinces] = useState([]);

  const fetch = async () => {
    try {
      const res = await api.get(`/warehouses/prov`);
      setProvinces(res.data);
    } catch (err) {
      console.log(err.response.data);
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
        const res = await api.get("/warehouses/city", { params: { province } });
        setCities(res.data);
      }
    } catch (err) {
      console.log(err.response.data);
    }
  };

  useEffect(() => {
    fetch();
  }, [province]);

  return { cities, fetch };
};
