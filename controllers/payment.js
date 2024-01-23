const axios = require("axios");

// Make payments
// TODO: Store payments made in the database for future use
exports.postMobilePayments = (req, res, next) => {
  const provider = req.body.provider;
  const accountNo = req.body.phoneNo;
  const amount = req.body.amount;

  const payload = {
    appName: process.env.APP_NAME,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
  };

  axios
    .post(
      `${process.env.AUTHENTICATOR_BASE_URL}/AppRegistration/GenerateToken`,
      payload,
      { headers: { "Content-Type": "application/json" } }
    )
    .then(({ data }) => {
      let result = data;
      if (result.statusCode == 423 || result.statusCode == 500) {
        const error = new Error(
          result.message ? result.message : "Internal Server Error!"
        );
        error.statusCode = result.statusCode;
        throw error;
      }
      const TOKEN = result.data.accessToken;

      const payload = {
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

      return axios.post(
        `${process.env.CHECKOUT_BASE_URL}/azampay/mno/checkout`,
        payload,
        { headers: headers }
      );
    })
    .then(({ data }) => {
      let result = data;
      if (result.status == 400 || result.status == 500) {
        const error = new Error(
          result.title ? result.title : "Internal Server Error!"
        );
        error.statusCode = res.statusCode;
        throw error;
      }
      res.status(200).json({ result: result });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.postBankPayments = (req, res, next) => {
  const amount = req.body.amount;
  const accountNo = req.body.accountNo;
  const phoneNo = req.body.phoneNo;
  const merchantName = req.body.merchant;
  const otp = req.body.otp;
  const provider = req.body.provider;

  const payload = {
    appName: process.env.APP_NAME,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
  };
  axios
    .post(
      `${process.env.AUTHENTICATOR_BASE_URL}/AppRegistration/GenerateToken`,
      payload,
      { headers: { "Content-Type": "application/json" } }
    )
    .then(({ data }) => {
      let result = data;
      if (result.statusCode == 423 || result.statusCode == 500) {
        const error = new Error(
          result.message ? result.message : "Internal Server Error!"
        );
        error.statusCode = result.statusCode;
        throw error;
      }

      const TOKEN = result.data.accessToken;
      const payload = {
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

      return axios.post(
        `${process.env.CHECKOUT_BASE_URL}/azampay/bank/checkout`,
        payload,
        { headers: headers }
      );
    })
    .then(({ data }) => {
      let result = data;
      if (result.status == 400 || result.status == 500) {
        const error = new Error(
          result.title ? result.title : "Internal Server Error!"
        );
        error.statusCode = res.statusCode;
        throw error;
      }
      res.status(200).json({ result: result });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
