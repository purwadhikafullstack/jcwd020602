import { useEffect, useState } from "react";
import { api } from "../api/api";

export const useFetchUser = () => {
  const [users, setUsers] = useState();
  const token = JSON.parse(localStorage.getItem("user"));
  const fetch = async () => {
    try {
      const res = await api().get(`/auth`, {
        headers: { Authorization: `bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      console.log(err.response.data);
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  return { users, fetch };
};
