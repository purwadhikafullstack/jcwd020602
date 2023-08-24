import { useEffect, useState } from "react";
import { api } from "../api/api";

export const useFetchAddress = () => {
  const [address, setAddress] = useState([]);
  const fetch = async () => {
    try {
      const res = await api().get(`/address`);
      setAddress(res.data);
    } catch (err) {
      console.log(err?.response?.data);
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  return { address, fetch };
};
