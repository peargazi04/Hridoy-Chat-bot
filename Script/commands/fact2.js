module.exports.config = {
  name: "fact2",
  version: "2.0.0",
  hasPermssion: 0,
  credits: "Hridoy Hossen",
  description: "Generate a fun fact image with custom text",
  commandCategory: "Image",
  usages: "fact2 [your text]",
  cooldowns: 2,
  dependencies: {
    "fs-extra": "",
    "request": ""
  }
};

module.exports.run = async ({ api, event, args }) => {
  const fs = require("fs-extra");
  const request = require("request");
  const { threadID, messageID } = event;

  const text = args.join(" ").trim();
  if (!text) {
    return api.sendMessage("⚠️ Please provide some text to generate the fact image.", threadID, messageID);
  }

  const imagePath = __dirname + "/cache/fact2.png";
  const apiUrl = encodeURI(`https://api.popcat.xyz/facts?text=${text}`);

  const callback = () => {
    api.sendMessage(
      { body: "🧠 Here's your fact image!", attachment: fs.createReadStream(imagePath) },
      threadID,
      () => fs.unlinkSync(imagePath),
      messageID
    );
  };

  try {
    request(apiUrl)
      .pipe(fs.createWriteStream(imagePath))
      .on("close", callback);
  } catch (error) {
    console.error("fact2 command error:", error);
    return api.sendMessage("❌ Failed to create fact image. Please try again later.", threadID, messageID);
  }
};