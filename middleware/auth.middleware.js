import jwt from "jsonwebtoken";

export const isLoggedIn = async (req, res, next) => {
  try {
    console.log(req.cookies);
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

      console.log("Decoded data", decoded);
      req.user = decoded;

      next();
    } catch (error) {
      console.log("Auth Middleware failure");
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  } catch (error) {
    next(error);
  }
};
