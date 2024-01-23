exports.callback = () => {
  const data = {
    msisdn: "0178823",
    amount: "2000",
    message: "any message",
    utilityref: "1292-123",
    operator: "Tigo",
    reference: "123-123",
    transactionstatus: "success",
    submerchantAcc: "01723113",
  };
  const headers = { "Content-Type": "application/json" };
  fetch(`${process.env.CHECKOUT_BASE_URL}/api/v1/Checkout/Callback`, {
    method: "POST",
    headers,
    body: data,
  })
    .then((res) => {
      /* response */
    })
    .catch((err) => {
      /* error */
    });
};
