import React, { useEffect, useState } from "react";
import { HiOutlineChatAlt2 } from "react-icons/hi";
import { TbFriends, TbUserPlus } from "react-icons/tb";
import { HiOutlineUserGroup } from "react-icons/hi";
import { IoSettingsSharp } from "react-icons/io5";
import { FaSignOutAlt } from "react-icons/fa";
import Image from "next/image";
import { MdDarkMode } from "react-icons/md";
import useUser from "../store/userStore";
import useSWR from "swr";
import axios from "axios";
import { BsChatText } from "react-icons/bs";
import { RiGroupLine } from "react-icons/ri";
import usegetFriends from "./hooks/getFriends";

const LeftNav = ({ setactive, active }) => {
     const [toggle, settoggle] = useState(false);

     const [
          user,
          setGroup,
          setChat,
          signOut,
          setdarkmode,
          darkmode,
          showModal,
     ] = useUser((state) => [
          state.user,
          state.getGroup,
          state.getChat,
          state.signOut,
          state.setDarkMode,
          state.darkmode,
          state.showModal,
     ]);
     const { data, error, isLoading } = usegetFriends(user);

     useEffect(() => {
          setChat(data);
          setactive("chat");
     }, [data]);

     return (
          <div
               className={`w-[15%]  text-sm capitalize  ${
                    !darkmode ? "text-[#555555]" : "text-white"
               } `}
          >
               <section className=" h-screen flex flex-col justify-between">
                    <aside className="space-y-14 p-2">
                         <header className={`flex items-center space-x-1`}>
                              <HiOutlineChatAlt2 className="text-4xl" />

                              <h1 className="capitalize">chatty</h1>
                         </header>
                         <article className="space-y-8">
                              <button
                                   className={`${
                                        active == "chat" ? "font-bold " : ""
                                   } flex items-center space-x-3 capitalize `}
                                   onClick={() => {
                                        setactive("chat");
                                   }}
                              >
                                   <BsChatText className="text-xl" />
                                   <label>chat</label>
                              </button>
                              <button
                                   className={` flex items-center space-x-3 capitalize`}
                                   onClick={() => {
                                        showModal("create group");
                                   }}
                              >
                                   <RiGroupLine className="text-xl" />
                                   <label>create group</label>
                              </button>
                              <button
                                   className={` flex items-center space-x-3 capitalize`}
                                   onClick={() => {
                                        showModal("add friend");
                                   }}
                              >
                                   <TbUserPlus className="text-xl" />
                                   <label>add friend</label>
                              </button>
                         </article>
                    </aside>

                    <article className="space-y-3 ">
                         <div className="flex items-center space-x-2 px-2">
                              <IoSettingsSharp />
                              <label>settings</label>
                         </div>
                         <div className="flex items-center justify-between  px-2">
                              <div className="flex items-center space-x-2">
                                   <MdDarkMode />
                                   <label>dark mode</label>
                              </div>
                              <div
                                   className="rounded-full p-[2px] w-[25px]  bg-slate-500 cursor-pointer
                              "
                                   onClick={() => {
                                        settoggle(!toggle);
                                        setdarkmode(!toggle);
                                   }}
                              >
                                   <div
                                        className={`w-[10px] h-[10px] bg-white rounded-full ${
                                             toggle ? "ml-auto" : "mr-auto"
                                        } `}
                                   />
                              </div>
                         </div>
                         <footer
                              className={`${
                                   darkmode ? "" : "border-t"
                              } py-2 flex  space-x-3  items-center justify-between px-2`}
                         >
                              <div className="flex space-x-3 items-center">
                                   <Image
                                        src={user?.image}
                                        width={40}
                                        height={40}
                                        className="rounded-full"
                                   />

                                   <p>{user?.name}</p>
                              </div>
                              <button className="pr-3">
                                   <FaSignOutAlt
                                        color="gray"
                                        onClick={() => signOut()}
                                   />
                              </button>
                         </footer>
                    </article>
               </section>
          </div>
     );
};

export default LeftNav;
