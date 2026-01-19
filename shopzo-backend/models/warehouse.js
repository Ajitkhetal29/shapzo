import mongoose from "mongoose";

const wareHouseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    state: {
      type: String,
      required: true,
      trim: true,
    },
    zipCode: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: function (v) {
          return /^\d{5}(-\d{4})?$/.test(v);
        },
        message: "Invalid zip code format",
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const WareHouse = mongoose.model("WareHouse", wareHouseSchema);
export default WareHouse;
