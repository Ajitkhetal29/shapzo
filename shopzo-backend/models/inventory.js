import mongoose from "mongoose";

const inventorySchema = new mongoose.Schema(
  {
    variant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Variant",
      required: true,
      index: true,
    },

    warehouse: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Warehouse",
      default: null,
    },

    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      default: null,
    },

    quantity: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },

    reserved: {
      type: Number,
      default: 0,
      min: 0,
    },

    locationType: {
      type: String,
      enum: ["warehouse", "vendor"],
      required: true,
    },
  },
  { timestamps: true }
);

// Validation: exactly one of warehouse or vendor must be set
inventorySchema.pre("validate", function (next) {
  const hasWarehouse = !!this.warehouse;
  const hasVendor = !!this.vendor;

  if (hasWarehouse && hasVendor) {
    return next(new Error("Inventory cannot be in both warehouse and vendor location"));
  }

  if (!hasWarehouse && !hasVendor) {
    return next(new Error("Inventory must be in either warehouse or vendor location"));
  }

  // Set locationType automatically
  this.locationType = hasWarehouse ? "warehouse" : "vendor";
  next();
});

// Indexes for fulfillment queries
inventorySchema.index({ variant: 1, locationType: 1 });
inventorySchema.index({ warehouse: 1 });
inventorySchema.index({ vendor: 1 });
inventorySchema.index({ variant: 1, quantity: 1 }); // For available stock queries

// Virtual for available quantity
inventorySchema.virtual("available").get(function () {
  return Math.max(0, this.quantity - this.reserved);
});

export default mongoose.model("Inventory", inventorySchema);