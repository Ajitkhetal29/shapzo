import mongoose from "mongoose";

const permissionSchema = new mongoose.Schema({
    role: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role",
        required: true,
    },
    permissions: {
        type: [String],
        required: true,
    },
}, { timestamps: true });

const Permission = mongoose.model("Permission", permissionSchema);
export default Permission;