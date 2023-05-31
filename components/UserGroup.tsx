import Image from "next/image";
import React, { useState, useEffect } from "react";
import useUser from "../store/userStore";
import moment from "moment";

import useSWR from "swr";
import axios from "axios";
import { instance } from "./utils/axiosInstance";

const UserGroup = ({ val, setRoomId, active, setactive }) => {
     const [darkmode] = useUser((state) => [state.darkmode]);

     const [lastMessage, setlastMessage] = useState("");
     const [time, settime] = useState("");

     const fetcher = async () => {
          const { data } = await instance.get(`/group/messages/${val.roomId}`);

          return data;
     };

     const { data } = useSWR("group", fetcher);

     useEffect(() => {
          if (data?.chat.messages.length > 0) {
               const response =
                    data?.chat?.messages?.[data.chat.messages.length - 1]
                         .message;
               setlastMessage(response);
               const time =
                    data?.chat?.messages?.[data.chat.messages.length - 1]
                         .createdAt;
               settime(time);
          }
     }, [data]);

     return (
          <div
               className={` ${
                    !darkmode && active == val.roomId
                         ? "border-l-2  border-[#555555] bg-gradient-to-r from-slate-100 text-[#555555] "
                         : darkmode && active == val.roomId
                         ? "bg-gradient-to-r from-gray-500 text-white"
                         : ""
               }  px-2 py-3 ${active == val.roomId ? "" : "border-t"}`}
               onClick={() => {
                    setactive(val.roomId);
                    setRoomId(val.roomId);
               }}
          >
               <section className="flex  items-center justify-between space-x-2 ">
                    <div className="relative">
                         <Image
                              src={val?.image}
                              width={35}
                              height={35}
                              className="rounded-full"
                         />
                    </div>
                    <div className="w-[60%] leading-[18px] flex flex-col justify-center ">
                         <h1 className="font-semibold capitalize ">
                              {val.title}
                         </h1>

                         {lastMessage ? (
                              <p className=" truncate ">{lastMessage}</p>
                         ) : (
                              <p className="text-[#C1C1C1]">no messages</p>
                         )}
                    </div>
                    <aside className="flex whitespace-nowrap  flex-col items-center">
                         {time && (
                              <small className=" font-bold ">
                                   {moment(time).format("LT")}
                              </small>
                         )}
                         <div className="w-[18px] p-2 h-[18px]  bg-[#555555] rounded-full flex items-center justify-center">
                              <small className="text-white font-bold">
                                   {0}
                              </small>
                         </div>
                    </aside>
               </section>
          </div>
     );
};

export default UserGroup;
