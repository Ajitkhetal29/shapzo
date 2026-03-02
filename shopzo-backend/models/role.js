import mongoose from "mongoose";

const roleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },

    isActive: {
        type: Boolean,
        default: true,
    },
    department: {
        type:mongoose.Schema.Types.ObjectId,
        ref: "Department",
        required: true,
    },
  


}, { timestamps: true });
    
const Role = mongoose.model("Role", roleSchema);
export default Role;