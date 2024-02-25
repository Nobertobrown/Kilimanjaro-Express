const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const busSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    plateNo: {
      type: String,
      required: true,
    },
    seats: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    amenities: Array,
    categories: Array,
    routes: [
      {
        type: Schema.Types.ObjectId,
        ref: "Route",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Bus", busSchema);
