import Image from "next/image";
import React from "react";

const SentImages = ({ data }) => {
     return (
          <div className="w-fit ml-auto">
               <Image src={data} width={200} height={200} className="" />
          </div>
     );
};

export default SentImages;
