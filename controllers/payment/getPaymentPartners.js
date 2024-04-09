const axios = require("axios");

const getPaymentPartners = (req, res, next) => {
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

      const headers = {
        "Content-Type": "application/json",
        Authorization: "Bearer " + TOKEN,
      };

      return axios.get(
        `${process.env.CHECKOUT_BASE_URL}/api/v1/Partner/GetPaymentPartners`,
        { headers: headers }
      );
    })
    .then(({data}) => {
      res.status(200).json({partners: data})
    })
    .catch((err) => {
     if (!err.statusCode) {
       err.statusCode = 500;
     }
     return err;
    });
};

module.exports = getPaymentPartners;
