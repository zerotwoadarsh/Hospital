// eslint-disable-next-line no-unused-vars
import React, { useContext, useEffect } from "react";
import { AdminContext } from "../../context/AdminContext";

const DoctorsList = () => {
  const { doctors, aToken, getAllDoctors,changeAvailablity } = useContext(AdminContext);

  useEffect(() => {
    if (aToken) {
      getAllDoctors();
    }
  }, [aToken]);
  

  return (
    <div className="p-5 max-h-[90vh] overflow-y-scroll bg-slate-50 ">
      <h1 className="font-medium ">All Doctors</h1>
      <div className="flex items-center gap-4 mt-5 flex-wrap  " >
        {doctors.map((item, index) => (
          <div className="w-56 h-88  border border-blue-100 rounded-xl cursor-pointer " key={index}>
            <img className="bg-blue-50 hover:bg-primary rounded-t-xl" src={item.image} alt="" />
            <div className="flex flex-col gap-1 m-3 ">
              <p className="font-medium" >{item.name}</p>
              <p className="text-gray-500 text-sm">{item.speciality}</p>
              <div className="flex gap-2 ">
                <input type="checkbox" onChange={()=>changeAvailablity(item._id)}  checked={item.available} />
                <p>Available</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorsList;
