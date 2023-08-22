import { useEffect, useState } from "react";
import { api } from "../api/api";

export const useFetchBrand = () => {
  const [brands, setBrands] = useState([]);

  const fetch = async () => {
    try {
      const res = await api.get(`/brands`);
      setBrands(res.data);
    } catch (err) {
      console.log(err?.response?.data);
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  return { brands, fetch };
};
