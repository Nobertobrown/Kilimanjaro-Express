const Reservation = require("../../models/Reservation");
const sendSms = require("../ticket/sendTickets");

const azamPesaWebhook = async (req, res, next) => {
  console.log(req.body)
  try {
    const payload = req.body;

    // Extract relevant information from the webhook payload
    const transactionId = payload.transid;
    const paymentStatus = payload.transactionstatus;
    const message = payload.message;
    const phoneNo = payload.msisdn;

    // Find the reservation associated with the transactionId
    const reservation = await Reservation.findOne({ transactionId: transactionId });

    if (!reservation) {
      // Handle the case where the transaction is not found
      return res.status(404).send("Transaction not found");
    }

    // Update reservation status based on payment status
    if (paymentStatus === "success") {
      // Update reservation status to 'paid'
      reservation.status = "paid";
      reservation.transactionInfo = payload;
      const res = await sendSms({phoneNo: phoneNo, msg: message})
      console.log("SMS sent response", res)
    } else if (paymentStatus === "failed") {
      // Update reservation status to 'payment_failed'
      reservation.status = "incomplete";
      const res = await sendSms({phoneNo: phoneNo, msg: message})
      console.log("SMS sent response", res)
    }

    // Save the updated reservation
    await reservation.save();

    // Respond to Azam Pesa API with success status
    res.status(200).send("Transaction processed successfully");
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

module.exports = azamPesaWebhook;