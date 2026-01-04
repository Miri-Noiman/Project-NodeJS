import fs from 'fs';
import path from 'path';

/**
 * פונקציה לתיעוד הודעות לקובץ לוג חיצוני
 *
 */
export const logToFile = (message: string) => {
    // 1. הגדרת הנתיב לקובץ הלוג (ייווצר בתיקיית השורש של הפרויקט)
    const logFilePath = path.join(__dirname, '../../logs.txt');

    // 2. יצירת חותמת זמן כדי שנדע מתי כל פעולה קרתה
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}\n`;

    // 3. כתיבה לקובץ - appendFileSync מוסיף לסוף הקובץ מבלי למחוק את מה שהיה
    try {
        fs.appendFileSync(logFilePath, logMessage, 'utf8');
    } catch (error) {
        console.error("Failed to write to log file:", error);
    }
};