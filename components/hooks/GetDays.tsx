import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import useSWR from "swr";
import useUser from "../../store/userStore";

const useGetDays = (value) => {
     //   const [roomID] = useUser((state) => [state.roomID]);
     const [result, setresult] = useState({});
     console.log(value);

     //   const fetcher = async () => {
     //        const { data } = await axios.get(
     //             `http://localhost:5000/messages/${roomID}`
     //        );
     //        return data;
     //   };
     //   const { data, error, isLoading } = useSWR(["messages", roomID], fetcher, {
     //        // revalidateIfStale: false,
     //        // revalidateOnFocus: false,
     //   });
     function grpDays(day) {
          //  return value.chat.messages.filter(
          //       (msg) => day == moment(msg.createdAt).format("dddd")
          //  );
     }
     // useEffect(() => {
     //      let mon = grpDays("Monday");
     //      let tues = grpDays("Tuesday");
     //      let wed = grpDays("Wednesday");
     //      let thurs = grpDays("Thursday");
     //      let fri = grpDays("Friday");

     //      setresult({
     //           mon,
     //           tues,
     //           wed,
     //           thurs,
     //           fri,
     //      });
     // }, []);

     return [result];
};

export default useGetDays;
