import { Request, Response, NextFunction } from "express";

// Logger Middleware גלובלי
export const loggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const method = req.method;          // שיטת HTTP (GET, POST וכו')
    const path = req.originalUrl;       // הנתיב המלא של הבקשה
    const timestamp = new Date().toISOString(); // תאריך ושעה של הבקשה

    console.log(`[${timestamp}] ${method} ${path}`);

    next(); // ממשיך לשאר ה-Middleware או ל-Route Handler
};
