import axios from "axios";

export const api = axios.create({
  baseURL: 'http://192.168.100.204:3030'
  // baseURL: "http://localhost:3030"
});
