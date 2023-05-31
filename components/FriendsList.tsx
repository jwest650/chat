import axios from "axios";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import useUser from "../store/userStore";
import useSWR from "swr";

const FriendsList = ({ val }) => {
     const [roomID] = useUser((state) => [state.roomID]);
     const [isAdded, setisAdded] = useState(false);

     const fetcher = async () => {
          const url = "http://localhost:5000/group/messages";

          //  if (!roomID) return;
          const { data } = await axios.get(`${url}/${roomID}`);

          return data;
     };
     const {
          data: res,
          error,
          isLoading,
     } = useSWR(["messages", roomID], fetcher, {
          // revalidateIfStale: false,
          // revalidateOnFocus: false,
     });

     useEffect(() => {
          if (res) {
               const data = res?.chat?.participants.indexOf(val.name);
               if (data > -1) {
                    setisAdded(true);
               }
          }
     }, [res]);

     const handleAddFriend = async () => {
          let result = {
               name: val.name,
               roomID,
          };
          try {
               if (roomID) {
                    await axios.post("http://localhost:5000/group/add", result);
                    toast(`success`, {
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
               setisAdded(true);
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
     };

     return (
          <div className="border-y px-4 py-3 ">
               <ToastContainer />
               <section className="flex items-center justify-between space-x-2 ">
                    <article className="flex items-center space-x-2">
                         <div className="relative">
                              <Image
                                   src={val?.image}
                                   width={35}
                                   height={35}
                                   className="rounded-full"
                              />
                         </div>
                         <div className="w-[60%] leading-[18px] flex flex-col justify-center ">
                              <h1 className="font-semibold capitalize ">
                                   {val.name}
                              </h1>
                         </div>
                    </article>
                    <button
                         disabled={isAdded}
                         className="bg-blue-300 px-4 text-sm py-1 rounded-full disabled:bg-white"
                         onClick={handleAddFriend}
                    >
                         {isAdded ? "Added" : "Add"}
                    </button>
               </section>
          </div>
     );
};

export default FriendsList;
