import { useEffect, useState } from "react";
import { api } from "../api/api";

export const useFetchBrand = () => {
  const [brands, setBrands] = useState([]);
  const [asd, setasd] = useState({ rows: [] });
  console.log(asd);
  const fetch = async () => {
    try {
      const res = await api().get(`/brands`);
      setBrands(res.data.rows);
      setasd(res.data);
    } catch (err) {
      console.log(err?.response?.data);
    }
  };
  useEffect(() => {
    fetch();
  }, []);
  return { brands, fetch };
};
export const useFetchSelectBrand = () => {
  const [brands, setBrands] = useState([]);
  const fetch = async () => {
    try {
      const res = await api().get(`/brands/select`);
      setBrands(res.data);
    } catch (err) {
      console.log(err?.response?.data);
    }
  };
  useEffect(() => {
    fetch();
  }, []);
  return { brands };
};
