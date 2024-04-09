const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const reservationSchema = new Schema(
  {
    route: {
      type: Schema.Types.ObjectId,
      ref: "Route",
      required: true,
    },
    customers: [
      {
        name: { type: String, required: true },
        gender: { type: String, required: true },
        seatNo: { type: String, required: true },
        age: { type: String },
        email: { type: String },
      },
    ],
    phoneNo: {
      type: String,
      required: true,
    },
    fare: {
      type: String,
      required: true,
    },
    // pickup: {
    //   type: String,
    //   required: true,
    // },
    // dropout: {
    //   type: String,
    //   required: true,
    // },
    status: {
      type: String, //Paid, Incomplete, pending
      required: true,
      default: "pending",
    },
    transactionId: {
      type: String,
      required: true,
    },
    transactionInfo: {
      type: Object,
    },
    description: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Reservation", reservationSchema);
