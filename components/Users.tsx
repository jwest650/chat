import React, { useEffect, useState } from "react";
import useUser from "../store/userStore";
import User from "./User";
import UserGroup from "./UserGroup";
import { TbMessage2Off } from "react-icons/tb";

const Users = ({ chatType }) => {
     const [users, setRoomId, roomID, user, setactive, active] = useUser(
          (state) => [
               state.users,
               state.getRoomId,
               state.roomID,
               state.user,
               state.setActive,
               state.active,
          ]
     );

     return (
          <div className=" space-y-3  ">
               <header className="">
                    <h1 className="font-bold capitalize pl-1 pt-2 text-lg">
                         {chatType}
                    </h1>
               </header>

               <div className=" cursor-pointer ">
                    {(chatType == "chats" || chatType == "group") &&
                         users?.length < 1 && (
                              <div className="flex justify-center items-center ">
                                   {" "}
                                   <TbMessage2Off className="text-4xl" />
                              </div>
                         )}

                    {users?.length > 0 &&
                         users?.map((val, i) => {
                              return (
                                   <div key={i}>
                                        {chatType == "chats" ? (
                                             <User
                                                  val={val.user}
                                                  id={val.roomID}
                                                  setRoomId={setRoomId}
                                                  active={active}
                                                  setactive={setactive}
                                             />
                                        ) : (
                                             <UserGroup
                                                  val={val}
                                                  setRoomId={setRoomId}
                                                  active={active}
                                                  setactive={setactive}
                                             />
                                        )}
                                   </div>
                              );
                         })}
               </div>
          </div>
     );
};

export default Users;
