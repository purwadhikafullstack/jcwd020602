import { useEffect, useState } from "react";
import { api } from "../api/api";

export const useFetchCategory = (filter) => {
  const [categories, setCategories] = useState([]);
  const [categoriesFilter, setCategoriesFilter] = useState({ rows: [] });
  const fetch = async () => {
    try {
      const res = await api().get(`/categories`, { params: { ...filter } });
      setCategories(res.data.rows);
      setCategoriesFilter(res.data);
    } catch (err) {
      console.log(err?.response?.data);
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  return { categories, categoriesFilter, fetch };
};

export const useFetchSubcategory = (filter) => {
  const [sub, setSub] = useState([]);
  const [subFilter, setSubFilter] = useState({ rows: [] });

  const fetch = async () => {
    try {
      const res = await api().get("/subcategories", { params: filter });
      setSub(res.data.rows);
      setSubFilter(res.data);
    } catch (err) {
      console.log(err?.response?.data);
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  return { sub, subFilter, fetch };
};

export const useFetchSelectCategory = () => {
  const [categories, setCategories] = useState([]);
  const fetch = async () => {
    try {
      const res = await api().get(`/categories/selectCategory`);
      setCategories(res.data);
    } catch (err) {
      console.log(err?.response?.data);
    }
  };

  useEffect(() => {
    fetch();
  }, []);
  return { categories };
};

export const useFetchSelectSubcategory = ({ category_id }) => {
  const [sub, setSub] = useState([]);
  const fetch = async () => {
    try {
      const res = await api().get("/categories/selectSubcategory", {
        params: { category_id },
      });
      setSub(res.data);
    } catch (err) {
      console.log(err?.response?.data);
    }
  };

  useEffect(() => {
    fetch();
  }, [category_id]);

  return { sub };
};
