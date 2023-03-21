import React, { useEffect, useState } from "react";
import { HiOutlineEmojiHappy } from "react-icons/hi";
import { BsMicFill } from "react-icons/bs";
import useUser from "../store/userStore";
import { AiFillPicture, AiOutlineLink } from "react-icons/ai";
import { MdAudiotrack } from "react-icons/md";
import { motion } from "framer-motion";
import { CgFileDocument } from "react-icons/cg";
import { IoPaperPlane } from "react-icons/io5";
import axios from "axios";
import { decode as base64_decode, encode as base64_encode } from "base-64";
import { BiConfused } from "react-icons/bi";
const Message = ({ socket, setinput, input, settoggleEmoji, toggleEmoji }) => {
     const [user, roomID, darkmode] = useUser((state) => [
          state.user,
          state.roomID,
          state.darkmode,
     ]);

     const [toggleADD, settoggleADD] = useState(false);
     const [sendpicture, setsendpicture] = useState({ files: "" });
     const [attachPic, setattachPic] = useState([]);
     const [audio, setaudio] = useState({ files: "" });

     const upload = async (setFile) => {
          try {
               for await (let val of sendpicture.files) {
                    const form_Data = new FormData();
                    form_Data.append("file", val);
                    form_Data.append("upload_preset", "jaywest");
                    const {
                         data: { secure_url: image_url },
                    } = await axios.post(
                         "https://api.cloudinary.com/v1_1/di97m2vqq/upload",
                         form_Data
                    );
                    setFile((prev) => [...prev, image_url]);
               }
          } catch (error) {
               console.log(error);
          }
     };
     const Submit = async (e) => {
          e.preventDefault();

          if (input && roomID) {
               socket.emit("message", {
                    name: user.name,
                    message: input,
                    room: roomID,
                    image: user.image,
                    attachPic,
               });

               setinput("");
               setattachPic([]);
          }
     };

     useEffect(() => {
          socket.emit("typing", roomID, user.name);
     }, [input]);

     useEffect(() => {
          if (sendpicture.files) {
               upload(setattachPic);
          }
     }, [sendpicture]);
     useEffect(() => {
          if (attachPic.length) {
               socket.emit("message", {
                    name: user.name,
                    message: "sent image",
                    room: roomID,
                    image: user.image,
                    attachPic,
               });
               setattachPic([]);
          }
     }, [attachPic]);

     useEffect(() => {
          if (audio.files) {
               const reader = new FileReader();
               reader.readAsDataURL(audio.files[0]);
               reader.onload = () => {
                    console.log(reader.result);
                    socket.emit("message", {
                         name: user.name,
                         message: "sent audio",
                         room: roomID,
                         image: user.image,
                         attachPic,

                         audio: reader.result,
                    });
               };
               reader.onerror = (error) => {
                    console.log(error);
               };

               setaudio({ files: "" });
               // upload(setaudio);
          }
     }, [audio]);

     return (
          <div className="">
               <form
                    className={`flex   space-x-4 py-3 px-5 justify-between ${
                         darkmode ? "bg-[#202227]" : " rounded-lg"
                    }`}
                    onSubmit={Submit}
               >
                    <button className=" flex space-x-3 text-gray-400 text-lg items-center relative">
                         <BiConfused
                              onClick={() => settoggleEmoji(!toggleEmoji)}
                         />
                         <aside>
                              <AiOutlineLink
                                   onClick={() => settoggleADD(!toggleADD)}
                              />
                              {toggleADD && (
                                   <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{
                                             opacity: 1,
                                        }}
                                        transition={{ duration: 0.6 }}
                                        exit={{ y: -5 }}
                                        className="absolute -top-32 space-y-2 "
                                   >
                                        <div className="bg-[#1557FF] rounded-full text-white  w-[28px] h-[28px] flex justify-center items-center cursor-pointer">
                                             <label htmlFor="">
                                                  <CgFileDocument className=" " />
                                             </label>
                                        </div>
                                        <div className="bg-[#1557FF] rounded-full text-white  w-[28px] h-[28px] flex justify-center items-center cursor-pointer">
                                             <label htmlFor="pic">
                                                  <AiFillPicture className=" " />
                                             </label>
                                             <input
                                                  multiple
                                                  type="file"
                                                  name=""
                                                  id="pic"
                                                  className="w-0 h-0"
                                                  onChange={(e) => {
                                                       setsendpicture({
                                                            files: e.target
                                                                 .files,
                                                       });
                                                  }}
                                             />
                                        </div>
                                        <div className="bg-[#1557FF] rounded-full text-white  w-[28px] h-[28px] flex justify-center items-center cursor-pointer">
                                             <label htmlFor="audio">
                                                  <MdAudiotrack className="" />
                                             </label>
                                             <input
                                                  type="file"
                                                  accept="audio/*"
                                                  id="audio"
                                                  className="w-0 h-0"
                                                  onChange={(e) => {
                                                       setaudio({
                                                            files: e.target
                                                                 .files,
                                                       });
                                                  }}
                                             />
                                        </div>
                                   </motion.div>
                              )}
                         </aside>
                         <BsMicFill />
                    </button>
                    <input
                         type="text"
                         value={input}
                         className="w-[80%] outline-none bg-transparent"
                         placeholder="Your message"
                         onChange={(e) => setinput(e.target.value)}
                    />

                    <button type="submit" onClick={Submit}>
                         <IoPaperPlane
                              color="#1557FF"
                              className="text-[18px]"
                         />
                    </button>
               </form>
          </div>
     );
};

export default Message;
// function showUploadWidget() {
//      Cloudinary.openUploadWidget(
//           {
//                cloudName: "<cloud name>",
//                uploadPreset: "<upload preset>",
//                sources: [
//                     "local",
//                     "url",
//                     "camera",
//                     "image_search",
//                     "google_drive",
//                     "facebook",
//                     "dropbox",
//                     "instagram",
//                     "shutterstock",
//                     "getty",
//                     "istock",
//                     "unsplash",
//                ],
//                googleApiKey: "<image_search_google_api_key>",
//                showAdvancedOptions: true,
//                cropping: true,
//                multiple: false,
//                defaultSource: "local",
//                styles: {
//                     palette: {
//                          window: "#FFFFFF",
//                          windowBorder: "#90A0B3",
//                          tabIcon: "#0078FF",
//                          menuIcons: "#5A616A",
//                          textDark: "#000000",
//                          textLight: "#FFFFFF",
//                          link: "#0078FF",
//                          action: "#FF620C",
//                          inactiveTabIcon: "#0E2F5A",
//                          error: "#F44235",
//                          inProgress: "#0078FF",
//                          complete: "#20B832",
//                          sourceBg: "#E4EBF1",
//                     },
//                     fonts: { default: { active: true } },
//                },
//           },
//           (err, info) => {
//                if (!err) {
//                     console.log("Upload Widget event - ", info);
//                }
//           }
//      );
// }
