import { useEffect, useState } from "react";
import { api } from "../api/api";

export const useFetchCategory = () => {
  const [categories, setCategories] = useState();
  const fetch = async () => {
    try {
      await api.get(`/categories`).then((res) => {
        setCategories(res.data);
      });
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    fetch();
  }, []);
  return { categories, fetch };
};

export const useFetchSubcategory = () => {
  const [sub, setSub] = useState();
  const fetch = async () => {
    try {
      await api.get("/categories/sub").then((res) => {
        setSub(res.data);
      });
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    fetch();
  }, []);
  return { sub, fetch };
};
