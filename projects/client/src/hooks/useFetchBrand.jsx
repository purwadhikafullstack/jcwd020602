import { useEffect, useState } from "react";
import { api } from "../api/api";

export const useFetchBrand = (filter) => {
  const [brands, setBrands] = useState([]);
  const [brandsFilter, setBrandsFilter] = useState({ rows: [] });

  const fetch = async () => {
    try {
      const res = await api().get(`/brands`, { params: { ...filter } });
      setBrands(res.data.rows);
      setBrandsFilter(res.data);
    } catch (err) {
      console.log(err?.response?.data);
    }
  };
  useEffect(() => {
    fetch();
  }, []);

  return { brands, brandsFilter, fetch };
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
