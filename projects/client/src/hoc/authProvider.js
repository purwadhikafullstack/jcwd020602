import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { api } from "../api/api";

export default function AuthProvider({ children }) {
  const dispatch = useDispatch();
  const userSelector = useSelector((state) => state.auth);

  useEffect(() => {
    fetch();
  }, []);

  async function fetch() {
    try {
      const token = JSON.parse(localStorage.getItem("user"));
      console.log(token);
      const user = await api
        .get("/users/v3", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => res.data);
      if (user) {
        dispatch({
          type: "login",
          payload: user,
        });
      }
    } catch (err) {
      console.log(err);
    }
  }

  return children;
}
