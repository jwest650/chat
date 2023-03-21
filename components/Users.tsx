import React, { useEffect, useState } from "react";
import useUser from "../store/userStore";
import User from "./User";

const Users = ({ socket }) => {
     const [users, setRoomId, roomID, user] = useUser((state) => [
          state.users,
          state.getRoomId,
          state.roomID,
          state.user,
     ]);
     const [active, setactive] = useState("");
     const [count, setcount] = useState(0);

     useEffect(() => {
          socket.on("count", (data) => {
               if (data.room == roomID && data.name !== user.name) {
               }

               setcount((prev) => prev + 1);
          });

          // return function cleanup() {
          //      socket.removeListener("message");
          // };
     }, [socket]);

     return (
          <div className=" space-y-3">
               <header>
                    <h1 className="font-bold capitalize pl-2">chat</h1>
               </header>

               <div className="space-y-3 cursor-pointer ">
                    {users?.map((val, i) => {
                         return (
                              <div key={i}>
                                   <User
                                        val={val.user}
                                        id={val.roomID}
                                        setRoomId={setRoomId}
                                        active={active}
                                        setactive={setactive}
                                        count={count}
                                   />
                              </div>
                         );
                    })}
               </div>
          </div>
     );
};

export default Users;
