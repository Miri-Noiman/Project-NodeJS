import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';


export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    
    // 2. בדיקה אם ה-Header קיים ומתחיל ב-Bearer
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ 
            success: false, 
            message: "Access denied. No token provided." 
        });
    }

    // 3. חילוץ הטוקן עצמו
    const token = authHeader.split(' ')[1];

    try {
        // 4. אימות הטוקן באמצעות המפתח הסודי
        // וודאי שהמפתח כאן זהה למפתח שהשתמשת בו ב-Login
        const secretKey = process.env.JWT_SECRET || "my_very_secret_key_123";
        const decoded = jwt.verify(token, secretKey);

        // 5. הזרקת פרטי המשתמש לתוך אובייקט ה-Request
        // זה מאפשר לראוטרים הבאים לדעת מי המשתמש (req.user._id)
        (req as any).user = decoded;

        // 6. מעבר לפונקציה הבאה (למשל ל-roleMiddleware או ל-Controller)
        next();
    } catch (error) {
        // אם הטוקן פג תוקף או לא תקין
        return res.status(401).json({ 
            success: false, 
            message: "Invalid or expired token." 
        });
    }
};