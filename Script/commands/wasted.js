module.exports.config = {
  name: "wasted",
  version: "1.1.0",
  hasPermssion: 0,
  credits: "Hridoy Hossen",
  description: "Send a GTA Wasted effect on user’s profile picture 🎮",
  commandCategory: "Fun",
  cooldowns: 3,
  dependencies: {
    "axios": "",
    "fs-extra": ""
  }
};

module.exports.run = async function ({ api, event, args }) {
  const fs = require("fs-extra");
  const axios = require("axios");
  const path = require("path");

  const cacheDir = path.join(__dirname, "cache");
  if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);

  let uid;

  // ✅ Reply, Mention, or Self detection
  if (event.type === "message_reply") {
    uid = event.messageReply.senderID;
  } else if (Object.keys(event.mentions).length > 0) {
    uid = Object.keys(event.mentions)[0];
  } else {
    uid = event.senderID;
  }

  const avatarPath = path.join(cacheDir, "avatar.png");
  const resultPath = path.join(cacheDir, "wasted.png");

  try {
    // ✅ Step 1: Download Facebook profile picture
    const avatarRes = await axios.get(
      `https://graph.facebook.com/${uid}/picture?height=512&width=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`,
      { responseType: "arraybuffer" }
    );
    fs.writeFileSync(avatarPath, Buffer.from(avatarRes.data, "binary"));

    // ✅ Step 2: Apply Wasted Effect
    const apiUrl = `https://api.popcat.xyz/wasted?image=${encodeURIComponent("https://graph.facebook.com/" + uid + "/picture?width=512&height=512")}`;
    const wastedRes = await axios.get(apiUrl, { responseType: "arraybuffer" });
    fs.writeFileSync(resultPath, Buffer.from(wastedRes.data, "binary"));

    // ✅ Step 3: Send result
    await api.sendMessage(
      {
        body: "💀 তুমি এখন অফিসিয়