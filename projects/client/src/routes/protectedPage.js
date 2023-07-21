import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function ProtectedPage({ children, guestOnly, needLogin }) {
  const userSelector = useSelector((state) => state.auth);
  const nav = useNavigate();
  const token = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (needLogin && (userSelector.role == "USER" || !userSelector.role)) {
      return nav("/");
    } else if (
      guestOnly &&
      (userSelector.role == "ADMIN" || userSelector.role == "SUPERADMIN")
    ) {
      return nav("/dashboard");
    } else if (
      !(
        userSelector.role == "ADMIN" ||
        userSelector.role == "SUPERADMIN" ||
        userSelector.role == "" ||
        userSelector.role == "USER"
      )
    ) {
      return nav("/");
    }
  }, [userSelector, guestOnly, needLogin]);

  return children;
}
