import axios from "axios";
const headers = {
  ["x-secret-key"]: "foothub55",
};
const token = JSON.parse(localStorage.getItem("user"));
if (token) {
  headers.Authorization = `Bearer ${token}`;
}
export const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  headers,
});
