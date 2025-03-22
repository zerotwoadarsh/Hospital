import validator from "validator";
import bcrypt  from "bcryptjs";
import {v2 as cloudinary} from "cloudinary";
import doctorModel from "../modals/doctorModel.js";
import connectCloudinary from "../config/cloudinary.js";
import jwt from "jsonwebtoken"
import appointmentModel from "../modals/appointmentModel.js";
import userModel from "../modals/userModel.js";

//API for adding doctor
const addDoctor =async(req,res)=>{
    try {
        const {name,email,password,speciality,degree,experience,about,fees,address}=req.body;
        const imageFile=req.file;

     
        
        // checking all add is added
        if(!name||!email||!password ||!speciality||!degree ||!experience || !about || !fees || !address){
            return res.json({
                success:false,
                message:"Missing Details",
            })
        }

        //validating email format
        if(!validator.isEmail(email)){
            return res.json({status:false, message:"please enter valid email"})
        }

        // check for strong password
        if(password.length<8){
            return res.json({success:false, message:"please Enter strong Password"})
        }

        //hashing the password
        const salt=await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(password,salt);

        //upload image to cloudinary
        const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" });
        const imageUrl=imageUpload.secure_url;

        const doctorData={
            name,
            email,
            image:imageUrl,
            password:hashedPassword,
            speciality,
            degree,
            experience,
            about,
            fees,
            address:JSON.parse(address),
            date:Date.now(),
        }

        const newDoctor=new doctorModel(doctorData);
        await newDoctor.save();

        res.json({success:true,message:"Doctor Added"})

    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message})
    }
}

// Api For admin Login
const loginAdmin=async(req,res)=>{
    try{
        const{email,password}=req.body;
        

        if(email===process.env.ADMIN_EMAIL && password=== process.env.ADMIN_PASSWORD){
           const token=jwt.sign(email+password,process.env.JWT_SECRET);
           res.json({success:true,token})
        }else{
            res.json({success:false,message:"Invalid Credentials"})
        }


    }catch (error){
        console.log(error);
        res.json({success:false,message:error.message})
    }
}

// Api for all doctors
const allDoctors=async(req,res)=>{
    try {
        const doctors=await  doctorModel.find({}).select('-password');
        res.json({success:true,doctors});
        
    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message})
    }
}

//API to get all appointments listAppointment
const appointmentsAdmin=async(req,res)=>{
    try{
        const appointments=await appointmentModel.find({})
        res.json({success:true,appointments})
    }catch(error){
        console.log(error);
        res.json({success:false,message:error.message});
    }
}
//ApI For appointment cancellation
const appointmentCancel = async (req, res) => {
    try {
      const {  appointmentId } = req.body;
  
      const appointmentData = await appointmentModel.findById(appointmentId);
  
  
      await appointmentModel.findByIdAndUpdate(appointmentId, {
        cancelled: true,
      });
  
      //releasing doctor slot
      const { docId, slotDate, slotTime } = appointmentData;
      const doctorData = await doctorModel.findById(docId);
  
      let slots_booked = doctorData.slots_booked;
      slots_booked[slotDate] = slots_booked[slotDate].filter(
        (e) => e !== slotTime
      );
  
      await doctorModel.findByIdAndUpdate(docId, { slots_booked });
  
      res.json({ success: true, message: "Appointment cancelled" });
    } catch (error) {
      console.log(error);
      res.json({ success: false, message: error.message });
    }
  };

  //API to get dashboard data for admin panel
  const adminDashboard =async(req,res)=>{
    try{
        const doctors=await doctorModel.find({});
        const users =await userModel.find({});
        const appointments=await appointmentModel.find({});

        const dashData={
            doctors:doctors.length,
            appointments:appointments.length,
            patients:users.length,
            latestAppointments:appointments.reverse().slice(0,5)
        }

        res.json({success:true,dashData})

    }catch(error){
        console.log(error);
        res.json({success:false,message:error.message});
    }
  }

export {addDoctor,loginAdmin,allDoctors,appointmentsAdmin,appointmentCancel,adminDashboard}