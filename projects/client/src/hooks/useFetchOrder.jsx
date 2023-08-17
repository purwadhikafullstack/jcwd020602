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

export const useFetchOrderList = (filter) => {
  const [orders, setOrders] = useState({ rows: [] });
  const fetchOrdersList = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("user"));
      const res = await api.get(
        `/orders/admin`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
        { params: filter }
      );

      setOrders(res.data);
    } catch (err) {
      console.log(err.response?.data);
    }
  };
  useEffect(() => {
    fetchOrdersList();
  }, []);
  return { orders, fetchOrdersList };
};
