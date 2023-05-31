import React, { useState, useRef, useLayoutEffect, useEffect } from "react";
import { createPortal } from "react-dom";
import useUser from "../../store/userStore";
import { ToastContainer, toast } from "react-toastify";
import { gsap } from "gsap";
import usegetFriends from "../hooks/getFriends";
import FriendsList from "../FriendsList";
const AddToGroup = ({ setshowList, getData }) => {
     const box = useRef();
     const [user, darkmode] = useUser((state) => [state.user, state.darkmode]);
     const { data, error, isLoading } = usegetFriends(user);
     useLayoutEffect(() => {
          gsap.to(box.current, {
               y: 10,
               duration: 1,
               ease: "elastic",
          });
     }, []);
     console.log(getData);

     return createPortal(
          <>
               {" "}
               <ToastContainer />
               <div
                    className="absolute mt-1 rounded shadow top-0 w-[25%] h-fit bg-[#edede9] left-[50%] translate-[-50%] space-y-4   justify-between z-50 flex flex-col py-2"
                    ref={box}
               >
                    <h1 className="font-bold mb-3 text-xl px-2">Add Friends</h1>

                    <section className="flex-col justify-between flex h-full ">
                         {data?.map((val, i) => (
                              <FriendsList key={i} val={val.user} />
                         ))}
                    </section>
                    <button
                         className="w-fit py-2 self-end rounded bg-[#555555] px-3 text-white mr-2"
                         onClick={() => setshowList(false)}
                    >
                         Close
                    </button>
               </div>
          </>,
          document.body
     );
};

export default AddToGroup;
