import axios from "axios";

export const instance = axios.create({
     baseURL:
          process.env.NODE_ENV === "production"
               ? process.env.HOST
               : "http://localhost:5000",
});
