import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "",
  withCredentials: true, //sends cookies
});
