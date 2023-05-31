import axios from "axios";

export const instance = axios.create({
     baseURL: `https://chattyserver-4731.onrender.com/`,
});
