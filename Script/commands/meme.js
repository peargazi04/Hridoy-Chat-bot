module.exports.config = {
  name: "meme",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "Hridoy",
  description: "Send a random funny meme image",
  commandCategory: "Image",
  usages: "meme",
  cooldowns: 5,
  dependencies: {
    "request": "",
    "fs-extra": "",
    "axios": ""
  }
};

module.exports.run = async ({ api, event, Currencies }) => {
  const axios = global.nodemodule["axios"];
  const request = global.nodemodule["request"];
  const fs = global.nodemodule["fs-extra"];

  // ✅ Meme image list
  const links = [
    "https://i.imgur.com/zoQxUwC.jpg",
    "https://i.imgur.com/bXVBasN.jpg",
    "https://i.imgur.com/E3bMZMM.jpg",
    "https://i.imgur.com/PFV6etU.jpg",
    "https://i.imgur.com/6hufzML.jpg",
    "https://i.imgur.com/wfB1cU7.jpg",
    "https://i.imgur.com/RqaTxa4.jpg",
    "https://i.imgur.com/BcjRdU8.jpg",
    "https://i.imgur.com/ZfnJQHj.jpg",
    "https://i.imgur.com/TmfIRv5.jpg",
    "https://i.imgur.com/EHD734u.jpg",
    "https://i.imgur.com/4nFOS0w.jpg"
  ];

  const userData = await Currencies.getData(event.senderID);
  const money = userData.money || 0;

  // 💰 Cost check
  if (money < 200) {
    return api.sendMessage("❌ এই কমান্ড ব্যবহার করতে তোমার অন্তত 200$ দরকার!", event.threadID, event.messageID);
  }

  // Random meme select
  const randomLink = links[Math.floor(Math.random() * links.length)];
  const filePath = __dirname + "/cache/meme.jpg";

  // Deduct small amount if you want
  await Currencies.setData(event.senderID, { money: money - 200 });

  // Download and send image
  const callback = () => {
    api.sendMessage({
      body: `😂 Here's your random meme!\n\n📸 Total Memes: ${links.length}\n💵 200$ deducted from your balance.`,
      attachment: fs.createReadStream(filePath)
    }, event.threadID, () => fs.unlinkSync(filePath), event.messageID);
  };

  request(encodeURI(randomLink))
    .pipe(fs.createWriteStream(filePath))
    .on("close", callback);
};
