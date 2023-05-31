import React from "react";
import { CiSearch } from "react-icons/ci";
const SearchComp = ({ darkmode }) => {
     return (
          <div
               className={` ${
                    darkmode ? "bg-gray-600 text-white" : "bg-white rounded"
               }  p-2 flex  items-center border space-x-3 `}
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
