import jwt from "jsonwebtoken";

export const isLoggedIn = async (req, res, next) => {
  try {
    console.log(req.cookies);
    // let token = req.cookies?.token
    let token = req.cookies.token || "";

    console.log("Token Found: ", token ? "YES" : "NO");

    if (!token) {
      console.log("No Token");
      return res.status(401).json({
        message: "Authentication Failed",
        success: false,
      });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      console.log("decoded data", decoded);
      // decoded data is an object
      req.user = decoded;

      next();
    } catch (error) {

    }
  } catch (error) {
    next();
  }
  next();
};
 