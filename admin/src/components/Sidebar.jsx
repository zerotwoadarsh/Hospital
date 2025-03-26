// eslint-disable-next-line no-unused-vars
import React, { useContext } from 'react'
import { AdminContext } from '../context/AdminContext'
import { NavLink } from 'react-router-dom';
import { assets } from '../assets/assets';
import { DoctorContext } from '../context/DoctorContext';

const Sidebar = () => {

  const {aToken}=useContext(AdminContext);
  const {dToken}=useContext(DoctorContext);
  return (
    <div className='min-h-screen  bg-white border-r'>
    {
      aToken && <ul className='text-[#515151] mt-5 '>
         
        <NavLink  to={"/admin-dashboard"}
         className={({isActive})=>`flex items-center gap-3 px-3 py-3.5 md:px-9 md:min-w-64 cursor-pointer ${isActive?'bg-[#F2F3FF]  border-r-4 border-primary':''}`}>
            <img className='min-w-5' src={assets.home_icon} alt="" />
            <p className='hidden md:!block'>Dashboard</p>
        </NavLink>
        <NavLink to={"/all-appointments"}
        className={({isActive})=>`flex items-center gap-3 px-3 py-3.5 md:px-9 md:min-w-64 cursor-pointer ${isActive?'bg-[#F2F3FF]  border-r-4 border-primary':''}`}>
            <img className='min-w-5' src={assets.appointment_icon} alt="" />
            <p className='hidden md:!block'>All Appointment</p>
        </NavLink>
        <NavLink to={"/add-doctor"}
        className={({isActive})=>`flex items-center gap-3 px-3 py-3.5 md:px-9 md:min-w-64 cursor-pointer ${isActive?'bg-[#F2F3FF]  border-r-4 border-primary':''}`}>
            <img className='min-w-6' src={assets.add_icon} alt="" />
            <p className='hidden md:!block'>Add Doctors</p>
        </NavLink>
        <NavLink to={"/doctors-list"}
        className={({isActive})=>`flex items-center gap-3 px-3 py-3.5 md:px-9 md:min-w-64 cursor-pointer ${isActive?'bg-[#F2F3FF]  border-r-4 border-primary':''}`}>
            <img className='min-w-5' src={assets.people_icon} alt="" />
            <p className='hidden md:!block'>Doctors List</p>
        </NavLink>

      </ul>
    }
    {
      dToken && <ul className='text-[#515151] mt-5 '>
         
        <NavLink  to={"/doctor-dashboard"}
         className={({isActive})=>`flex items-center gap-3 px-3 py-3.5 md:px-9 md:min-w-64 cursor-pointer ${isActive?'bg-[#F2F3FF]  border-r-4 border-primary':''}`}>
            <img className='min-w-5' src={assets.home_icon} alt="" />
            <p className='hidden md:!block'>Dashboard</p>
        </NavLink>
        <NavLink to={"/doctor-appointments"}
        className={({isActive})=>`flex items-center gap-3 px-3 py-3.5 md:px-9 md:min-w-64 cursor-pointer ${isActive?'bg-[#F2F3FF]  border-r-4 border-primary':''}`}>
            <img className='min-w-5' src={assets.appointment_icon} alt="" />
            <p className='hidden md:!block'>Appointment</p>
        </NavLink>
        
        <NavLink to={"/doctor-profile"}
        className={({isActive})=>`flex items-center gap-3 px-3 py-3.5 md:px-9 md:min-w-64 cursor-pointer ${isActive?'bg-[#F2F3FF]  border-r-4 border-primary':''}`}>
            <img className='min-w-5' src={assets.people_icon} alt="" />
            <p className='hidden md:!block'>Doctor Profile</p>
        </NavLink>

      </ul>
    }
      
    </div>
  )
}

export default Sidebar