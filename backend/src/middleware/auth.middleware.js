import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import Business from "../models/business.model.js";

export const authenticate = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) return res.status(401).json({ error: "Unauthorized, token missing" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    let account = null;
    if (decoded.role === "user") {
      account = await User.findById(decoded.id);
    } else if (decoded.role === "business") {
      account = await Business.findById(decoded.id);
    }

    if (!account) return res.status(401).json({ error: "Unauthorized, account not found" });

    req.user = account;
    req.role = decoded.role;

    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ error: "Invalid or expired token" });
  }
};
