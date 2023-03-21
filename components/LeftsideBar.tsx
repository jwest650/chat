import React, { useState } from "react";
import useUser from "../store/userStore";
import SearchComp from "./SearchComp";
import Users from "./Users";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const LeftsideBar = ({ socket }) => {
     const [changeLink, setchangeLink] = useState(true);
     const [show, setshow] = useState(false);
     const [value, setvalue] = useState("");
     const [user, darkmode, onlineUsers] = useUser((state) => [
          state.user,
          state.darkmode,
          state.onlineUsers,
     ]);
     const handleAddFriend = async (event) => {
          if (event.key == "Enter") {
               const roomID = uuidv4().toString().substring(0, 4);
               let result = {
                    host: user.name,
                    friend: value,
                    roomID,
               };

               try {
                    if (value && value !== user.name) {
                         await axios.post(
                              "http://localhost:5000/chats",
                              result
                         );
                    }
                    setvalue("");
               } catch (error) {
                    toast(`${error.response.data.err}`, {
                         position: "top-right",
                         autoClose: 3000,
                         hideProgressBar: false,
                         closeOnClick: true,
                         pauseOnHover: true,
                         draggable: true,
                         progress: undefined,
                         theme: "light",
                    });
               }
          }
     };

     return (
          <div
               className={`w-[20%]  h-screen   space-y-4 relative left  py-2  ${
                    darkmode
                         ? "bg-[#202227] text-white"
                         : "  text-gray-700 bg-[#FAFAFE]"
               } `}
          >
               {" "}
               <ToastContainer />
               <aside
                    className={` ${
                         darkmode ? "bg-[#202227]" : "border-b"
                    }  pb-3 px-2 space-y-3`}
               >
                    <div
                         className={`border rounded-sm ${
                              show ? "block" : "hidden"
                         } `}
                    >
                         <input
                              onChange={(e) => setvalue(e.target.value)}
                              type="email"
                              className={`w-full p-2 ${
                                   darkmode ? "bg-gray-600 text-white" : ""
                              } `}
                              placeholder="Enter name"
                              value={value}
                              onKeyDown={handleAddFriend}
                         />
                    </div>

                    <SearchComp show={show} darkmode={darkmode} />
                    <div className="flex justify-between">
                         <h1 className=" font-bold text-sm">Online now</h1>
                         <small className="bg-white text-center  px-[7px]  rounded-full text-[#1557FF] w-fit font-bold py-[2px]">
                              {onlineUsers.length}
                         </small>
                    </div>
               </aside>
               <aside
                    className={` ${
                         darkmode
                              ? "bg-gray-700 text-white"
                              : " bg-slate-100  text-gray-600"
                    }  flex justify-between  p-1 rounded-md mx-2  `}
               >
                    <button
                         className={`px-2 py-1 w-[48%]  ${
                              changeLink && !darkmode ? " bg-white" : ""
                         } rounded-md capitalize ${
                              darkmode && changeLink
                                   ? "bg-[#202227] text-white"
                                   : ""
                         }`}
                         onClick={() => {
                              setshow(false);
                              setchangeLink(true);
                         }}
                    >
                         messages
                    </button>
                    <button
                         className={`px-2 py-1 w-[48%] ${
                              !changeLink && !darkmode ? " bg-white" : ""
                         } rounded-md capitalize ${
                              darkmode && !changeLink
                                   ? "bg-[#202227] text-white"
                                   : ""
                         }`}
                         onClick={() => {
                              setchangeLink(false);
                              setshow(true);
                         }}
                    >
                         add friends
                    </button>
               </aside>
               <aside className="h-[75%]  overflow-hidden overflow-y-scroll ">
                    <Users socket={socket} />
               </aside>
          </div>
     );
};

export default LeftsideBar;
