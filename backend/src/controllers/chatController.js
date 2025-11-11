import { sendToFlowXO } from "../utils/flowxo.js";

export const sendMessage = async (req, res) => {
  const { message } = req.body;

  try {
    const botResponse = await sendToFlowXO(message);
    res.json({
      userMessage: message,
      botResponse
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Chat failed" });
  }
};
