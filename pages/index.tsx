import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import ChatContainer from "../components/ChatContainer";
import LeftsideBar from "../components/LeftsideBar";
import Rightsidebar from "../components/Rightsidebar";
import useUser from "../store/userStore";
import { io } from "socket.io-client";
import LeftNav from "../components/LeftNav";
import { HydrationProvider, Server, Client } from "react-hydration-provider";
import Head from "next/head";
import AddFriendModal from "../components/utils/AddFriendModal";
import CreateGroupModal from "../components/utils/CreateGroupModal";
import GroupRightBar from "../components/GroupRightBar";

let url = "https://chattyserver-4731.onrender.com/";

let socket = io(url);
const Home: NextPage = () => {
     const [
          user,
          roomID,
          users,
          darkmode,
          setOnlineUsers,
          onlineUsers,
          modalState,
          chatType,
     ] = useUser((state) => [
          state.user,
          state.roomID,
          state.users,
          state.darkmode,
          state.addOnlineUsers,
          state.onlineUsers,
          state.modalState,
          state.chatType,
     ]);
     const [lastSeen, setlastSeen] = useState([]);
     const [active, setactive] = useState("");
     const router = useRouter();
     useEffect(() => {
          if (user) {
               router.push("/");
          } else {
               socket.emit("offline", roomID);
               router.push("/login");
          }
     }, [user]);

     useEffect(() => {
          socket.emit("online", { user: user?.name });
     }, []);
     useEffect(() => {
          roomID && socket.emit("join", roomID);
     }, [roomID]);
     useEffect(() => {
          socket.on("active", (data) => {
               const res = data.filter((val) => val !== user.name);

               setOnlineUsers(res);
          });

          socket.on("offline", (data) => {
               const offline = onlineUsers.filter((val) => val != data.user);
               setOnlineUsers(offline);
               setlastSeen((prev) => [data]);
          });
     }, [socket]);

     return (
          <HydrationProvider>
               <Client>
                    <div className="text-xs">
                         <Head>
                              <title>chatty</title>
                         </Head>
                         <main
                              className={`flex h-screen w-full ${
                                   darkmode ? "bg-[#151A1B] text-white" : " "
                              }`}
                         >
                              <LeftNav active={active} setactive={setactive} />
                              <LeftsideBar
                                   socket={socket}
                                   onlineUsers={onlineUsers}
                                   active={active}
                              />
                              {roomID ? (
                                   <>
                                        {" "}
                                        <ChatContainer socket={socket} />
                                        {chatType == "chats" ? (
                                             <Rightsidebar
                                                  socket={socket}
                                                  lastSeen={lastSeen}
                                             />
                                        ) : (
                                             <GroupRightBar />
                                        )}
                                   </>
                              ) : (
                                   <div className="text-2xl flex-1 flex justify-center items-center capitalize font-bold">
                                        <p>select a friend / group to chat</p>
                                   </div>
                              )}
                         </main>
                    </div>
               </Client>
          </HydrationProvider>
     );
};

export default Home;
