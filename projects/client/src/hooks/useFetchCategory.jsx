import { useEffect, useState } from "react";
import { api } from "../api/api";

export const useFetchCategory = () => {
  const [categories, setCategories] = useState([]);

  const fetch = async () => {
    try {
      const res = await api.get(`/categories`);
      setCategories(res.data);
    } catch (err) {
      console.log(err?.response?.data);
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  return { categories, fetch };
};

export const useFetchSubcategory = () => {
  const [sub, setSub] = useState([]);

  const fetch = async () => {
    try {
      const res = await api.get("/subcategories");
      setSub(res.data);
    } catch (err) {
      console.log(err?.response?.data);
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  return { sub, fetch };
};
