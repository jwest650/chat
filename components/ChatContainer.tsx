import React, { useEffect, useRef, useState } from "react";
import useUser from "../store/userStore";
import Chat from "./Chat";
import ChatHeader from "./ChatHeader";
import Message from "./Message";
import useSWR from "swr";
import axios from "axios";
import EmojiPicker from "emoji-picker-react";
import { IoIosClose } from "react-icons/io";
import GroupHeader from "./GroupHeader";
import { HashLoader } from "react-spinners";
const ChatContainer = ({ socket, onlineUsers }) => {
     const [
          message,
          addmessage,
          setmessage,
          roomID,
          user,
          darkmode,
          chatType,
          active,
          selectedMsg,
          setMesg,
     ] = useUser((state) => [
          state.data,
          state.addMessages,
          state.getMessages,
          state.roomID,
          state.user,
          state.darkmode,
          state.chatType,
          state.active,
          state.selectedMsg,
          state.setMesg,
     ]);
     const [input, setinput] = useState("");
     const [toggleEmoji, settoggleEmoji] = useState(false);
     const lastElref = useRef(null);

     const fetcher = async () => {
          const url =
               chatType !== "chats"
                    ? "http://localhost:5000/group/messages"
                    : "http://localhost:5000/messages";
          if (!roomID) return;
          const { data } = await axios.get(`${url}/${roomID}`);

          return data;
     };
     const {
          data: res,
          error,
          isLoading,
     } = useSWR(["messages", roomID, chatType], fetcher, {
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
     }, [res, roomID]);

     useEffect(() => {
          socket.on("message", (data) => {
               addmessage(data);
               if (data.name !== user.name) {
                    let audio = new Audio("/sound/sound1.mp3");
                    audio.play();
               }
          });

          return () => {
               socket.removeListener("message");
          };
     }, []);
     useEffect(() => {
          lastElref.current?.scrollIntoView({ behavior: "smooth" });
     }, [message]);

     return (
          <div
               className={`relative  flex-1 ${
                    darkmode ? "bg-[#151A1B] " : "border-r bg-[#FDFFFC] "
               }  h-screen overflow-hidden    space-y-2 `}
          >
               {chatType == "chats" ? (
                    <ChatHeader
                         profile={res?.chat?.friend}
                         socket={socket}
                         onlineUsers={onlineUsers}
                    />
               ) : (
                    <GroupHeader />
               )}
               <main className="flex flex-col justify-between h-[85%]">
                    <section className=" px-8  space-y-7 h-full  overflow-y-scroll  ">
                         {isLoading ? (
                              <div className=" absolute top-[50%] left-[50%] translate-[-50%]">
                                   <HashLoader
                                        loading={isLoading}
                                        size={30}
                                        aria-label="Loading Spinner"
                                        data-testid="loader"
                                   />
                              </div>
                         ) : (
                              <>
                                   {message?.map((data, i) => (
                                        <Chat
                                             key={i}
                                             data={data}
                                             lastElref={lastElref}
                                             socket={socket}
                                        />
                                   ))}
                              </>
                         )}
                    </section>

                    <section className="">
                         {selectedMsg && (
                              <div className="bg-slate-100 p-4 relative">
                                   <IoIosClose
                                        className="absolute right-0 top-0 text-xl  cursor-pointer "
                                        onClick={() => setMesg(null)}
                                   />
                                   <p className="border-l-4 border-blue-500 p-2 bg-gray-300 rounded">
                                        {selectedMsg.message}
                                   </p>
                              </div>
                         )}
                         <div
                              className={` rounded-full  mx-8 my-1 shadow-md border  `}
                         >
                              <Message
                                   socket={socket}
                                   input={input}
                                   setinput={setinput}
                                   toggleEmoji={toggleEmoji}
                                   settoggleEmoji={settoggleEmoji}
                              />
                         </div>
                         {toggleEmoji && (
                              <div className=" h-[200px] overflow-hidden   ">
                                   <EmojiPicker
                                        onEmojiClick={addEmoji}
                                        searchDisabled={true}
                                        width={"100%"}
                                   />
                              </div>
                         )}
                    </section>
               </main>
          </div>
     );
};

export default ChatContainer;
