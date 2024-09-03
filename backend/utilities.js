import jwt from "jsonwebtoken";


export const authenticateToken = (req, res, next) => {
  const authHeaders = req.headers["authorization"];

  const token = authHeaders && authHeaders.split(" ")[1];
  try {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) {
        return res.sendStatus(401);
      }
      req.user = user;
      next();
    });
  } catch (err) {
    console.log(err);
  }
};
