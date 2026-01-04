
import express, { Express } from "express";
import { loggerMiddleware } from "./Middlewares/loggerMid";
import identificationRouter from './Routers/Identification/identificationRouter';
import { studentRouter } from './Routers/Student/studentRouter'; // הוספנו
import { teacherRouter } from './Routers/Teacher/teacherRouter';   // הוספנו
import { errorHandler } from './Middlewares/errorHendling'; 
import { myDB } from './Utils.ts/ConnectDB'; // ייבוא של מחלקת ה-DB


const app: Express = express();

// הפעלת החיבור למסד הנתונים (MongoDB המקומי)
myDB.getInstance().connectToDb();
// Middleware גלובלי
app.use(loggerMiddleware);
app.use(express.json());

// הגדרת נתיבי ה-API לפי דרישות הפרויקט
app.use(express.json()); // שורה קריטית לקריאת הנתונים מפוסטמן
app.use('/auth', identificationRouter);      // לוגין ורישום
app.use('/student', studentRouter);        // פעולות תלמידים
app.use('/teacher', teacherRouter);        // פעולות מורים

// טיפול בשגיאות - תמיד בסוף שרשרת ה-Middleware
app.use(errorHandler);

export default app;
