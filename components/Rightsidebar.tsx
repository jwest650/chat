import axios from "axios";
import moment from "moment";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import useUser from "../store/userStore";
import useFilter from "./utils/Filter";

const Rightsidebar = ({ socket, lastSeen }) => {
     const [toggle, settoggle] = useState(false);
     const [users, roomID, darkmode, messages, user, onlineUsers] = useUser(
          (state) => [
               state.users,
               state.roomID,
               state.darkmode,
               state.data,
               state.user,
               state.onlineUsers,
          ]
     );
     const [friend, setfriend] = useState(null);
     const [createdAt, setcreatedAt] = useState(null);
     const [seen, setseen] = useState(null);
     const [online, setonline] = useState("offline");
     const sent = useFilter(messages, friend?.name);
     const recieved = useFilter(messages, user?.name);

     function getPic() {
          let res = users?.find((val) => {
               return val.roomID == roomID;
          });
          return res.user;
     }
     const fetcher = async () => {
          const { data } = await axios.get(
               `http://localhost:5000/messages/${roomID}`
          );

          return data;
     };
     useEffect(() => {
          if (roomID && users) {
               setfriend(getPic());
          }
          fetcher().then((res) => setcreatedAt(res?.chat.createdAt));
     }, [roomID]);
     useEffect(() => {
          if (onlineUsers.indexOf(friend?.name) > -1) {
               setonline("online");
          } else {
               setonline("offline");
          }

          const filter = lastSeen?.filter((val) => val.user == friend?.name);

          if (filter.length >= 0) {
               setseen(filter[0]?.seen);
          }
     }, [onlineUsers, friend]);

     return (
          <div
               className={`w-[15%] p-4 ${
                    darkmode ? "bg-[#202227] text-white" : "  text-gray-700"
               }`}
          >
               <section className="space-y-10">
                    <aside className="flex flex-col items-center space-y-3">
                         <div className="relative w-fit">
                              <Image
                                   src={friend?.image}
                                   width={100}
                                   height={100}
                                   className="rounded-full"
                              />
                              <div className="w-[15px] h-[15px] rounded-full bg-green-500 absolute bottom-1 right-[8px]" />
                         </div>
                         <div className="capitalize font-bold text-center">
                              <p>{friend?.name}</p>
                              <small className="text-green-500">{online}</small>
                         </div>
                    </aside>
                    <aside className="flex justify-center space-x-10">
                         <div className="space-y-7 capitalize font-bold text-md text-right ">
                              <p> sent :</p>
                              <p> recieved :</p>
                              <p> total :</p>
                              <p>last seen : </p>
                              <p>date created :</p>
                         </div>
                         <div className="space-y-7 ">
                              <p>{sent.length}</p>
                              <p>{recieved.length}</p>
                              <p>{messages.length}</p>
                              <p>{moment(seen).startOf("hour").fromNow()}</p>
                              <p> {moment(createdAt).format("l")}</p>
                         </div>
                    </aside>
               </section>
          </div>
     );
};

export default Rightsidebar;
