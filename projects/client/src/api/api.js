// import axios from "axios";

// const headers = {
//   ["x-secret-key"]: process.env.REACT_APP_API_SECRET_KEY,
// };
// const token = JSON.parse(localStorage.getItem("user"));
// if (token) {
//   headers.Authorization = `Bearer ${token}`;
// }

// export const api = axios.create({
//   baseURL: process.env.REACT_APP_API_BASE_URL,
//   headers,
// });

import axios from "axios";

export function api() {
  const headers = {
    ["x-secret-key"]: process.env.REACT_APP_API_SECRET_KEY,
  };
  const token = JSON.parse(localStorage.getItem("user"));
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  const api = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL,
    headers: headers,
  });
  return api;
}
