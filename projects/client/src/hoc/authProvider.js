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
      if (token) {
<<<<<<< Updated upstream
        const user = await api
          .get("/auth/v3", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((res) => res.data);
=======
        const user = await api.get("/auth/userbytoken", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
>>>>>>> Stashed changes
        if (user) {
          dispatch({
            type: "login",
            payload: user.data,
          });
        }
      }
    } catch (err) {
      console.log(err);
    }
  }

  return children;
}
