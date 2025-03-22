import validator from "validator";
import bcrypt  from "bcryptjs";
import userModel from "../modals/userModel.js";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";
import doctorModel from "../modals/doctorModel.js";
import appointmentModel from "../modals/appointmentModel.js";
import razorpay from "razorpay";

// API for user Register

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.json({ success: false, message: "messing the information" });
    }
    //validate the email
    if (!validator.isEmail(email)) {
      res.json({ success: false, message: "please enter valid email" });
    }
    if (password.length < 8) {
      res.json({ success: false, message: "please enter Strong email" });
    }
    //hashing the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userdata = {
      name,
      email,
      password: hashedPassword,
    };

    const newUser = new userModel(userdata);
    const user = await newUser.save();

    const token = await jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    res.json({
      success: true,
      token,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API for user login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) {
      res.json({ success: false, message: "user does not exit" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.json({ success: false, message: "Invalid Credential" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API for getProfile
const getProfile = async (req, res) => {
  try {
    const { userId } = req.body;

    const userData = await userModel.findById(userId).select("-password");

    res.json({ success: true, userData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//API for update user profile
const updateUser = async (req, res) => {
  try {
    const { userId, name, phone, dob, address, gender } = req.body;
    const imageFile = req.file;

    if (!name || !phone || !dob || !address || !gender) {
      return res.json({ success: false, message: "data is missing" });
    }

    await userModel.findByIdAndUpdate(userId, {
      name,
      phone,
      dob,
      address: JSON.parse(address),
      gender,
    });

    if (imageFile) {
      //uplaod image to cloudinary
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: "image",
      });
      const imageURL = imageUpload.secure_url;

      await userModel.findByIdAndUpdate(userId, { image: imageURL });
    }
    res.json({ success: true, message: "profile updated" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
// ApI for book the appointment
const bookAppointment = async (req, res) => {
  try {
    console.log(req.body);
    const { userId, docId, slotDate, slotTime } = req.body;

    const docData = await doctorModel.findById(docId).select("-password");

    if (!docData.available) {
      return res.json({ success: false, message: "doctor not available" });
    }

    let slots_booked = docData.slots_booked;
    //checking for slot availablity
    if (slots_booked[slotDate]) {
      if (slots_booked[slotDate].includes(slotTime)) {
        return res.json({ success: false, message: "slot not available" });
      } else {
        slots_booked[slotDate].push(slotTime);
      }
    } else {
      slots_booked[slotDate] = [];
      slots_booked[slotDate].push(slotTime);
    }

    const userData = await userModel.findById(userId).select("-password");

    delete docData.slots_booked;

    const appointmentData = {
      userId,
      docId,
      userData,
      docData,
      amount: docData.fees,
      slotTime,
      slotDate,
      date: Date.now(),
    };

    const newAppointment = new appointmentModel(appointmentData);
    await newAppointment.save();

    //save new slots data in docData
    await doctorModel.findByIdAndUpdate(docId, { slots_booked });

    res.json({ success: true, message: "Appointment Booked" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
//API to get user appointments for frontend my-appointment page
const listAppointment = async (req, res) => {

  try {

    const { userId } = req.body;
    const appointment = await appointmentModel.find({ userId });
    res.json({ success: true, appointment });

  } catch (error) {

    console.log(error);
    res.json({ success: false, message: error.message });

  }
};
const cancelAppointment = async (req, res) => {
  try {
    const { userId, appointmentId } = req.body;

    const appointmentData = await appointmentModel.findById(appointmentId);

    //verify appointment user
    if (appointmentData.userId !== userId) {
      return res.json({ success: false, message: "Unauthorized action" });
    }

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

const razorpayInstance = new razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
})
//API to make payment of appointment using razorpay
const paymentRazorpay = async (req, res) => {
  try {

    const { appointmentId } = req.body;
    console.log(appointmentId);
    const appointmentData = await appointmentModel.findById(appointmentId);
    console.log(appointmentData);

    if (!appointmentData || appointmentData.cancelled) {
      return res.json({
        success: false,
        message: "Appointment cancelled or not found",
      });
    }

    //creating options for razorpay payment
    const options = {
      amount: appointmentData.amount * 100,
      currency: process.env.CURRENCY,
      receipt: appointmentId,
    };

    // creation of an order
    const order = await razorpayInstance.orders.create(options);

    res.json({ success: true, order });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//API to verify payment iof razorpay
const verifyRazorpay=async(req,res)=>{
  try {
    const {razorpay_order_id}=req.body;
    const orderInfo= await razorpayInstance.orders.fetch(razorpay_order_id);

    if(orderInfo.status==='paid'){
      await appointmentModel.findByIdAndUpdate(orderInfo.receipt,{payment:true});

      res.json({success:true,message:"payment successful"})
    }else{
      res.json({success:false,message:"payment failed"});
    }

    
  } catch (error) {
    console.log(error);
    res.json({success:false,message:error.message});
  }
}


export {
  register,
  loginUser,
  getProfile,
  updateUser,
  bookAppointment,
  listAppointment,
  cancelAppointment,
  paymentRazorpay,
  verifyRazorpay,
};