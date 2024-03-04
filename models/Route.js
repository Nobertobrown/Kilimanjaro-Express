const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const routeSchema = new Schema(
  {
    bus: {
      type: Schema.Types.ObjectId,
      ref: "Bus",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    origin: {
      type: String,
      required: true,
    },
    destination: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    time: {
      type: Date,
      required: true,
      set: (value) => {
        const [hours, minutes] = value.split(":").map(Number);
        const date = new Date();
        date.setHours(hours);
        date.setMinutes(minutes);
        return date;
      },
    },
    duration: {
      type: String,
      required: true,
    },
    cost: {
      type: String,
      required: true,
    },
    reservations: [
      {
        type: Schema.Types.ObjectId,
        ref: "Reservation",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Route", routeSchema);
