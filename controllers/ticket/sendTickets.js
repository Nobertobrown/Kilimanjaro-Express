const Africastalking = require("africastalking")({
  apiKey: process.env.AFRICAS_TALKING_API, // use your sandbox app API key for development in the test environment
  username: "sandbox", // use 'sandbox' for development in the test environment
});

// Initialize a service e.g. SMS
const sms = Africastalking.SMS;

// TODO: Create and send ticket throught SMS
exports.sendTickets = (req, res) => {
  const sendSms = async () => {
    const options = {
      to: ["+255748281617"],
      message:
        "The current temperature is " +
        temperature +
        "degrees Celcius, it is " +
        description,
    };
    const res = await sms.send(options);
    console.log(res);
  };

  sendSms();
};
