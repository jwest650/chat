import Image from "next/image";
import axios from "axios";
import { useEffect, useState } from "react";
import moment from "moment";
import useUser from "../store/userStore";
const User = ({ val, id, setRoomId, count, active, setactive }) => {
     const [darkmode] = useUser((state) => [state.darkmode]);
     const [lastmessage, setlastmessage] = useState("");

     const [time, settime] = useState("");
     const fetcher = async () => {
          const { data } = await axios.get(
               `http://localhost:5000/messages/${id}`
          );

          return data;
     };

     useEffect(() => {
          fetcher().then((res) => {
               if (res?.chat?.messages.length > 0) {
                    settime(
                         res?.chat?.messages?.[res?.chat?.messages.length - 1]
                              .createdAt
                    );
                    setlastmessage(
                         res?.chat?.messages?.[res?.chat?.messages.length - 1]
                              .message
                    );
               }
          });
     }, []);
     console.log(lastmessage);

     return (
          <div
               className={` ${
                    id === active && !darkmode
                         ? "border-l-2  border-[#1557FF] bg-white  "
                         : ""
               } ${id === active && darkmode ? "bg-gray-600" : ""} px-2 py-3 `}
               onClick={() => {
                    setactive(id);
                    setRoomId(id);
               }}
          >
               <section className="flex items-center justify-between space-x-2">
                    <div className="relative">
                         <Image
                              src={val?.image}
                              width={35}
                              height={35}
                              className="rounded-full"
                         />
                         <div className="w-[5px] h-[5px] rounded-full bg-green-500 absolute bottom-1 right-[1px]" />
                    </div>
                    <div className="w-[60%] leading-[18px] flex flex-col justify-center ">
                         <h1 className="font-semibold capitalize ">
                              {val.name}
                         </h1>
                         {lastmessage ? (
                              <p className=" truncate">{lastmessage}</p>
                         ) : (
                              <p className="text-red-500">no messages</p>
                         )}
                    </div>
                    <aside className="flex  flex-col space-x-2 items-center">
                         {time ? (
                              <small className=" font-bold ">
                                   {moment(time).format("LT")}
                              </small>
                         ) : (
                              ""
                         )}
                         <div className="w-[18px] p-2 h-[18px] bg-[#1557FF] rounded-full flex items-center justify-center">
                              <small className="text-white font-bold">
                                   {count}
                              </small>
                         </div>
                    </aside>
               </section>
          </div>
     );
};

export default User;
