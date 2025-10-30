module.exports.config = {
  name: "fact",
  version: "2.0.0",
  hasPermssion: 0,
  credits: "Hridoy Hossen",
  description: "Get a random fun fact",
  commandCategory: "Fun",
  cooldowns: 5
};

module.exports.run = async ({ api, event }) => {
  const axios = require("axios");
  try {
    const res = await axios.get("https://api.popcat.xyz/fact");
    const fact = res.data.fact;
    return api.sendMessage(`💡 Did you know?\n\n${fact}`, event.threadID, event.messageID);
  } catch (error) {
    console.error("❌ Fact command error:", error);
    return api.sendMessage("⚠️ Couldn't fetch a fact right now. Please try again later.", event.threadID, event.messageID);
  }
};