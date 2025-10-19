const jwt = require("jsonwebtoken");

const generateToken = (payload) => {
  const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: "1h" });
  const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: "1d" });
  return { accessToken, refreshToken };
};


const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      throw new Error("No access token provided");
    }

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    req.userId = decoded._id;

    return next();

  } catch (error) {
    // Access token expired
    if (error.name === "TokenExpiredError") {
      try {
        const { refreshToken } = req.cookies;

        if (!refreshToken) {
          return res
            .status(401)
            .json({ message: "Session expired, please log in again" });
        }

        const decodedRefresh = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

        // Issuing a new access token
        const newAccessToken = jwt.sign({ _id: decodedRefresh._id }, process.env.JWT_ACCESS_SECRET, {
          expiresIn: "1h",
        });

        // Setting new access token cookie
        res.cookie("token", newAccessToken, { httpOnly: true, secure: true });

        req.userId = decodedRefresh._id;
        return next();
      } catch (refreshError) {
        return res
          .status(401)
          .json({
            message: "Invalid refresh token",
            error: refreshError.message,
          });
      }
    }

    return res
      .status(401)
      .json({ message: "Invalid or expired token", error: error.message });
  }
};


module.exports ={
  generateToken,
  userAuth
}