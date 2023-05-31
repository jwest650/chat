import dynamic from "next/dynamic";
import { React, useEffect, useLayoutEffect, useRef, useState } from "react";
import { GoPlay } from "react-icons/go";
import { MdOutlinePauseCircleFilled } from "react-icons/md";
const Audio = ({ data, width }) => {
     const Wave = dynamic(() => import("./Waveform"));
     const [duration, setduration] = useState(0);
     const [remainig, setremaining] = useState(0);

     const [progress, setprogress] = useState(0);
     const [max, setmax] = useState(100);
     const [playing, setplaying] = useState("play");
     const aud = useRef();
     const onPlay = () => {
          if (playing === "play") {
               aud.current.play();
               setplaying("pause");
          } else if (playing == "pause") {
               aud.current.pause();
               setplaying("play");
          }
     };

     const restart = () => {
          aud.current.currentTime = 0;
     };
     const calculateTime = (secs) => {
          const minutes = Math.floor(secs / 60);
          const seconds = Math.floor(secs % 60);
          const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
          return `${minutes}:${returnedSeconds}`;
     };
     const updateTime = () => {
          const audio = aud.current;
          let played = audio.currentTime;
          setprogress(played);
          setremaining(duration - audio.currentTime);
     };

     const loaded = () => {
          const audio = aud.current;

          let dur = calculateTime(audio.duration);
          setduration(dur);
          setmax(Math.floor(audio.duration));
     };

     useEffect(() => {}, []);

     return (
          <section>
               <Wave url={"https://wavesurfer-js.org/example/media/demo.wav"} />
               {/* <audio
                    src={data}
                    ref={aud}
                    onTimeUpdate={updateTime}
                    onEnded={restart}
                    onLoadedMetadata={loaded}
               />

               <div
                    className={`${
                         width ? "w-[width]" : "w-52"
                    } h-[30px] border shadow rounded-md flex items-center relative`}
               >
                    {" "}
                    <progress
                         id="file"
                         value={progress}
                         max={max}
                         className="h-full w-full rounded  bg-[#DAE8F7] slider"
                    ></progress>{" "}
                    <div className="flex items-center absolute right-0 space-x-2 p-1">
                         <p>{duration} </p>
                         {playing !== "play" ? (
                              <MdOutlinePauseCircleFilled
                                   className="text-blue-500 text-xl"
                                   onClick={onPlay}
                              />
                         ) : (
                              <GoPlay
                                   onClick={onPlay}
                                   className="text-blue-500 text-xl"
                              />
                         )}
                    </div>
               </div> */}
          </section>
     );
};

export default Audio;
