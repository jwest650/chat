import React, { useState, useRef, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import useUser from "../../store/userStore";
import { ToastContainer, toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { gsap } from "gsap";
import { SlCloudUpload } from "react-icons/sl";
import { getImageUrl } from "./getImageUrl";
import Image from "next/image";
import { instance } from "./axiosInstance";
const CreateGroupModal = ({ setsent }) => {
     const box = useRef();
     const [title, settitle] = useState("");
     const [image, setimage] = useState({ src: "", files: "" });
     const [user, darkmode, showModal] = useUser((state) => [
          state.user,
          state.darkmode,
          state.showModal,
     ]);

     const handleCreateGroup = async () => {
          const roomID = uuidv4().toString().substring(0, 4);
          const url = await getImageUrl(image);

          try {
               let result = {
                    name: user.name,
                    title,
                    roomID,
                    image: url,
                    createdBy: user.name,
               };

               if (title && url) {
                    await instance.post("/group", result);
               }
               settitle("");
               setsent(true);
          } catch (error) {
               toast(`${error.message}`, {
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
          setimage({
               src: "",
               files: "",
          });
     };

     useLayoutEffect(() => {
          gsap.to(box.current, {
               y: 10,
               duration: 1,
               ease: "elastic",
          });
     }, []);

     return createPortal(
          <div
               className="absolute mt-1 rounded shadow top-0 w-[25%] h-fit bg-[#edede9] left-[50%] p-4 z-50 "
               ref={box}
          >
               <ToastContainer />
               <section className="flex-col justify-between space-y-5 flex h-full">
                    <label htmlFor="upload">
                         <div className="border-2 border-blue-500 rounded-full w-[50px] h-[50px] mx-auto flex justify-center items-center relative">
                              {!image.src.length ? (
                                   <SlCloudUpload color="blue" />
                              ) : (
                                   <Image
                                        src={image?.src}
                                        fill
                                        objectFit="cover"
                                        className="rounded-full"
                                   />
                              )}
                              <input
                                   type="file"
                                   name=""
                                   id="upload"
                                   className="w-0 h-0"
                                   onChange={(e) =>
                                        setimage({
                                             src: URL.createObjectURL(
                                                  e.target.files[0]
                                             ),
                                             files: e.target.files[0],
                                        })
                                   }
                              />
                         </div>
                    </label>

                    <input
                         onChange={(e) => settitle(e.target.value)}
                         type="email"
                         className={`w-full p-1 rounded outline-none ${
                              darkmode ? "bg-gray-600 text-white" : ""
                         } `}
                         placeholder="Enter Group Name"
                         value={title}
                         //  onKeyDown={}
                    />

                    <div className="text-right space-x-3 text-white ">
                         <button
                              className="  rounded bg-[#555555] px-3 "
                              onClick={handleCreateGroup}
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
          </div>,
          document.body
     );
};

export default CreateGroupModal;
