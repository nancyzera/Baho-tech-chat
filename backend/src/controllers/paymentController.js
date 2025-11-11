import axios from "axios";

export const createPayment = async (req, res) => {
  const { userId, amount } = req.body;

  try {
    const response = await axios.post("https://api.paywall.io/v1/payments", {
      amount,
      currency: "USD",
      description: "Baho Chat Subscription"
    }, {
      headers: { Authorization: `Bearer ${process.env.PAYWALL_API_KEY}` }
    });

    res.json({
      message: "Payment created successfully",
      link: response.data.payment_url
    });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ message: "Payment failed" });
  }
};
