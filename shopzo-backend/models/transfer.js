import mongoose from "mongoose";

const transferItemSchema = new mongoose.Schema({
  variant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Variant",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
});

const transferSchema = new mongoose.Schema(
  {
    transferNumber: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },

    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      required: true,
      index: true,
    },

    warehouse: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Warehouse",
      required: true,
      index: true,
    },

    items: [transferItemSchema],

    status: {
      type: String,
      enum: ["pending", "in_transit", "received", "partially_received", "rejected"],
      default: "pending",
      index: true,
    },

    receivedQuantity: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true }
);

// Indexes
transferSchema.index({ vendor: 1, status: 1 });
transferSchema.index({ warehouse: 1, status: 1 });
transferSchema.index({ transferNumber: 1 });

const Transfer = mongoose.model("Transfer", transferSchema);
export default Transfer;
