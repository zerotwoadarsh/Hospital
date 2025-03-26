// eslint-disable-next-line no-unused-vars
import React, { useContext, useState } from "react";
//import { assets } from "../assets/assets";
import { AdminContext } from "../context/AdminContext";
import axios from "axios";
import { toast } from "react-toastify"
import { DoctorContext } from "../context/DoctorContext";

const Login = () => {



  const [state, setState] = useState("Admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { setAToken, backendUrl } = useContext(AdminContext);
  const { setDToken } = useContext(DoctorContext);

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      if (state === "Admin") {
        const { data } = await axios.post(backendUrl + "/api/admin/login", {
          email,
          password,
        });

        if (data.success) {
          toast.success("login successfully");
          localStorage.setItem('aToken', data.token);
          setAToken(data.token);

        } else {
          toast.error(data.message);
        }
      }
      else {
        const { data } = await axios.post(backendUrl + '/api/doctor/login', {
          email, password
        });

        if (data.success) {
          toast.success("login successfully");
          localStorage.setItem('dToken', data.token);
          setDToken(data.token);

        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      console.log(error)
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className="max-h-[80vh] flex flex-col  bg-white md:w-[370px] w-[350px] mx-auto mt-16 border rounded-xl shadow drop-shadow-md py-10 px-8 text-gray-600">
      <p className="text-2xl font-medium mb-5 m-auto">
        <span className="text-primary ">{state}</span> Login
      </p>
      <div className="w-full flex flex-col text-sm">
        <label htmlFor="email" className="pb-1 text-sm">
          Email
        </label>{" "}
        <input
          className="mb-2 h-10 outline:none border border-solid rounded-md pl-3"
          type="email"
          name="email"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          required
          placeholder="abcd@example.com"
        />
      </div>
      <div className="w-full flex flex-col text-sm">
        <label htmlFor="password" className="pb-1 text-sm ">
          Password
        </label>{" "}
        <input
          className="mb-2 h-10 outline:none border border-solid rounded-md pl-3"
          type="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder=""
        />
      </div>
      <button className="border bg-primary w-full mt-2 rounded-md text-white py-2">
        Login
      </button>
      {state === "Admin" ? (
        <p className="text-sm mt-2 tracking-normal">
          <span className="mr-1">Doctor</span>login?{" "}
          <span
            className="underline text-primary cursor-pointer"
            onClick={() => setState("Doctor")}
          >
            Click here
          </span>
        </p>
      ) : (
        <p className="text-sm mt-2 tracking-normal">
          <span className="mr-1">Admin</span>login?{" "}
          <span
            className="underline text-primary cursor-pointer"
            onClick={() => setState("Admin")}
          >
            Click here
          </span>
        </p>
      )}
    </form>
  );
};

export default Login;
