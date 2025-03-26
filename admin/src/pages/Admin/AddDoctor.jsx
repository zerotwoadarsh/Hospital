// eslint-disable-next-line no-unused-vars
import React, { useContext, useState } from "react";
import { assets } from "../../assets/assets";
import { toast } from "react-toastify";
import { AdminContext } from "../../context/AdminContext";
import axios from "axios";
const AddDoctor = () => {
  const[docImg,setDocImg]=useState(false);
  const[name,setName]=useState("");
  const[email,setEmail]=useState("");
  const[fees,setFees]=useState("");
  const[password,setPassword]=useState("");
  const[experience,setExperience]=useState("1 Year");
  const[speciality,setSpeciality]=useState("General physician");
  const[education,setEduction]=useState("");
  const[address1,setAddress1]=useState("");
  const[address2,setAddress2]=useState("");
  const[about,setAbout]=useState("");

  const {aToken,backendUrl}=useContext(AdminContext);


  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      if (!docImg) {
        toast.error("Please select an image");
        return; // Stop execution if no image is selected
      }
  
      const formData = new FormData(); // Proper initialization
      formData.append("image", docImg);
      formData.append("name", name);
      formData.append("email", email); 
      formData.append("password", password);
      formData.append("speciality", speciality);
      formData.append("experience", experience);
      formData.append("about", about);
      formData.append("fees", fees);
      formData.append("address", JSON.stringify({ line1: address1, line2: address2 }));
      formData.append("degree", education);

      // formData.forEach((value, key) => {
      //   console.log(key, value); // Log key and value of each FormData entry
      // });
      
  
      // Correct header structure
      const { data } = await axios.post(
        `${backendUrl}/api/admin/add-doctor`,
        formData,
        { headers:{aToken}}
      );

      
  
      if (data.success) {
        toast.success("Doctor added successfully");
        setDocImg(false);
        setName('');
        setEmail('');
        setEduction('');
        setAddress1('');
        setAddress2('');
        setAbout('');
        setFees('');
        setPassword('');
        
      } else {
        toast.error(data.message);
      }
  
    } catch (error) {
      toast.error(error.message || "An error occurred while adding the doctor.");
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className="m-5 w-full">
      <p className="mb-3 text-lg font-medium">Add Doctor</p>

      <div className="bg-white px-8 py-8 border w-full max-w-4xl max-h-[80vh] overflow-y-scroll ">
        <div className="flex items-center gap-4 text-gray-500">
          <label htmlFor="add-doctor">
            <img
              className="w-16 bg-gray-100 rounded-full cursor-pointer"
              src={docImg ?URL.createObjectURL(docImg):assets.upload_area}
              alt="doc-img"
            />
          </label>
          <input type="file" onChange={(e)=>setDocImg(e.target.files[0])}  id="add-doctor" hidden />
          <p>
            Upload doctor <br />
            picture
          </p>
        </div>
        <div className="flex flex-col lg:flex-row items-start gap-10 text-gray-600 ">
          <div className="w-full lg:flex-1 flex flex-col gap-4">
            <div className="flex-1 flex  flex-col gap-1 text-gray-700">
              <p  >Doctor Name</p>
              <input onChange={(e)=>setName(e.target.value)} value={name} className="border rounded px-3 py-2"  type="text" placeholder="Name" required />
            </div>

            <div className="flex-1 flex  flex-col gap-1 text-gray-700">
              <p>Doctor Email</p>
              <input onChange={(e)=>setEmail(e.target.value)} value={email} className="border rounded px-3 py-2" type="email" placeholder="email" required />
            </div>

            <div className="flex-1 flex  flex-col gap-1 text-gray-700">
              <p>Doctor Password</p>
              <input onChange={(e)=>setPassword(e.target.value)} value={password} className="border rounded px-3 py-2" type="password" placeholder="password" required />
            </div>

            <div className="flex-1 flex  flex-col gap-1 text-gray-700">
              <p>Experience</p>
              <select onChange={(e)=>setExperience(e.target.value)} value={experience} className="border rounded px-3 py-2" name="" id="">
                <option value="1 Year">1 Year</option>
                <option value="2 Year">2 Year</option>
                <option value="3 Year">3 Year</option>
                <option value="4 Year">4 Year</option>
                <option value="5 Year">5 Year</option>
                <option value="6 Year">6 Year</option>
                <option value="7 Year">7 Year</option>
                <option value="8 Year">8 Year</option>
                <option value="9 Year">9 Year</option>
                <option value="10 Year">10 Year</option>
              </select>
            </div>

            <div className="flex-1 flex  flex-col gap-1 text-gray-700">
              <p>Fees </p>
              <input onChange={(e)=>setFees(e.target.value)} value={fees} className="border rounded px-3 py-2" type="number" placeholder="fees" required />
            </div>
          </div>

          <div className="w-full lg:flex-1 flex flex-col gap-4">
            <div className="flex-1 flex  flex-col gap-1 text-gray-700">
              <p>Speciality</p>
              <select onChange={(e)=>setSpeciality(e.target.value)} value={speciality} className="border rounded px-3 py-2" name="" id="">
                <option value="General physician">General physician</option>
                <option value="Gynecologist">Gynecologist</option>
                <option value="Neurologist">Neurologist</option>
                <option value="Dermatologist">Dermatologist</option>
                <option value="Gastroenterologist">Gastroenterologist</option>
                <option value="Pediatricians">Pediatricians</option>
              </select>
            </div>

            <div className="flex-1 flex  flex-col gap-1 text-gray-700">
              <p>Educations</p>
              <input onChange={(e)=>setEduction(e.target.value)} value={education} className="border rounded px-3 py-2" type="text" placeholder="Education" required />
            </div>

            <div className="flex-1 flex  flex-col gap-1 text-gray-700">
              <p>Address</p>
              <input onChange={(e)=>setAddress1(e.target.value)} value={address1} className="border rounded px-3 py-2" type="text" placeholder="Address1" required />
              <input onChange={(e)=>setAddress2(e.target.value)} value={address2} className="border rounded px-3 py-2" type="text" placeholder="Addresss2" required />
            </div>
          </div>
        </div>
        <div className="flex-1 flex flex-col gap-1 text-gray-700 mt-4 mb-4">
          <p>About Doctor</p>
          <textarea onChange={(e)=>setAbout(e.target.value)} value={about} className="border rounded px-3 py-2 w-full " name="" id="" placeholder="About me" rows={5}></textarea>
        </div>
        <button className="bg-primary py-3 px-10 mt-2 text-white mx-3 rounded-full text-normal">Add doctor</button>
      </div>
    </form>
  );
};

export default AddDoctor;
