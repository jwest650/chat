import Image from "next/image";
import React, { useEffect, useState } from "react";
import { IoCall, IoVideocam } from "react-icons/io5";
import useUser from "../store/userStore";
import { MdOutlineMoreVert } from "react-icons/md";
import AddToGroup from "./utils/AddToGroup";

const GroupHeader = () => {
     const [users, roomID, darkmode, onlineUsers] = useUser((state) => [
          state.users,
          state.roomID,
          state.darkmode,
          state.onlineUsers,
     ]);
     const [group, setgroup] = useState("");
     const [more, setMore] = useState(false);
     const [showList, setshowList] = useState(false);
     function getPic() {
          let res = users?.find((val) => {
               return val.roomId == roomID;
          });
          return res;
     }

     useEffect(() => {
          if (roomID && users) {
               setgroup(getPic());
          }
     }, [roomID]);

     useEffect(() => {
          if (more) {
               setMore(false);
          }
     }, [showList]);

     return (
          <div
               className={`sticky top-0 z-50 p-4 flex justify-between items-center  ${
                    darkmode
                         ? "bg-[#202227] text-white"
                         : "border-b bg-[#FDFFFC]  text-[#555555]"
               }`}
          >
               <button className="flex space-x-2 items-center text-left ">
                    <Image
                         src={group?.image}
                         width={35}
                         height={35}
                         className="rounded-full"
                    />
                    <div className="mt-1 ">
                         <p className="capitalize font-bold ">{group?.title}</p>

                         <small className="capitalize   font-bold">info</small>
                    </div>
               </button>

               <aside className="flex flex-col justify-between items-center">
                    <aside className="relative">
                         <MdOutlineMoreVert
                              className="text-xl"
                              onClick={() => setMore(!more)}
                         />
                         {more && (
                              <article className="bg-white w-[100px] h-fit  absolute z-50 -right-[8px]   border font-bold capitalize cursor-pointer">
                                   <p
                                        className="hover:bg-sky-200  p-1"
                                        onClick={() => setshowList(true)}
                                   >
                                        add friend
                                   </p>
                                   <p className="hover:bg-sky-200 p-1">
                                        change name
                                   </p>
                              </article>
                         )}
                    </aside>

                    {showList && <AddToGroup setshowList={setshowList} />}
               </aside>
          </div>
     );
};

export default GroupHeader;
