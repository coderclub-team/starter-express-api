// a
// a middle ware to check if the user is logged in or not

import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";
import User from "../models/user.model";

export default (req: Request, res: Response, next: NextFunction) => {
  // Get the token from the Authorization header
  const authHeader = req.header("Authorization");
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
}

  try {
    const decoded = verify(token, process.env.JWT_SECRET!);
    const { ...user } = decoded as User;
    req.body.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};
