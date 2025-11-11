import axios from "axios";

export const sendToFlowXO = async (message) => {
  try {
    const response = await axios.post(process.env.FLOWXO_WEBHOOK_URL, {
      message
    });
    return response.data;
  } catch (error) {
    console.error("FlowXO error:", error.message);
    return { reply: "Error connecting to FlowXO" };
  }
};
