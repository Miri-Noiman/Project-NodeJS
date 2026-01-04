import { Router, Request, Response } from 'express';
// כאן נשתמש ב-Service של המשתמשים שיצרנו קודם
import * as userService from '../../Models_Service/User/userService';

const router = Router();

// נתיב ה-About (השארנו את הסגנון שלך)
router.get('/about', (req: Request, res: Response) => {
    res.send('Welcome to about us page');
});

// נתיב הרישום (Register) - כאן קורה הקסם של הפרויקט
router.post('/register', async (req: Request, res: Response, next) => {
    try {
        const newUser = await userService.createUser(req.body);
        res.status(201).json(newUser);
    } catch (error) {
        next(error); // שולח ל-Error Handling Middleware שלך
    }
});

// נתיב ההתחברות (Login)
router.post('/login', async (req: Request, res: Response, next) => {
    try {
        const { email, password } = req.body;
        
        // קריאה ל-Service שיבדוק את המשתמש ויחזיר אובייקט עם טוקן
        const result = await userService.loginUser(email, password);
        
        // כאן הוספנו את result.token לתגובה
        res.status(200).json({ 
            message: "Login successful", 
            token: result.token 
        });
    } catch (error) {
        next(error);
    }
});

export default router;
