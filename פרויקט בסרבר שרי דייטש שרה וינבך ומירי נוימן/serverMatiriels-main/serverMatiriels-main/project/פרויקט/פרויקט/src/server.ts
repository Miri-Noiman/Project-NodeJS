import app from './app'; // ייבוא האפליקציה שהגדרת ב-app.ts
import { logToFile } from './Utils.ts/Logger'; // ייבוא הלוגר שכתבנו
import { myDB } from './Utils.ts/ConnectDB'; // ודאי שהנתיב נכון

const PORT = 5000;

/**
 * פונקציה ראשית להפעלת השרת
 */
const startServer = async () => {
    try {
        // 1. חיבור לבסיס הנתונים (MongoDB) באמצעות המחלקה שיצרנו
        // השתמשנו ב-Singleton כדי להבטיח חיבור אחד בלבד
        await myDB.getInstance().connectToDb(); 
        console.log("Successfully connected to MongoDB");

        // 2. הפעלת השרת והאזנה לפורט
        app.listen(PORT, () => {
            const message = `Server is running on http://localhost:${PORT}`;
            console.log(message);
            
            // 3. תיעוד הפעלת השרת בלוגר
            logToFile("System started: " + message);
        });
        
    } catch (error) {
        // טיפול בשגיאה במקרה שהשרת לא הצליח לעלות
        console.error("Failed to start server:", error);
        logToFile("Critical Error: System failed to start");
        process.exit(1); // סגירת התהליך במקרה של שגיאה קריטית
    }
};

// הפעלת הפונקציה
startServer();
