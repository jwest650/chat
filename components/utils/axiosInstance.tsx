import axios from "axios";
let url =
     process.env.NODE_ENV === "production"
          ? `${process.env.HOST}`
          : "http://localhost:5000";
export const instance = axios.create({
     baseURL: url,
});
