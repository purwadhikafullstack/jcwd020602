import { useEffect, useState } from "react";
import { api } from "../api/api";

export const useFetchShipping = (weightTotal, courier) => {
  const [shipping, setShipping] = useState();

  const fetchShipping = async () => {
    const token = JSON.parse(localStorage.getItem("user"));

    try {
      const response = await api().post(
        "/checkOuts/shipping",
        {
          weight: weightTotal,
          courier: courier,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setShipping(response.data?.data);
    } catch (err) {
      console.log(err.response?.data);
    }
  };
  useEffect(() => {
    fetchShipping();
  }, []);

  return { shipping, fetchShipping };
};
