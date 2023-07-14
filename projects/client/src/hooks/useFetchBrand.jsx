import { useEffect, useState } from "react";
import { api } from "../api/api";

export const useFetchBrand = () => {
  const [brands, setBrands] = useState();
  const fetch = async () => {
    try {
      await api.get(`/brands`).then((res) => {
        // console.log(res.data);
        setBrands(res.data);
      });
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    fetch();
  }, []);
  return { brands, fetch };
};
