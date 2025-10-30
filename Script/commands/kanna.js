const axios = require('axios');
const request = require('request');
const fs = require("fs");

module.exports.config = {
  name: "kanna",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Hridoy",
  description: "See random pictures of Kanna (cute anime dragon)",
  commandCategory: "random-images",
  usages: "kanna",
  cooldowns: 5
};

module.exports.run = async function({ api, event }) {
  try {
    const res = await axios.get('https://apikanna.khoahoang2.repl.co');
    const imageUrl = res.data.data;
    const count = res.data.count;
    const ext = imageUrl.substring(imageUrl.lastIndexOf(".") + 1);
    const filePath = __dirname + `/cache/kanna.${ext}`;

    const callback = () => {
      api.sendMessage({
        body: `🐉 Here's a cute Kanna image!\n📸 Total available: ${count}`,
        attachment: fs.createReadStream(filePath)
      }, event.threadID, () => fs.unlinkSync(filePath), event.messageID);
    };

    request(imageUrl)
      .pipe(fs.createWriteStream(filePath))
      .on("close", callback);

  } catch (error) {
    console.error(error);
    return api.sendMessage("❌ Failed to load image. Try again later.", event.threadID, event.messageID);
  }
};