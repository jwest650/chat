import React, { useEffect, useRef, useState } from "react";
import useUser from "../store/userStore";
import Chat from "./Chat";
import ChatHeader from "./ChatHeader";
import Message from "./Message";
import useSWR from "swr";
import axios from "axios";
import EmojiPicker from "emoji-picker-react";

import { motion, AnimatePresence } from "framer-motion";
const ChatContainer = ({ socket, onlineUsers }) => {
     const [message, addmessage, setmessage, roomID, user, darkmode] = useUser(
          (state) => [
               state.data,

               state.addMessages,
               state.getMessages,
               state.roomID,
               state.user,
               state.darkmode,
          ]
     );
     const [input, setinput] = useState("");
     const [toggleEmoji, settoggleEmoji] = useState(false);

     const [typing, settyping] = useState("");
     const [sent, setsent] = useState("");
     const lastElref = useRef(null);
     const fetcher = async () => {
          const { data } = await axios.get(
               `http://localhost:5000/messages/${roomID}`
          );
          return data;
     };
     const {
          data: res,
          error,
          isLoading,
     } = useSWR(["messages", roomID], fetcher, {
          revalidateIfStale: false,
          revalidateOnFocus: false,
     });

     const addEmoji = (e) => {
          setinput((prev) => prev + e.emoji);
     };

     useEffect(() => {
          if (res) {
               let data = res?.chat.messages;
               setmessage(data);
          }
     }, [res]);

     useEffect(() => {
          socket.on("message", (data) => {
               addmessage(data);
               let audio = new Audio("/sound/sound1.mp3");
               audio.play();
          });
          socket.on("sent", (data) => {
               setsent(data);
          });
          return () => {
               socket.removeListener("message");
          };
     }, []);
     useEffect(() => {
          lastElref.current?.scrollIntoView({ behavior: "smooth" });
     }, [message]);
     useEffect(() => {
          socket.on("writing", (data) => {
               settyping(data);
               setTimeout(() => {
                    settyping("");
               }, 2000);
          });
     }, []);

     return (
          <div
               className={`flex-1 ${
                    darkmode ? "px-[2px] " : "border-r"
               }  h-screen   flex flex-col justify-between `}
          >
               <ChatHeader
                    typing={typing}
                    profile={res?.chat?.friend}
                    socket={socket}
                    onlineUsers={onlineUsers}
               />
               <section className=" px-8 p-3 space-y-7  overflow-hidden overflow-y-scroll h-[80%] relative">
                    {isLoading ? (
                         <span className="loader absolute top-[50%] left-[50%] translate-[-50%]"></span>
                    ) : (
                         <>
                              {message?.map((data, i) => (
                                   <Chat
                                        key={i}
                                        data={data}
                                        lastElref={lastElref}
                                        sent={sent}
                                   />
                              ))}
                         </>
                    )}
               </section>

               <div
                    className={`  rounded-full mx-8 my-5 shadow ${
                         darkmode ? "" : ""
                    }`}
               >
                    <Message
                         socket={socket}
                         input={input}
                         setinput={setinput}
                         toggleEmoji={toggleEmoji}
                         settoggleEmoji={settoggleEmoji}
                    />
               </div>
               {toggleEmoji ? (
                    <AnimatePresence>
                         <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 2 }}
                              className=" h-[300px]  overflow-hidden overflow-y-auto pb-1 "
                         >
                              <EmojiPicker
                                   onEmojiClick={addEmoji}
                                   searchDisabled={true}
                                   width={"100%"}
                              />
                         </motion.div>
                    </AnimatePresence>
               ) : (
                    ""
               )}
          </div>
     );
};

export default ChatContainer;
