import mongoose, { Schema } from "mongoose";

export interface Iuser {
  userId: string;
  name: string;
  email: string;
  password: string;
  role: 'Student' | 'Teacher';
}

const userSchema = new Schema<Iuser>({
  userId: { type: String, required: true, },//mongo db עושה את זה ייחודי אוטומטי
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true, enum: ['Student', 'Teacher'] }
});

userSchema.set("toJSON", { virtuals: true });
export const userModel = mongoose.model<Iuser>("User", userSchema);
