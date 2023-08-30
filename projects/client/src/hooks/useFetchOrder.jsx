import { useEffect, useState } from "react";
import { api } from "../api/api";
import { downloadExcel } from "react-export-table-to-excel";

export const useFetchOrder = (filter) => {
  const [orders, setOrders] = useState();

  const fetchOrders = async () => {
    const token = JSON.parse(localStorage.getItem("user"));

    try {
      const res = await api().get(`/orders`, {
        headers: { Authorization: `Bearer ${token}` },
        params: filter,
      });
      setOrders(res.data);
    } catch (err) {
      console.log(err.response?.data);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [filter]);

  return { orders, fetchOrders };
};

export const useFetchOrderList = (filter) => {
  const [isLoading, setIsLoading] = useState(false);
  const [orders, setOrders] = useState({ rows: [] });
  const fetchOrdersList = async () => {
    setIsLoading(true);
    try {
      const token = JSON.parse(localStorage.getItem("user"));
      const res = await api().get(`/orders/admin`, {
        headers: { Authorization: `Bearer ${token}` },
        params: filter,
      });
      setOrders(res.data);
    } catch (err) {
      setOrders({ rows: [] });
    }
  };
  useEffect(() => {
    fetchOrdersList();
  }, [filter]);
  useEffect(() => {
    setIsLoading(false);
  }, [orders]);
  return { orders, fetchOrdersList, isLoading };
};

export const useFetchSalesReport = (filter) => {
  const [salesData, setSalesData] = useState([]);
  const fetchSalesData = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("user"));
      const sales = await api().get("/orders/salesReport", {
        params: filter,
      });
      setSalesData(sales.data);
    } catch (err) {
      console.log(err.response.data);
    }
  };
  useEffect(() => {
    fetchSalesData();
  }, [filter]);
  return { salesData };
};

export const useFetchExcelReport = (setIsLoading) => {
  const [excel, setExcel] = useState({ header: "", label: [], data: [] });
  const header = ["Date", excel.header];
  const handleDownloadExcel = (body) => {
    const opt = "downloadExcel Method";
    downloadExcel({
      fileName: `${excel.header} - ${opt}`,
      sheet: "1",
      tablePayload: {
        header,
        body,
      },
    });
    setIsLoading(false);
    setExcel({ header: "", label: [], data: [] });
  };
  const bodyMaker = () => {
    if (excel.label.length && excel.data.length) {
      const data = [];
      let total = 0;
      excel.label.map((val, idx) => {
        data.push([[val], [excel.data[idx]]]);
        total += excel.data[idx];
      });
      data.push([["Total"], [total]]);
      handleDownloadExcel(data);
    }
  };
  useEffect(() => {
    bodyMaker();
  }, [excel]);
  return { excel, setExcel };
};
