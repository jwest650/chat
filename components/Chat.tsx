import { useState, useEffect } from "react";
import moment from "moment";
import Image from "next/image";
import React from "react";
import useUser from "../store/userStore";
import dynamic from "next/dynamic";
import { BiCheckDouble } from "react-icons/bi";
import { IoIosArrowDown } from "react-icons/io";
import { instance } from "./utils/axiosInstance";
import { Comfortaa } from "next/font/google";
import { RxDotsVertical } from "react-icons/rx";
const inter = Comfortaa({ subsets: ["latin"] });
const Chat = ({ data, lastElref, socket }) => {
     const Wave = dynamic(() => import("./utils/Waveform"), { ssr: false });

     const [user, roomID, setMesg, msg, darkmode] = useUser((state) => [
          state.user,
          state.roomID,
          state.setMesg,
          state.selectedMsg,
          state.darkmode,
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
          <div className={inter.className}>
               <section
                    className={`flex ${
                         user?.name == data.name ? "flex-row-reverse " : ""
                    }   relative`}
               >
                    <aside className="text-center ">
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
                              <span className="">
                                   <small>
                                        {" "}
                                        {moment(data?.createdAt).format("LT")}
                                   </small>
                              </span>
                         </div>

                         <div className="flex items-start">
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
                              {show && !data?.replyMessage ? (
                                   <div
                                        className={`${
                                             user?.name == data.name
                                                  ? "bg-[#2d3436] text-bold rounded-tl-xl rounded-b-xl text-white"
                                                  : `border-2  rounded-tr-xl  rounded-b-xl ${
                                                         darkmode
                                                              ? "text-white "
                                                              : "text-black "
                                                    }  `
                                        } py-2 max-w-[500px] w-fit px-4  mt-1 `}
                                   >
                                        {data?.message}
                                   </div>
                              ) : (
                                   show &&
                                   data?.replyMessage && (
                                        <div
                                             className={`${
                                                  user?.name == data.name
                                                       ? "bg-[#2d3436] text-bold rounded-tl-xl rounded-b-xl text-white"
                                                       : "border-2 text-black rounded-tr-xl  rounded-b-xl "
                                             }  max-w-[500px] w-fit  py-[2px] px-[2px]  mt-1 `}
                                        >
                                             <div
                                                  className={`border-l-4 border-teal-500 p-2 bg-[#ffff] text-black  px-4 ${
                                                       user?.name == data.name
                                                            ? " rounded-tl-xl rounded-b-lg "
                                                            : " rounded-tr-xl  rounded-b-lg "
                                                  } `}
                                             >
                                                  <span>
                                                       {data?.replyMessage &&
                                                            data?.replyMessage}
                                                  </span>
                                             </div>
                                             <p className="px-2 py-1">
                                                  {" "}
                                                  {data?.message}
                                             </p>
                                        </div>
                                   )
                              )}

                              <button
                                   className={`relative
                                         p-1 pt-2 `}
                                   onClick={() =>
                                        settoggleMsgList(!toggleMsgList)
                                   }
                              >
                                   <RxDotsVertical className="text-md" />
                                   {toggleMsgList && (
                                        <aside className="bg-white absolute left-1 rounded w-[80px]  capitalize  shadow-lg cursor-pointer z-50 mb-5 ">
                                             {option.map((val, i) => (
                                                  <p
                                                       key={i}
                                                       onClick={() =>
                                                            handleAction(val)
                                                       }
                                                       className="hover:bg-blue-100 p-1 py-2 border-b"
                                                  >
                                                       {val}
                                                  </p>
                                             ))}
                                        </aside>
                                   )}
                              </button>

                              <aside className="self-end">
                                   {data.seen && user.name == data.name ? (
                                        <BiCheckDouble
                                             className={`ml-auto text-green-700 text-sm`}
                                        />
                                   ) : mark == "true" &&
                                     user.name == data.name ? (
                                        <BiCheckDouble
                                             className={`ml-auto text-green-700 text-sm`}
                                        />
                                   ) : (
                                        ""
                                   )}
                              </aside>
                         </div>
                    </aside>

                    <div ref={lastElref} />
               </section>
          </div>
     );
};

export default Chat;

const option = ["reply", "react", "delete"];
