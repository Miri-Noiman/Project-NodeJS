import { Request, Response, NextFunction } from "express";

export function AuthorizeTeacher(req: Request, res: Response, next: NextFunction) {
  const user = (req as any).user;
  
  console.log("the user is: " + user?.username);

  if (user && user.role === "Teacher") {
    next();
  } else {
    return res.status(403).json({ error: "The user is not allowed to enter this page" });
  }
}