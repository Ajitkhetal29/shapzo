import mongoose from "mongoose";

const inventoryTransferSchema = new mongoose.Schema(
  {
    // 🔹 Variant
    variant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Variant",
      required: true,
      index: true,
    },

    // 🔹 Total Sent Quantity
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    // 🔹 From (Sender)
    fromType: {
      type: String,
      enum: ["vendor", "warehouse"],
      required: true,
    },

    fromId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },

    // 🔹 To (Receiver)
    toType: {
      type: String,
      enum: ["vendor", "warehouse"],
      required: true,
    },

    toId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },

    // 🔹 Status Flow
    status: {
      type: String,
      enum: [
        "initiated",
        "approved",
        "shipped",
        "delivered",
        "completed",
        "cancelled",
        "rejected",
        "issue_reported"
      ],
      default: "initiated",
      index: true,
    },

    // 🔹 Quantity Breakdown (🔥 IMPORTANT)
    receivedQuantity: {
      type: Number,
      default: 0,
    },

    acceptedQuantity: {
      type: Number,
      default: 0,
    },

    damagedQuantity: {
      type: Number,
      default: 0,
    },

    missingQuantity: {
      type: Number,
      default: 0,
    },

    // 🔥 Issue Handling
    issue: {
      isIssue: {
        type: Boolean,
        default: false,
      },

      reason: {
        type: String,
        enum: ["damaged", "missing", "extra", "partial"],
      },

      note: String,

      images: [String],

      issueQuantity: {
        type: Number,
        default: 0,
      },

      resolutionType: {
        type: String,
        enum: ["return", "replace", "adjust"],
      },

      /** unset until an issue is opened; avoids enum rejecting null in Mongoose */
      status: {
        type: String,
        enum: ["pending", "in_progress", "resolved"],
      },
    },

    // 🔹 Timeline
    initiatedAt: {
      type: Date,
      default: Date.now,
    },

    approvedAt: Date,
    shippedAt: Date,
    deliveredAt: Date,
    completedAt: Date,
    cancelledAt: Date,
    rejectedAt: Date,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("InventoryTransfer", inventoryTransferSchema);