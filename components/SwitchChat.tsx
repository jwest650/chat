import React, { useEffect, useState } from "react";
import Users from "./Users";
import axios from "axios";
import useUser from "../store/userStore";
import useSWR from "swr";
import AddFriendModal from "./utils/AddFriendModal";
import CreateGroupModal from "./utils/CreateGroupModal";

const SwitchChat = () => {
     const [sent, setsent] = useState(false);

     const [
          user,
          setChat,
          chatType,
          setchatType,
          setRoomId,
          darkmode,
          modalState,
     ] = useUser((state) => [
          state.user,
          state.getChat,
          state.chatType,
          state.setChatType,
          state.getRoomId,
          state.darkmode,
          state.modalState,
     ]);

     const { data, error, isLoading } = useSWR(
          [[chatType], chatType, sent],
          fetcher
     );
     async function fetcher() {
          const url =
               chatType == "chats"
                    ? "http://localhost:5000/chats"
                    : "http://localhost:5000/group";
          const { data: res } = await axios.get(`${url}/${user?.name}`);
          console.log("k");

          return res;
     }
     useEffect(() => {
          if (data) {
               if (chatType == "chats") {
                    setChat(data.friends);
               } else {
                    setChat(data);
               }
          }
     }, [data, chatType]);

     useEffect(() => {
          if (sent && data) {
               if (chatType == "chats") {
                    setChat(data.friends);
               } else {
                    setChat(data);
               }
               setsent(false);
          }
     }, [sent, data]);

     return (
          <div className="">
               {modalState == "add friend" ? (
                    <AddFriendModal setsent={setsent} />
               ) : modalState == "create group" ? (
                    <CreateGroupModal setsent={setsent} />
               ) : (
                    ""
               )}
               <aside
                    className={` ${
                         darkmode
                              ? "bg-gray-700 text-white"
                              : " bg-slate-100  text-gray-600"
                    }  flex justify-between  p-1 rounded-md mx-2  `}
               >
                    <button
                         className={`px-2 py-1 w-[48%]  ${
                              chatType == "chats" && !darkmode
                                   ? " bg-white"
                                   : ""
                         } rounded-md capitalize ${
                              darkmode && chatType == "chats"
                                   ? "bg-[#202227] text-white"
                                   : ""
                         }`}
                         onClick={() => {
                              setchatType("chats");
                              setRoomId("");
                         }}
                    >
                         messages
                    </button>
                    <button
                         className={`px-2 py-1 w-[48%] ${
                              chatType == "group" && !darkmode
                                   ? " bg-white"
                                   : ""
                         } rounded-md capitalize ${
                              darkmode && chatType == "group"
                                   ? "bg-[#202227] text-white"
                                   : ""
                         }`}
                         onClick={() => {
                              setchatType("group");
                              setRoomId("");
                         }}
                    >
                         groups
                    </button>
               </aside>
               <aside className="  ">
                    <Users chatType={chatType} />
               </aside>
          </div>
     );
};

export default SwitchChat;
