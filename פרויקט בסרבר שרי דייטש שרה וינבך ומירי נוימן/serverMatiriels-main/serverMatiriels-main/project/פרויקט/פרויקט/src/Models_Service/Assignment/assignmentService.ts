import { Isubmission, submissionModel } from "../Submission/submissionModel";
import mongoose from "mongoose";

// 1. יצירת הגשה חדשה (עבור תלמיד)
export const createSubmission = async (submissionData: Partial<Isubmission>) => {
    try {
        const newSubmission = new submissionModel(submissionData);
        const savedSubmission = await newSubmission.save();
        
        // תיעוד הפעולה כפי שנדרש בהנחיות (סעיף 4.1.5)
        console.log(`[Log]: New submission added to the system for student ID: ${submissionData.studentId}`);
        
        return savedSubmission;
    } catch (error) {
        throw error;
    }
};

// 2. צפייה בכל ההגשות (עבור מורה) - כולל populate כנדרש
export const getAllSubmissions = async () => {
    try {
        // שימוש ב-populate על studentId ו-assignmentId כפי שנדרש (סעיף 3.ב)
        return await submissionModel.find()
            .populate('studentId', 'name email') // מביא רק שם ואימייל מהמשתמש
            .populate('assignmentId', 'title dueDate');
    } catch (error) {
        throw error;
    }
};

// 3. מתן ציון ומשוב להגשה ספציפית (עבור מורה)
export const gradeSubmission = async (studentId: string, assignmentId: string, grade: number, feedback: string) => {
    try {
        const updatedSubmission = await submissionModel.findOneAndUpdate(
            { 
                studentId: new mongoose.Types.ObjectId(studentId), 
                assignmentId: new mongoose.Types.ObjectId(assignmentId) 
            },
            { grade, feedback },
            { new: true } // מחזיר את האובייקט המעודכן
        );

        if (!updatedSubmission) {
            const error: any = new Error("Submission not found");
            error.status = 404;
            throw error;
        }

        return updatedSubmission;
    } catch (error) {
        throw error;
    }
};

// 4. צפייה בהגשות של תלמיד ספציפי (כולל חיפוש כשותף - partner)
export const getMySubmissions = async (userId: string) => {
    try {
        const studentObjectId = new mongoose.Types.ObjectId(userId);
        
        // חיפוש הגשות שבהן המשתמש הוא המגיש הראשי או השותף (סעיף 3.ג)
        return await submissionModel.find({
            $or: [
                { studentId: studentObjectId },
                { partner: studentObjectId }
            ]
        }).populate('assignmentId');
    } catch (error) {
        throw error;
    }
};

export function getOpenAssignments() {
    throw new Error('Function not implemented.');
}
