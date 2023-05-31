import React, { useState, useRef, useLayoutEffect, useEffect } from "react";
import { createPortal } from "react-dom";
import useUser from "../../store/userStore";
import { ToastContainer, toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { gsap } from "gsap";

const AddFriendModal = ({ setsent }) => {
     const box = useRef();
     const [value, setvalue] = useState("");

     const [user, darkmode, showModal, modalState] = useUser((state) => [
          state.user,
          state.darkmode,
          state.showModal,
          state.modalState,
     ]);

     const handleAddFriend = async () => {
          const roomID = uuidv4().toString().substring(0, 4);
          let result = {
               host: user.name,
               friend: value,
               roomID,
          };
          if (value && value == user.name) {
               return toast(`not allowed`, {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    theme: "light",
               });
          }

          try {
               await axios.post("http://localhost:5000/chats", result);

               setvalue("");
               setsent(true);
          } catch (error) {
               toast(`${error.response.data.message}`, {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    theme: "light",
               });
          }
     };

     useLayoutEffect(() => {
          gsap.to(box.current, {
               y: 10,
               duration: 1,
               ease: "elastic",
          });
     }, [modalState]);

     return createPortal(
          <>
               {" "}
               <ToastContainer />
               <div
                    className="absolute mt-1 rounded shadow top-0 w-[25%] h-[18%] bg-[#edede9] left-[50%] right-[50%] p-4 translate-[-50%] z-50 "
                    ref={box}
               >
                    <section className="flex-col justify-between flex h-full">
                         <input
                              onChange={(e) => setvalue(e.target.value)}
                              type="email"
                              className={`w-full p-1 rounded outline-none ${
                                   darkmode ? "bg-gray-600 text-white" : ""
                              } `}
                              placeholder="Enter name"
                              value={value}
                              //  onKeyDown={handleAddFriend}
                         />

                         <div className="text-right space-x-3 text-white mt-3">
                              <button
                                   className="  rounded bg-[#555555] px-3 "
                                   onClick={handleAddFriend}
                              >
                                   Add
                              </button>
                              <button
                                   className="  rounded bg-[#555555] px-3 "
                                   onClick={() => showModal("")}
                              >
                                   Cancel
                              </button>
                         </div>
                    </section>
               </div>
          </>,
          document.body
     );
};

export default AddFriendModal;
