import { Request, Response, NextFunction } from "express";

// Middleware גלובלי לטיפול בשגיאות - דרישה ה'
export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    
    // 1. תיעוד השגיאה בשרת (לצרכי פיתוח)
    console.error(`[Error Context]: ${req.method} ${req.path}`);
    console.error(err.stack || err);

    // 2. קביעת סטטוס השגיאה - אם אין סטטוס, נשתמש ב-500 (שגיאת שרת כללית)
    const statusCode = err.status || 500;

    // 3. החזרת תשובה אחידה ללקוח (JSON)
    res.status(statusCode).json({
        success: false,
        error: {
            message: err.message || "Internal Server Error",
            // אפשר להוסיף כאן פרטים נוספים רק בסביבת פיתוח
            details: process.env.NODE_ENV === 'development' ? err.details : undefined
        }
    });
};