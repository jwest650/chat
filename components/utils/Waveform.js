import { useEffect, useRef, useState } from "react";
import { CiPlay1 } from "react-icons/ci";
import { RxPause } from "react-icons/rx";
import WaveSurfer from "wavesurfer.js";

function Waveform({ url, width }) {
     const [playing, setplaying] = useState(true);
     const [duration, setduration] = useState("0:00");
     const [remaining, setremaining] = useState("0:00");

     const waveformRef = useRef(null);
     const [wave, setwave] = useState(null);

     const calculateTime = (secs) => {
          const minutes = Math.floor(secs / 60);
          const seconds = Math.floor(secs % 60);
          const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
          return `${minutes}:${returnedSeconds}`;
     };

     useEffect(() => {
          const wavesurfer = WaveSurfer.create({
               container: waveformRef.current,
               waveColor: "#555555",
               progressColor: "orange",
               height: 20,
               cursorWidth: 0.5,
               cursorColor: "#555555",
               barWidth: 2,
               normalize: true,
               responsive: true,
               fillParent: true,
               // backend: "MediaElement",
               // mediaControls: true,
          });
          wavesurfer.load(url);
          setwave(wavesurfer);
          wavesurfer.on("audioprocess", () => {
               setremaining(calculateTime(wavesurfer.getCurrentTime()));
          });
          wavesurfer.on("ready", () => {
               setduration(calculateTime(wavesurfer.getDuration()));
          });

          return () => {
               wavesurfer.destroy();
          };
     }, [url]);

     return (
          <div
               className={`bg-[#50C9B8] py-[7px] px-[12px] shadow rounded-full ${
                    width ? "w-[width]" : "w-[170px]  "
               } `}
          >
               <section className="flex items-center space-x-1 ">
                    {!playing ? (
                         <RxPause
                              className="text-xl"
                              onClick={() => {
                                   wave.playPause();
                                   setplaying(!playing);
                              }}
                         />
                    ) : (
                         <CiPlay1
                              onClick={() => {
                                   wave.playPause();
                                   setplaying(!playing);
                              }}
                              className=" text-xl"
                         />
                    )}

                    <div ref={waveformRef} className="w-full h-full " />
                    <p className=" text-[10px]">{remaining}</p>
               </section>
               {/* <div className="flex items-center justify-between">
                    <p className=" text-[10px]">{remaining}</p>
               </div> */}
          </div>
     );
}

export default Waveform;
