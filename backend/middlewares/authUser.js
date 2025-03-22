import jwt from "jsonwebtoken";

//admin authentication middlewares
const authUser = async (req, res, next) => {
  try {
    const { token } = req.headers;
    console.log(token);
    
    if (!token) {
      return res.json({
        success: false,
        message: "Not Authorized  Login Again",
      });
    }
    const token_decode = jwt.verify(token, process.env.JWT_SECRET);
    
    req.body.userId=token_decode.id;
    
    next();
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export default authUser;