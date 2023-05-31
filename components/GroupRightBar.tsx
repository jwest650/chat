import React, { useEffect, useState } from "react";
import useUser from "../store/userStore";
import Image from "next/image";
import useSWR from "swr";
import axios from "axios";
import moment from "moment";
import useFilter from "./utils/Filter";
import Participant from "./Participant";
const GroupRightBar = () => {
     const [users, roomID, darkmode, messages, user] = useUser((state) => [
          state.users,
          state.roomID,
          state.darkmode,
          state.data,
          state.user,
     ]);
     const [group, setgroup] = useState("");

     const {
          data: res,
          error,
          isLoading,
     } = useSWR(["group", roomID], async () => {
          const { data } = await axios.get(
               `http://localhost:5000/group/messages/${roomID}`
          );
          return data;
     });

     useEffect(() => {
          if (res) {
               setgroup(res.chat);
          }
     }, [roomID, res]);
     return (
          <div
               className={`w-[15%]   ${
                    darkmode
                         ? "bg-[#202227] text-white"
                         : "bg-slate-100  text-gray-700"
               }`}
          >
               <section className={`space-y-1 flex flex-col  h-screen `}>
                    <aside
                         className={` p-4 flex flex-col items-center space-y-3 ${
                              !darkmode && "bg-white"
                         }`}
                    >
                         <div className="relative w-fit">
                              <Image
                                   src={group?.image}
                                   width={100}
                                   height={100}
                                   className="rounded-full"
                              />
                         </div>
                         <div className="capitalize font-bold text-center">
                              <p>{group?.title}</p>
                         </div>
                         <article className="flex justify-center space-x-10">
                              <div className="space-y-7 capitalize font-bold text-md text-right ">
                                   <p> total :</p>
                                   <p>created by:</p>
                              </div>
                              <div className="space-y-7 ">
                                   <p>{group?.messages?.length}</p>
                                   <p className="capitalize space-x-2">
                                        <span className="font-bold">
                                             {group?.createdBy}
                                        </span>
                                        ,
                                        <span>
                                             {moment(group?.createdAt).format(
                                                  "l"
                                             )}
                                        </span>
                                   </p>
                              </div>
                         </article>
                    </aside>
                    <aside
                         className={` p-4 flex-1   overflow-hidden space-y-2 ${
                              !darkmode && "bg-white"
                         }`}
                    >
                         <h1 className="font-bold text-lg capitalize">
                              {group?.participants?.length} participants
                         </h1>

                         <article className="space-y-5 ">
                              {group?.participants?.map((val, i) => (
                                   <Participant key={i} val={val} />
                              ))}
                         </article>
                    </aside>
               </section>
          </div>
     );
};

export default GroupRightBar;
