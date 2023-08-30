import { useEffect, useState } from "react";
import { api } from "../api/api";

export const useFetchUser = (filter) => {
  const [users, setUsers] = useState();
  const [userFilter, setUserFilter] = useState({ rows: [] });
  const fetch = async () => {
    try {
      const res = await api().get(`/auth`, { params: filter });
      setUsers(res.data.rows);
      setUserFilter(res.data);
    } catch (err) {
      console.log(err.response.data);
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  return { users, userFilter, fetch };
};
