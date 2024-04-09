const axios = require("axios");

const postMobilePayments = async (d) => {
  const provider = d.mno;
  const accountNo = d.phoneNo;
  const amount = d.amount;

  try {
    const payload = {
      appName: process.env.APP_NAME,
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
    };

    const response = await axios.post(
      `${process.env.AUTHENTICATOR_BASE_URL}/AppRegistration/GenerateToken`,
      payload,
      { headers: { "Content-Type": "application/json" } }
    );

    const result = response.data;
    if (result.statusCode == 423 || result.statusCode == 500) {
      const error = new Error(
        result.message
          ? result.message
          : "Error occured while generating token!"
      );
      error.statusCode = result.statusCode;
      return error;
    }
    const TOKEN = result.data.accessToken;

    const transPayload = {
      accountNumber: accountNo,
      amount: amount,
      currency: "TZS",
      externalId: "007",
      provider: provider,
    };

    const headers = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + TOKEN,
    };

    const transactionResponse = await axios.post(
      `${process.env.CHECKOUT_BASE_URL}/azampay/mno/checkout`,
      transPayload,
      { headers: headers }
    );

    const transactionResult = transactionResponse.data;
    if (transactionResult.status == 400 || transactionResult.status == 500) {
      const error = new Error(
        transactionResult.title
          ? transactionResult.title
          : "Error occured while making payments!"
      );
      error.statusCode = transactionResult.statusCode;
      return error;
    }

    return transactionResult;
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    return err;
  }
};

module.exports = postMobilePayments;
