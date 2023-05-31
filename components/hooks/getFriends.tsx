import axios from "axios";
import React from "react";
import useSWR from "swr";
import { instance } from "../utils/axiosInstance";
const usegetFriends = (user) => {
     const fetcher = async () => {
          const { data: res } = await instance.get(`/chats/${user?.name}`);
          return res.friends;
     };
     const { data, error, isLoading } = useSWR("chats", fetcher);

     return {
          data,
          error,
          isLoading,
     };
};

export default usegetFriends;
