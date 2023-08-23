import { useEffect, useState } from "react";
import { api } from "../api/api";

export const useFetchProv = () => {
  const [provinces, setProvinces] = useState();

  const fetch = async () => {
    try {
      const res = await api().get(`/province&city/prov`);
      setProvinces(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  return { provinces, fetch };
};

export const useFetchCity = (province_id) => {
  const [cities, setCities] = useState();

  const fetch = async () => {
    try {
      if (province_id) {
        const res = await api().get("/province&city/city/" + province_id);
        setCities(res.data);
      } else {
        setCities([]);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetch();
  }, [province_id]);

  return { cities, fetch };
};
