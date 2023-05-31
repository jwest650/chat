import axios from "axios";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import useSWR from "swr";
import useFilter from "./utils/Filter";
import useUser from "../store/userStore";

const Participant = ({ val, key }) => {
     const [messages] = useUser((state) => [state.data]);
     const [user, setuser] = useState(null);

     const { data: res } = useSWR([val], async () => {
          const { data } = await axios.get(`http://localhost:5000/user/${val}`);
          return data;
     });
     const sent = useFilter(messages, val);
     useEffect(() => {
          if (res) {
               setuser(res.user);
          }
     }, [res]);

     return (
          <article key={key} className="flex justify-between items-center">
               <aside className="flex items-center space-x-2">
                    <div className="">
                         <Image
                              src={user?.image}
                              width={35}
                              height={35}
                              className="rounded-full"
                         />
                    </div>

                    <span className="text-lg">{user?.name}</span>
               </aside>

               <div className="rounded border border-blue-100 p-1 px-2">
                    <span>{sent?.length}</span>
               </div>
          </article>
     );
};

export default Participant;
