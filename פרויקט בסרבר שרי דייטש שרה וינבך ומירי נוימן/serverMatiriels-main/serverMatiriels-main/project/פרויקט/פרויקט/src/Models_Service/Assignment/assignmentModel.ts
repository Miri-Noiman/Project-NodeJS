import mongoose, { Schema } from "mongoose";

export interface Iuser {
  title: string;
  discription: string;
  dueDate: Date;
  createdDate: Date;
  isOpen?: boolean;
}

const userSchema = new Schema<Iuser>({
  title: { type: String, required: true, },
  discription: { type: String, required: true },
  dueDate: { type: Date, required: true },
  createdDate: { type: Date, required: true },
});

userSchema.virtual("isOpen").get(function () {
  let isOpen = true;
const open = this.dueDate.getTime() - this.createdDate.getTime();  if (open < 0) {
      isOpen=false;}
  return isOpen;
});

userSchema.set("toJSON", { virtuals: true });
export const userModel = mongoose.model<Iuser>("User", userSchema);
