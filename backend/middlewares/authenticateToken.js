import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
export const authenticateToken = asyncHandler(async (req, res, next) => {
  const authHeaders = req.headers["authorization"];
  const token = authHeaders && authHeaders.split(" ")[1];

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.sendStatus(401);
    }
    req.user = user;
    next();
  });
});
