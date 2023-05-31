import { useState, useEffect } from "react";
import moment from "moment";
import Image from "next/image";
import React from "react";
import useUser from "../store/userStore";
import dynamic from "next/dynamic";
import { BiCheckDouble } from "react-icons/bi";
import { IoIosArrowDown } from "react-icons/io";
import axios from "axios";
import { instance } from "./utils/axiosInstance";
const Chat = ({ data, lastElref, socket }) => {
     const Wave = dynamic(() => import("./utils/Waveform"), { ssr: false });

     const [user, roomID, setMesg, msg] = useUser((state) => [
          state.user,
          state.roomID,
          state.setMesg,
          state.selectedMsg,
     ]);
     const [picture, setpicture] = useState([]);
     const [mark, setmark] = useState("false");
     const [toggleMsgList, settoggleMsgList] = useState(false);
     let name = data.name !== user.name ? data.name : "";
     const updateSeen = async () => {
          if (!name) return;
          try {
               await instance.put("/messages/seen", {
                    roomID,
                    name,
               });
               socket.emit("seen", roomID);
          } catch (error) {
               console.log(error);
          }
     };
     const show =
          data.message !== "sent image" &&
          data.message !== "sent audio" &&
          data.message !== "voice record" &&
          data.message !== "sent doc"
               ? true
               : false;
     useEffect(() => {
          if (typeof data.attachPic == "string") {
               setpicture([data.attachPic]);
          } else {
               setpicture(data.attachPic);
          }
     }, []);

     useEffect(() => {
          updateSeen();
     }, []);
     useEffect(() => {
          socket.on("mark", () => {
               setmark("true");
          });
     }, []);

     const handleAction = (val) => {
          if (val == "reply") {
               setMesg(data);
          }
          settoggleMsgList(false);
     };
     return (
          <div>
               <section
                    className={`flex ${
                         user?.name == data.name ? "flex-row-reverse " : ""
                    }   relative`}
               >
                    <aside className="text-center">
                         <Image
                              src={data?.image}
                              width={40}
                              height={40}
                              className="rounded-full"
                         />
                    </aside>
                    <aside className="mx-1 group relative">
                         <div
                              className={`${
                                   user?.name == data.name ? "text-right " : ""
                              } space-x-2 capitalize  `}
                         >
                              <span className="font-bold text-md">
                                   {data.name == user.name ? "you" : data.name}
                              </span>
                              <span className="relative">
                                   <small>
                                        {" "}
                                        {moment(data?.createdAt).format("LT")}
                                   </small>
                                   <button
                                        className={`${
                                             data.name == user.name
                                                  ? "right-1 top-1"
                                                  : ""
                                        }
                                        absolute top-1  group-hover:inline hidden pt-2 `}
                                        onClick={() =>
                                             settoggleMsgList(!toggleMsgList)
                                        }
                                   >
                                        <IoIosArrowDown className="" />
                                   </button>
                              </span>
                         </div>
                         {picture.length
                              ? picture.map((val, i) => (
                                     <Image
                                          key={i}
                                          src={val}
                                          width={200}
                                          height={200}
                                          className="rounded "
                                     />
                                ))
                              : ""}
                         {data.audio ? <Wave url={data.audio} /> : ""}
                         {data.rec ? <Wave url={data.rec} /> : ""}
                         {data.doc ? (
                              <div className="">
                                   <iframe
                                        frameBorder={0}
                                        src={data?.doc}
                                        className="w-52 h-52 border-2 "
                                   ></iframe>
                              </div>
                         ) : (
                              ""
                         )}
                         {show && !data.replyMessage ? (
                              <div
                                   className={`${
                                        user?.name == data.name
                                             ? "bg-[#bcb8b1] rounded-tl-xl rounded-b-xl text-white"
                                             : "bg-[#219ebc] rounded-tr-xl  rounded-b-xl text-white"
                                   } py-2 max-w-[500px] w-fit px-4  mt-1 `}
                              >
                                   {data?.message}
                              </div>
                         ) : (
                              <div
                                   className={`${
                                        user?.name == data.name
                                             ? "bg-[#bcb8b1] rounded-tl-xl rounded-b-xl text-white"
                                             : "bg-[#219ebc] rounded-tr-xl  rounded-b-xl text-white"
                                   }  max-w-[500px] w-fit  py-[2px] px-[2px]  mt-1 `}
                              >
                                   <p
                                        className={`border-l-4 border-green-500 p-2 bg-[#f8f9fa] text-black  px-4 ${
                                             user?.name == data.name
                                                  ? " rounded-tl-xl rounded-b-lg "
                                                  : " rounded-tr-xl  rounded-b-lg "
                                        } `}
                                   >
                                        {data?.replyMessage}
                                   </p>
                                   <p className="px-2 py-1"> {data?.message}</p>
                              </div>
                         )}

                         {data.seen && user.name == data.name ? (
                              <BiCheckDouble
                                   className={`ml-auto text-green-700 text-sm`}
                              />
                         ) : mark == "true" && user.name == data.name ? (
                              <BiCheckDouble
                                   className={`ml-auto text-green-700 text-sm`}
                              />
                         ) : (
                              ""
                         )}

                         {toggleMsgList && (
                              <aside className="bg-white absolute left-14 w-[110px] w-fit capitalize space-y-2 shadow cursor-pointer z-50 ">
                                   {option.map((val, i) => (
                                        <p
                                             key={i}
                                             onClick={() => handleAction(val)}
                                             className="hover:bg-gray-100 p-1"
                                        >
                                             {val}
                                        </p>
                                   ))}
                              </aside>
                         )}
                    </aside>

                    <div ref={lastElref} />
               </section>
          </div>
     );
};

export default Chat;

const option = ["reply", "react to message", "delete message"];
