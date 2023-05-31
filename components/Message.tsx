import React, { useEffect, useState } from "react";
import { BsMicFill } from "react-icons/bs";
import useUser from "../store/userStore";
import { AiFillPicture, AiOutlineLink } from "react-icons/ai";
import { MdAudiotrack } from "react-icons/md";
import { motion } from "framer-motion";
import { CgFileDocument } from "react-icons/cg";
import { IoPaperPlane } from "react-icons/io5";
import axios from "axios";
import { BiConfused } from "react-icons/bi";
import { RiDeleteBin6Line } from "react-icons/ri";
import dynamic from "next/dynamic";

const Message = ({ socket, setinput, input, settoggleEmoji, toggleEmoji }) => {
     const Wave = dynamic(() => import("./utils/Waveform"), { ssr: false });

     const [user, roomID, darkmode, replyMsg, setMesg] = useUser((state) => [
          state.user,
          state.roomID,
          state.darkmode,
          state.selectedMsg,
          state.setMesg,
     ]);

     const [toggleADD, settoggleADD] = useState(false);
     const [sendpicture, setsendpicture] = useState({ files: "" });
     const [attachPic, setattachPic] = useState([]);
     const [audio, setaudio] = useState({ files: "" });
     const [doc, setdoc] = useState({ files: "" });
     const [audiourl, setaudiourl] = useState(null);
     const [recording, setrecording] = useState(false);
     const [mediaRecorder, setMediaRecorder] = useState(null);
     const [Stream, setStream] = useState(null);

     const startRec = async () => {
          try {
               const stream = await navigator.mediaDevices.getUserMedia({
                    audio: true,
               });
               setStream(stream);
               const Recorder = new MediaRecorder(stream);
               Recorder.start();
               let chunks = [];
               Recorder.ondataavailable = (e) => {
                    chunks.push(e.data);
               };

               Recorder.onstop = () => {
                    const blob = new Blob(chunks, {
                         type: "audio/ogg; codecs=opus",
                    });
                    setaudiourl(blob);
               };

               setrecording(true);
               setMediaRecorder(Recorder);
          } catch (error) {
               console.error(error);
          }
     };

     const stopRec = () => {
          if (mediaRecorder) {
               mediaRecorder.stop();
               const tracks = Stream.getTracks();

               tracks.forEach((track) => {
                    track.stop();
               });
               setrecording(false);
          }
     };

     const sendRec = () => {
          if (audiourl) {
               let fileReader = new FileReader();
               fileReader.onload = () => {
                    const binary = fileReader.result;
                    socket.emit("message", {
                         name: user.name,
                         message: "voice record",
                         room: roomID,
                         image: user.image,
                         attachPic,
                         rec: binary,
                    });
               };
               fileReader.readAsDataURL(audiourl);
          }
     };

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
                    replyMessage: replyMsg?.message || null,
                    replyId: replyMsg?._id || null,
               });

               setinput("");
               setattachPic([]);
               setMesg(null);
          }
     };

     useEffect(() => {
          socket.emit("typing", roomID, user.name);
     }, [input]);

     useEffect(() => {
          if (sendpicture.files) {
               upload(setattachPic);
               setsendpicture({ files: "" });
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
          }
     }, [audio]);

     useEffect(() => {
          if (doc.files) {
               console.log(doc.files[0].size);

               let fileReader = new FileReader();
               fileReader.readAsDataURL(doc.files[0]);

               fileReader.onload = () => {
                    const binary = fileReader.result;
                    socket.emit("message", {
                         name: user.name,
                         message: "sent doc",
                         room: roomID,
                         image: user.image,
                         doc: binary,
                    });
                    setdoc({
                         files: "",
                    });
               };
          }
     }, [doc]);

     return (
          <div className="relative  ">
               <form
                    className={`flex    space-x-4 py-3 px-5 justify-between rounded-full ${
                         darkmode ? "bg-[#202227] " : "bg-white"
                    }`}
                    onSubmit={Submit}
               >
                    {audiourl && (
                         <div className="flex items-center space-x-2 ">
                              <RiDeleteBin6Line
                                   className="text-xl"
                                   onClick={() => setaudiourl("")}
                              />
                              <Wave
                                   url={URL.createObjectURL(audiourl)}
                                   size={100}
                              />
                         </div>
                    )}
                    {!audiourl ? (
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
                                             <div className="bg-[#555555] rounded-full text-white  w-[28px] h-[28px] flex justify-center items-center cursor-pointer">
                                                  <label htmlFor="doc">
                                                       <CgFileDocument className=" " />
                                                  </label>
                                                  <input
                                                       type="file"
                                                       name=""
                                                       id="doc"
                                                       className="w-0 h-0"
                                                       onChange={(e) => {
                                                            setdoc({
                                                                 files: e.target
                                                                      .files,
                                                            });
                                                       }}
                                                  />
                                             </div>
                                             <div className="bg-[#555555] rounded-full text-white  w-[28px] h-[28px] flex justify-center items-center cursor-pointer">
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
                                             <div className="bg-[#555555] rounded-full text-white  w-[28px] h-[28px] flex justify-center items-center cursor-pointer">
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
                              {!recording ? (
                                   <BsMicFill onClick={startRec} />
                              ) : (
                                   <button
                                        className="text-sm whitespace-nowrap text-red-400 font-bold  flex justify-center items-center"
                                        onClick={stopRec}
                                   >
                                        stop
                                   </button>
                              )}
                         </button>
                    ) : (
                         ""
                    )}
                    <input
                         type="text"
                         value={input}
                         className="w-[80%] outline-none bg-transparent"
                         placeholder="Your message"
                         onChange={(e) => setinput(e.target.value)}
                    />

                    <button
                         type="submit"
                         onClick={(e) => {
                              if (audiourl) {
                                   sendRec();
                                   setaudiourl("");
                              } else {
                                   Submit(e);
                              }
                         }}
                    >
                         <IoPaperPlane
                              color="#555555"
                              className="text-[18px]"
                         />
                    </button>
               </form>
          </div>
     );
};

export default Message;
