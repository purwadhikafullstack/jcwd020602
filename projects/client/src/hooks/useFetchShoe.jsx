import { useEffect, useState } from "react";
import { api } from "../api/api";

export const useFetchShoe = (category, sub, filter) => {
  const [shoes, setShoes] = useState({ rows: [] });
  const fetch = async () => {
    try {
      const res = await api().get(`/shoes`, {
        params: { category, sub, filter },
      });
      setShoes(res.data);
    } catch (err) {
      console.log(err?.response);
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  return { shoes, fetch };
};

export const useFetchSelectShoe = ({
  brand_id,
  category_id,
  subcategory_id,
}) => {
  const [shoes, setShoes] = useState([]);
  const fetch = async () => {
    try {
      const res = await api().get(`/shoes/select`, {
        params: { subcategory_id, category_id, brand_id },
      });
      setShoes(res.data);
    } catch (err) {
      console.log(err?.response);
    }
  };

  useEffect(() => {
    fetch();
  }, [brand_id, category_id, subcategory_id]);

  return { shoes };
};
