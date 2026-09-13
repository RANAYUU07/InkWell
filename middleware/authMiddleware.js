import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
  try {
    const auhtHeader = req.headers.authorization;

    if (!auhtHeader || !auhtHeader.startsWith("Bearer")) {
      return res
        .status(401)
        .json({ message: "No token provided or Invalid token" });
    }

    const token = auhtHeader.split(" ")[1];

    const JWT_SECRET = process.env.JWT_SECRET;

    const decoded = jwt.verify(token, JWT_SECRET);

    req.user = decoded;

    next()
  } catch (error) {
    res.status(401).json({message: "Invalid or expired Token"})
  }
};
