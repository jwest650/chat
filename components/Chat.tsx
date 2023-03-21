import { useState, useEffect } from "react";
import moment from "moment";
import Image from "next/image";
import React from "react";
import useUser from "../store/userStore";
import { motion } from "framer-motion";
import { decode as base64_decode, encode as base64_encode } from "base-64";

import { VscCheckAll } from "react-icons/vsc";
import Audio from "./utils/Audio";
const Chat = ({ data, lastElref, sent }) => {
     const [user] = useUser((state) => [state.user]);
     const [picture, setpicture] = useState([]);
     const show =
          data.message !== "sent image" && data.message !== "sent audio"
               ? true
               : false;
     useEffect(() => {
          if (typeof data.attachPic == "string") {
               setpicture([data.attachPic]);
          } else {
               setpicture(data.attachPic);
          }
     }, []);

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
                    <motion.aside
                         initial={{ scale: 0.4, y: 100 }}
                         animate={{ scale: 1, y: 0 }}
                         transition={{ duration: 0.3 }}
                         className="mx-1 "
                    >
                         <div
                              className={`${
                                   user?.name == data.name ? "text-right " : ""
                              } space-x-2 capitalize `}
                         >
                              <span className="">
                                   {data.name == user.name ? "you" : data.name}
                              </span>
                              <small className="">
                                   {moment(data?.createdAt).format("LT")}
                              </small>
                         </div>

                         {show ? (
                              <div
                                   className={`${
                                        user?.name == data.name
                                             ? "bg-[#1557FF] rounded-tl-2xl rounded-b-2xl text-white"
                                             : "bg-[#F5F4F7] rounded-tr-2xl  rounded-b-2xl text-gray-500"
                                   } py-2 max-w-[500px] w-fit px-4  mt-1 `}
                              >
                                   {data?.message}
                              </div>
                         ) : (
                              ""
                         )}
                         {picture.length > -1
                              ? picture.map((val, i) => (
                                     <Image
                                          key={i}
                                          src={val}
                                          width={200}
                                          height={200}
                                          className="rounded border-4 "
                                     />
                                ))
                              : ""}

                         {data.audio ? <Audio data={data.audio} /> : ""}

                         {user?.name == data.name && (
                              <div>
                                   {data?.sent == true ? (
                                        <VscCheckAll
                                             className={`ml-auto ${
                                                  data.sent
                                                       ? "text-green-700"
                                                       : ""
                                             }`}
                                        />
                                   ) : sent == "true" ? (
                                        <VscCheckAll className={`ml-auto`} />
                                   ) : (
                                        ""
                                   )}
                              </div>
                         )}
                    </motion.aside>

                    <div ref={lastElref} />
               </section>
          </div>
     );
};

export default Chat;
