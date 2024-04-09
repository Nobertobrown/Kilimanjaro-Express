const Africastalking = require("africastalking")({
  apiKey: process.env.AFRICAS_TALKING_API,
  username: process.env.AFRICAS_TALKING_USER,
});

// Initialize a service e.g. SMS
const sms = Africastalking.SMS;

const sendTicket = async (data) => {
  try {
    const options = {
      to: [data.phoneNo],
      message:data.msg,
    };
    const res = await sms.send(options);
    return res;
  } catch (error) {
    return error
  }
};

module.exports = sendTicket;