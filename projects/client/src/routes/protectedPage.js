import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function ProtectedPage({
  children,
  guestOnly,
  userOnly,
  staffOnly,
}) {
  const userSelector = useSelector((state) => state.auth);
  const nav = useNavigate();
  const token = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (guestOnly && !(userSelector.role == "USER" || !userSelector.role)) {
      return nav("/dashboard");
    } else if (userOnly && !(userSelector.role == "USER")) {
      return nav("/");
    } else if (
      staffOnly &&
      !(userSelector.role == "ADMIN" || userSelector.role == "SUPERADMIN")
    ) {
      return nav("/");
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
  }, [userSelector, guestOnly, staffOnly, userOnly]);

  return children;
}
