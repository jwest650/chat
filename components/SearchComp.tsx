import React from "react";
import { CiSearch } from "react-icons/ci";
const SearchComp = ({ show, darkmode }) => {
     return (
          <div
               className={` ${
                    darkmode ? "bg-gray-600 text-white" : "bg-white rounded"
               }  p-2 flex  items-center border-b space-x-3 ${
                    show ? "hidden" : "block"
               }`}
          >
               <button>
                    <CiSearch />
               </button>
               <input
                    type="text"
                    className="w-full bg-transparent outline-none"
                    placeholder="Search"
               />
          </div>
     );
};

export default SearchComp;
