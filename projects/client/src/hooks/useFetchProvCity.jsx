import { useEffect, useState } from "react";
import { api } from "../api/api";

export const useFetchProv = () => {
  const [provinces, setProvinces] = useState();
  const fetch = async () => {
    try {
      await api.get(`/province&city/prov`).then((res) => {
        setProvinces(res.data);
      });
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    fetch();
  }, []);
  return { provinces, fetch };
};

export const useFetchCity = (id) => {
  const [cities, setCities] = useState();
  const province = id;

  const fetch = async () => {
    try {
      if (province) {
        await api.get("/province&city/city/" + province).then((res) => {
          setCities(res.data);
        });
      } else {
        setCities([]);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetch();
  }, [province]);

  return { cities, fetch };
};
