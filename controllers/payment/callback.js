const Reservation = require("../../models/Reservation");
const sendSms = require("../ticket/sendTickets");

const maxRetries = 3; // Maximum number of retries
const retryDelay = 1000; // Delay between retries in milliseconds (1 second in this example)

const azamPesaWebhook = async (req, res, next) => {
  try {
    const payload = req.body;

    // Extract relevant information from the webhook payload
    const transactionId = payload.transid;
    const paymentStatus = payload.transactionstatus;
    const message = payload.message;
    const phoneNo = payload.msisdn;

    // Define a function to handle the retrieval of reservation with retries
    const findReservationWithRetry = async (retries) => {
      try {
        // Attempt to find the reservation
        const reservation = await Reservation.findOne({
          transactionId: transactionId,
        });

        if (!reservation) {
          // Handle the case where the transaction is not found
          throw new Error("Transaction not found");
        }

        return reservation;
      } catch (error) {
        // Retry if there are retries left
        if (retries > 0) {
          console.log(`Retrying... Attempt ${maxRetries - retries + 1}`);
          await new Promise((resolve) => setTimeout(resolve, retryDelay)); // Delay before retrying
          return findReservationWithRetry(retries - 1);
        } else {
          throw error; // Max retries reached, propagate the error
        }
      }
    };

    // Find the reservation associated with the transactionId
    const reservation = await findReservationWithRetry(maxRetries);
    console.log("Found reservation", reservation);

    // Update reservation status based on payment status
    if (paymentStatus === "success") {
      // Update reservation status to 'paid'
      reservation.status = "paid";
      reservation.transactionInfo = payload;
      const res = await sendSms({ phoneNo: phoneNo, msg: message });
      console.log("SMS sent paid response", res);
    } else if (paymentStatus === "failed") {
      // Update reservation status to 'incomplete'
      reservation.status = "incomplete";
      const res = await sendSms({ phoneNo: phoneNo, msg: message });
      console.log("SMS sent incomplete response", res);
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
