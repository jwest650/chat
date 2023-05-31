import Image from "next/image";
import React from "react";
import { BiPowerOff } from "react-icons/bi";

const LeftHeader = () => {
     return (
          <div>
               <section className="flex justify-between items-center text-[#555555]  ">
                    <button className="flex items-center space-x-1">
                         <Image
                              src={"/images/logo.svg"}
                              width={40}
                              height={40}
                         />
                         <p className="font-bold capitalize ">chatty</p>
                    </button>

                    <button className="flex items-center space-x-1">
                         <p className="capitalize">logout</p>
                         <BiPowerOff />
                    </button>
               </section>
          </div>
     );
};

export default LeftHeader;
