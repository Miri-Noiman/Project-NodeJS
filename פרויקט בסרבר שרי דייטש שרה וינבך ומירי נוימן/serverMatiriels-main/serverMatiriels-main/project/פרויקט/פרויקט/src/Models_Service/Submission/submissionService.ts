import { submissionModel, Isubmission } from "./submissionModel";


import mongoose from "mongoose";

export const createSubmission = async (submissionData: any) => {
    try {
        const newSubmission = new submissionModel({
            assignmentId: submissionData.assignmentId,
            studentId: submissionData.studentId,
            githubLink: submissionData.githubLink
        });
        const savedSubmission = await newSubmission.save();
        // תיעוד הפעולה כפי שנדרש בהנחיות (סעיף 4.1.5)
        console.log(`[Log]: New submission added to the system for student ID: ${submissionData.studentId}`);
        
        return savedSubmission;
    } catch (error) {
        throw error;
    }
};

// 2. צפייה בכל ההגשות (עבור מורה) - כולל populate כנדרש
// בתוך submissionService.ts
export const getAllSubmissions = async () => {
    return await submissionModel.find()
    .populate({ path: 'studentId', model: 'User' })
    .populate({ path: 'assignmentId', model: 'Assignment' });
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
        // חיפוש לפי ה-ID כמחרוזת (כפי שזה מופיע ב-POST שלך)
        return await submissionModel.find({
            $or: [
                { studentId: userId }, 
                { partner: userId }
            ]
        }); // מחקנו את ה-.populate('assignmentId')
    } catch (error) {
        throw error;
    }
};
export const getAverages = async () => {
    const stats = await submissionModel.aggregate([ 
        {
            $group: {
                _id: "$assignmentId",
                averageGrade: { $avg: "$grade" },
                count: { $sum: 1 }
            }
        }
    ]);
    return stats;
};
