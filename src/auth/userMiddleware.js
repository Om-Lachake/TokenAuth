
const jwt = require("jsonwebtoken");
const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || "shhhhha"; 

const userAuth = (req, res, next) => {
  try {
    const token =
      req.cookies.accessToken || req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });

    const decoded = jwt.verify(token, ACCESS_SECRET);
    req.userId = decoded._id;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "access_token_expired" }); // client should call /refresh-token
    }
    return res
      .status(401)
      .json({ message: "Invalid token", error: err.message });
  }
};
module.exports ={
  userAuth
}
