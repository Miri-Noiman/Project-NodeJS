import mongoose, { Schema, Document } from 'mongoose';

export interface Isubmission extends Document{
    assignmentId: mongoose.Types.ObjectId;
    studentId:  mongoose.Types.ObjectId;
    githubLink: string;
    partner?: mongoose.Types.ObjectId;
    grade?: number;
    feedback?: string;
    isGraded?: boolean;
}

const submissionSchema = new mongoose.Schema<Isubmission>({
    assignmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Assignment', required: true },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    githubLink: { type: String, required: true },
    partner: { type: Schema.Types.ObjectId, ref: 'User' },
    grade: { type: Number },
    feedback: { type: String },
}, 
  { toJSON: { virtuals: true }, toObject: { virtuals: true } });


submissionSchema.virtual('isGraded').get(function () {
    return this.grade != null;
});

export const submissionModel = mongoose.model<Isubmission>('Submission', submissionSchema);