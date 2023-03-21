import React from "react";

const useFilter = (data, user) => {
     const res = data.filter((val) => val.name == user);
     return res;
};

export default useFilter;
