import { Router } from 'express';
// ייבוא הפונקציות מה-Service הרלוונטי
import * as submissionService from '../../Models_Service/Submission/submissionService';
import * as assignmentService from '../../Models_Service/Assignment/assignmentService';
// ייבוא ה-Middleware של האימות
import { authMiddleware } from '../../Middlewares/authenticationMid';

export const studentRouter = Router();

/**
 * כל הנתיבים בראוטר זה מוגנים על ידי אימות (Token)
 */
studentRouter.use(authMiddleware);

// 1. צפייה בכל התרגילים הפתוחים
studentRouter.get('/assignments', async (req, res, next) => {
    try {
        const assignments = await assignmentService.getOpenAssignments();
        res.status(200).json(assignments);
    } catch (error) {
        next(error);
    }
});

// 2. הגשת תרגיל חדש
// 2. הגשת תרגיל חדש
studentRouter.post('/submissions', async (req, res, next) => {
    try {
        // התיקון: אנחנו בודקים גם id וגם _id כדי להיות בטוחים
        const submissionData = {
            ...req.body,
            studentId: (req as any).user.id || (req as any).user._id 
        };
        const newSubmission = await submissionService.createSubmission(submissionData);
        res.status(201).json(newSubmission);
    } catch (error) {
        next(error);
    }
});

// 3. צפייה בהגשות שלי (כולל שותף) וממוצע כיתתי
studentRouter.get('/submissions/me', async (req, res, next) => {
    try {
        const userId = (req as any).user._id;
        const mySubmissions = await submissionService.getMySubmissions(userId);
        
        // אתגר: הוספת ממוצע כיתתי (כאן ניתן להוסיף קריאה ללוגיקה מה-Service)
        res.status(200).json({
            submissions: mySubmissions,
            classAverage: "Calculated average logic here" 
        });
    } catch (error) {
        next(error);
    }
});

export default studentRouter;