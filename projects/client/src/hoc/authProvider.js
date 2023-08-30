import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { api } from "../api/api";

export default function AuthProvider({ children }) {
  const dispatch = useDispatch();
  const userSelector = useSelector((state) => state.auth);

  useEffect(() => {
    fetch(dispatch);
  }, []);

  return children;
}

export async function fetch(dispatch) {
  try {
    const token = JSON.parse(localStorage.getItem("user"));
    if (token) {
      const user = await api().get("/auth/userbytoken", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (user) {
        dispatch({
          type: "login",
          payload: user.data,
        });
      }
    }
  } catch (err) {
    return err;
  }
}
