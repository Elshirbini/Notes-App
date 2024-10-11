import jwt from "jsonwebtoken";

export const authenticateToken = (req, res, next) => {
  const authHeaders = req.headers["authorization"];

  const token = authHeaders && authHeaders.split(" ")[1];
  try {
    // jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    jwt.verify(
      token,
      "fa17722d20746447eaa38c85d7fb6a1824719bfc037dafb27fb4ad00a8f6d78b",
      (err, user) => {
        if (err) {
          return res.sendStatus(401);
        }
        req.user = user;
        next();
      }
    );
  } catch (err) {
    console.log(err);
  }
};
