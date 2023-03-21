import React from "react";
import { BiArrowToRight } from "react-icons/bi";

const RightHeader = () => {
     return (
          <button className="flex items-center space-x-2">
               <p>collapse</p>
               <BiArrowToRight className="text-xl" />
          </button>
     );
};

export default RightHeader;
