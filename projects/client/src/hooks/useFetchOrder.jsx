import { useEffect, useState } from "react";
import { api } from "../api/api";

export const useFetchOrder = (filter) => {
  const [orders, setOrders] = useState();

  const fetchOrders = async () => {
    const token = JSON.parse(localStorage.getItem("user"));

    try {
      const res = await api.get(`/orders`, {
        headers: { Authorization: `Bearer ${token}` },
        params: filter,
      });
      setOrders(res.data);
    } catch (err) {
      console.log(err.response?.data);
    }
  };

  console.log(orders);

  useEffect(() => {
    fetchOrders();
  }, [filter]);

  return { orders, fetchOrders };
};

export const useFetchOrderList = (filter) => {
  const [orders, setOrders] = useState({ rows: [] });
  const fetchOrdersList = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("user"));
      const res = await api.get(`/orders/admin`, {
        headers: { Authorization: `Bearer ${token}` },
        params: filter,
      });
      setOrders(res.data);
    } catch (err) {
      console.log(err.response?.data);
    }
  };
  useEffect(() => {
    fetchOrdersList();
  }, [filter]);
  return { orders, fetchOrdersList };
};

export const useFetchSalesReport = (filter) => {
  const [salesData, setSalesData] = useState({ data: [] });
  const fetchSalesData = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("user"));
      const sales = await api.get("/orders/salesReport", {
        headers: { Authorization: `Bearer${token}` },
        params: filter,
      });
      console.log(sales.data);
      setSalesData(sales.data);
    } catch (err) {
      console.log(err.response.data);
    }
  };
  useEffect(() => {
    fetchSalesData();
  }, [filter]);
  return { salesData, fetchSalesData };
};
