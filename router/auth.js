const { verify } = require("jsonwebtoken");
require("dotenv").config();

module.exports = (req, res, next) => {
  try {
    const { id, authtoken } = req.headers;
    if (id && authtoken) {
      const decodedToken = verify(authtoken, process.env.SECRET_TOKEN);
      const userId = decodedToken.sub;
      if (id !== userId) {
        res.status(200).json({ message: "Authentication Faild" });
      } else {
        next();
      }
    } else {
      res.status(200).json({ message: "Please Login First" });
    }
  } catch {
    res.status(401).json({
      message: "Server Error On Login",
    });
  }
};
