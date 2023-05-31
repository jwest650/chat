import Image from "next/image";
import React, { useEffect, useState } from "react";
import { IoCall, IoVideocam } from "react-icons/io5";
import useUser from "../store/userStore";

const ChatHeader = ({ socket, typing }) => {
     const [users, roomID, darkmode, onlineUsers, chatType] = useUser(
          (state) => [
               state.users,
               state.roomID,
               state.darkmode,
               state.onlineUsers,
               state.chatType,
          ]
     );
     const [friend, setfriend] = useState("");
     const [online, setonline] = useState("offline");

     function getPic() {
          let res = users?.find((val) => {
               return val.roomID == roomID;
          });
          return res.user;
     }

     useEffect(() => {
          if (roomID && users) {
               setfriend(getPic());
          }
     }, [roomID]);

     useEffect(() => {
          if (onlineUsers.indexOf(friend?.name) > -1) {
               setonline("online");
          } else {
               setonline("offline");
          }
     }, [friend, onlineUsers]);

     return (
          <div
               className={`sticky top-0 z-50 p-4 flex justify-between  ${
                    darkmode
                         ? "bg-[#202227] text-white"
                         : "border-b bg-[#FDFFFC]   text-[#555555]"
               }`}
          >
               <button className="flex space-x-2 items-center">
                    <Image
                         src={friend?.image}
                         width={35}
                         height={35}
                         className="rounded-full"
                    />
                    <div className="mt-1 ">
                         <p className="capitalize font-bold ">{friend?.name}</p>
                         {typing == friend.name ? (
                              <small className="capitalize  font-bold">
                                   {typing} is typing
                              </small>
                         ) : (
                              <small className="text-green-500 font-bold tracking-widest">
                                   {online}
                              </small>
                         )}
                    </div>
               </button>

               <aside className="flex flex-col justify-between items-center">
                    <button>
                         <IoCall color="#555555" />
                    </button>
                    <button>
                         <IoVideocam color="#555555" />
                    </button>
               </aside>
          </div>
     );
};

export default ChatHeader;
