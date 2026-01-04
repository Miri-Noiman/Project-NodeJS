import jwt from 'jsonwebtoken';
import { userModel } from "./userModel";
import { Iuser } from "./userModel";

export const createUser = async (userData: Partial<Iuser>) => {
    try {
        const existingUser = await userModel.findOne({ 
            $or: [{ email: userData.email }, { userId: userData.userId }] 
        });

        if (existingUser) {
            const error: any = new Error("User with this email or ID already exists");
            error.status = 400;
            throw error;
        }

        const newUser = new userModel(userData);
        return await newUser.save();
    } catch (error) {
        throw error;
    }
};

export const loginUser = async (email: string, password: any) => {
    // 1. חיפוש המשתמש במסד הנתונים
    const user = await userModel.findOne({ email });

    // 2. בדיקה אם המשתמש קיים והאם הסיסמה תואמת
    if (!user || (user as any).password !== password) {
        const error: any = new Error("אימייל או סיסמה שגויים");
        error.status = 401;
        throw error;
    }

    // 3. יצירת הטוקן (JWT)
    const token = jwt.sign(
        { id: user._id, role: (user as any).role },
        'my_very_secret_key_123', 
        { expiresIn: '1h' }
    );

    // מחזירים רק את האובייקטים - ה-Controller כבר ישלח אותם לפוסטמן
    return { token, user };
};


export const getUserById = async (id: string) => {
    try {
        return await userModel.findById(id).select("-password");
    } catch (error) {
        throw error;
    }
};