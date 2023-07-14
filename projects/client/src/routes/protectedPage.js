import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function ProtectedPage({ children, needLogin, guestOnly }) {
  const userSelector = useSelector((state) => state.auth);
  // console.log(userSelector);
  const nav = useNavigate();
  const token = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (
      !guestOnly &&
      needLogin &&
      (userSelector.role == "ADMIN" || userSelector.role == "SUPERADMIN")
    ) {
      return nav("/dashboard");
    } else {
      return nav("/");
    }
  }, [userSelector]);

  return children;
}
