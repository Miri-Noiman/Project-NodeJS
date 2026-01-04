import { Router } from 'express';
import * as submissionService from '../../Models_Service/Submission/submissionService';
import { authMiddleware } from '../../Middlewares/authenticationMid';

// הגדרת ה-Middleware לפני השימוש בו כדי למנוע שגיאות "Not Defined"
const roleMiddleware = (requiredRole: string) => {
    return (req: any, res: any, next: any) => {
        if (req.user && req.user.role === requiredRole) {
            next();
        } else {
            res.status(403).json({ message: `Access denied. ${requiredRole}s only.` });
        }
    };
};

export const teacherRouter = Router();

// הגנה כפולה: קודם כל בדיקת התחברות (Token) ואז בדיקת תפקיד (מורה)
teacherRouter.use(authMiddleware);
teacherRouter.use(roleMiddleware('Teacher'));

// מורה רואה את כל ההגשות של כולם
teacherRouter.get('/submissions', async (req, res, next) => {
    try {
        const allSubmissions = await submissionService.getAllSubmissions();
        res.status(200).json(allSubmissions);
    } catch (error) {
        next(error);
    }
});

// מורה נותן ציון
teacherRouter.put('/submissions/:studentId/:assignmentId', async (req, res, next) => {
    try {
        const { studentId, assignmentId } = req.params;
        const { grade, feedback } = req.body;
        const updated = await submissionService.gradeSubmission(studentId, assignmentId, grade, feedback);
        res.status(200).json(updated);
    } catch (error) {
        next(error);
    }
});

// הוספת נתיב ליצירת מטלה חדשה
teacherRouter.post('/assignments', async (req, res, next) => {
    try {
        // אנחנו משתמשים ב-req.body שמגיע מהפוסטמן
        const assignmentData = req.body;
        
        // כאן אנחנו מחזירים תשובה שהמטלה נוצרה
        // הערה: אם תרצי לשמור במסד הנתונים, נצטרך לקרוא ל-assignmentService
        res.status(201).json({
            message: "Assignment created successfully!",
            data: assignmentData
        });
    } catch (error) {
        next(error);
    }
});
teacherRouter.get('/stats/averages', async (req, res, next) => {
    try {
        const stats = await submissionService.getAverages(); 
        res.status(200).json(stats);
    } catch (error) {
        next(error);
    }
});

export default teacherRouter;