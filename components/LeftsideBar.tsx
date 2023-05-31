import React, { useState } from "react";
import useUser from "../store/userStore";
import SearchComp from "./SearchComp";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SwitchChat from "./SwitchChat";
const LeftsideBar = ({ socket, active }) => {
     const [user, darkmode, onlineUsers] = useUser((state) => [
          state.user,
          state.darkmode,
          state.onlineUsers,
     ]);

     return (
          <div
               className={`w-[20%]  h-screen   space-y-4   py-2  ${
                    darkmode
                         ? "bg-[#202227] text-white"
                         : "  text-[#555555] border-x"
               } `}
          >
               {" "}
               <aside
                    className={` ${
                         darkmode ? "bg-[#202227]" : "border-b"
                    }  pb-3 px-2 space-y-3`}
               >
                    <SearchComp darkmode={darkmode} />
                    <div className="flex items-center font-bold text-sm space-x-1">
                         <h1 className=" ">Online</h1>
                         <small>({onlineUsers.length} Members)</small>
                    </div>
               </aside>
               <SwitchChat darkmode={darkmode} socket={socket} />
          </div>
     );
};

export default LeftsideBar;
