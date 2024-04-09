const axios = require("axios");

const postBankPayments = async (d) => {
  const amount = d.amount;
  const accountNo = d.accountNo;
  const phoneNo = d.phoneNo;
  const merchantName = d.merchant;
  const otp = d.otp;
  const provider = d.provider;

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
        result.message ? result.message : "Error while generating token!"
      );
      error.statusCode = result.statusCode;
      return error;
    }

    const TOKEN = result.data.accessToken;
    const transPayload = {
      amount: amount,
      currencyCode: "TZS",
      merchantAccountNumber: accountNo,
      merchantMobileNumber: phoneNo,
      merchantName: merchantName,
      otp: otp,
      provider: provider,
      referenceId: "007",
    };
    const headers = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + TOKEN,
    };

    const transactionResponse = axios.post(
      `${process.env.CHECKOUT_BASE_URL}/azampay/bank/checkout`,
      transPayload,
      { headers: headers }
    );

    const transactionResult = transactionResponse.data;
    if (transactionResult.status == 400 || transactionResult.status == 500) {
      const error = new Error(
        transactionResult.title
          ? transactionResult.title
          : "Error occured while making bank payments!"
      );
      error.statusCode = res.statusCode;
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

module.exports = postBankPayments;
