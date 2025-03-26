// eslint-disable-next-line no-unused-vars
import React, { useContext } from 'react'
import { AdminContext } from '../context/AdminContext'
import admin_logo from '../assets/admin_logo.svg';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { DoctorContext } from '../context/DoctorContext';

const Navbar = () => {
    const {aToken,setAToken}=useContext(AdminContext);
    const {dToken,setDToken}=useContext(DoctorContext);
    const navigate=useNavigate();

    const logout=()=>{
      navigate('/');
      aToken && setAToken('');
      aToken && localStorage.removeItem('aToken');
      toast.success("logout Successfully");
      dToken && setDToken('');
      dToken && localStorage.removeItem('dToken');
    }
  return (
    <div className='flex items-center justify-between px-4 sm:px-10 py-3 bg-white border-b '>
      <div className='flex items-center gap-2 text-xs'>
        <img src={admin_logo} alt="" className='w-36 sm:w-40 cursor-pointer' />
        <p className='border px-2.5 py-0.5 border-solid rounded-full border-gray-500 text-gray-600'>{aToken? "Admin" : "Doctor"}</p>
      </div>
      <button onClick={logout}   className='bg-primary text-white text-sm rounded-full px-10 py-2 cursor-pointer '>Logout</button>
    </div>
  )
}

export default Navbar;