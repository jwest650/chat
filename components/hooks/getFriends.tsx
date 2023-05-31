import axios from "axios";
import React from "react";
import useSWR from "swr";
const usegetFriends = (user) => {
     const fetcher = async () => {
          const { data: res } = await axios.get(
               `http://localhost:5000/chats/${user?.name}`
          );
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
