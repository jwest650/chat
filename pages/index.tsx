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

let socket = io("http://localhost:5000");
const Home: NextPage = () => {
     const [user, roomID, users, darkmode, setOnlineUsers, onlineUsers] =
          useUser((state) => [
               state.user,
               state.roomID,
               state.users,
               state.darkmode,
               state.addOnlineUsers,
               state.onlineUsers,
          ]);
     const [lastSeen, setlastSeen] = useState([]);
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
          if (users) {
               const friends = users?.map((val) =>
                    val.user.name ? val.user.name : ""
               );
               socket.emit("online", { friends, user: user?.name });
          }
     }, [users]);
     useEffect(() => {
          roomID && socket.emit("join", roomID);
     }, [roomID]);
     useEffect(() => {
          socket.on("active", (data) => {
               setOnlineUsers(data);
          });

          () => {
               socket.on("offline", (data) => {
                    const offline = onlineUsers.filter(
                         (val) => val != data.user
                    );
                    setOnlineUsers(offline);
                    setlastSeen((prev) => [data]);
               });
          };
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
                              <LeftNav />
                              <LeftsideBar
                                   socket={socket}
                                   onlineUsers={onlineUsers}
                              />
                              {roomID ? (
                                   <>
                                        {" "}
                                        <ChatContainer socket={socket} />
                                        <Rightsidebar
                                             socket={socket}
                                             lastSeen={lastSeen}
                                        />
                                   </>
                              ) : (
                                   <div className="text-2xl flex-1 flex justify-center items-center capitalize font-bold">
                                        <p>select a friend to chat</p>
                                   </div>
                              )}
                         </main>
                    </div>
               </Client>
          </HydrationProvider>
     );
};

export default Home;
