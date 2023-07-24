import { useEffect, useState } from "react";
import { api } from "../api/api";

export const useFetchUser = () => {
  const [users, setUsers] = useState();
  const fetch = async () => {
    try {
      await api.get(`/auth`).then((res) => {
        setUsers(res.data);
      });
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    fetch();
  }, []);
  return { users, fetch };
};
