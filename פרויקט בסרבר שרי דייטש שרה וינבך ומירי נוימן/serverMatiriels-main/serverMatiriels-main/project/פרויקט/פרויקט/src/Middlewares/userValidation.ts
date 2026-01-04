import { Request, Response, NextFunction } from "express";
import { userModel } from "../Models_Service/User/userModel"; // הייבוא שסידרת מקודם

export const validateRegistration = async (req: Request, res: Response, next: NextFunction) => {
    const { email, userId, password } = req.body;

    // 1. בדיקת חוזק סיסמה (לפחות 8 תווים, אותיות ומספרים) - דרישה ב'
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!passwordRegex.test(password)) {
        return res.status(400).json({ 
            message: "Password must be at least 8 characters long and contain both letters and numbers." 
        });
    }

    try {
        // 2. בדיקת ייחודיות משתמש - הקוד ששאלת עליו
        const existingUser = await userModel.findOne({ 
            $or: [{ email: email }, { userId: userId }] 
        });

        if (existingUser) {
            return res.status(400).json({ message: "User with this Email or ID already exists." });
        }
        next(); 
    } catch (error) {
        next(error); 
    }

};