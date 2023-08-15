import { useEffect, useState } from "react";
import { api } from "../api/api";

export const useFetchOrder = () => {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    const token = JSON.parse(localStorage.getItem("user"));

    try {
      const res = await api.get(`/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders([res.data?.data]);
    } catch (err) {
      console.log(err.response?.data);
    }
  };

  console.log(orders);

  useEffect(() => {
    fetchOrders();
  }, []);

  return { orders, fetchOrders };
};
