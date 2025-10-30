module.exports.config = {
  name: "yes",
  version: "3.2.0",
  hasPermssion: 0,
  credits: "Hridoy Hossen",
  description: "Write your custom text on the Yes meme board",
  commandCategory: "Memes",
  usages: "[text]",
  cooldowns: 5,
  dependencies: {
    "canvas": "",
    "axios": "",
    "fs-extra": ""
  }
};

module.exports.wrapText = async (ctx, text, maxWidth) => {
  if (ctx.measureText(text).width < maxWidth) return [text];
  if (ctx.measureText("W").width > maxWidth) return null;

  const words = text.split(" ");
  const lines = [];
  let line = "";

  while (words.length > 0) {
    let split = false;
    while (ctx.measureText(words[0]).width >= maxWidth) {
      const temp = words[0];
      words[0] = temp.slice(0, -1);
      if (split) words[1] = temp.slice(-1) + words[1];
      else {
        split = true;
        words.splice(1, 0, temp.slice(-1));
      }
    }

    if (ctx.measureText(line + words[0]).width < maxWidth) {
      line += words.shift() + " ";
    } else {
      lines.push(line.trim());
      line = "";
    }

    if (words.length === 0) lines.push(line.trim());
  }
  return lines;
};

module.exports.run = async ({ api, event, args }) => {
  const { threadID, messageID } = event;
  const { loadImage, createCanvas } = require("canvas");
  const fs = global.nodemodule["fs-extra"];
  const axios = global.nodemodule["axios"];
  const pathImg = __dirname + "/cache/yes.png";

  try {
    const text = args.join(" ");
    if (!text)
      return api.sendMessage("✍️ কিছু লেখো যেটা বোর্ডে দিতে চাও!", threadID, messageID);

    // ✅ Background Image
    const imageURL = "https://i.ibb.co/GQbRhkY/Picsart-22-08-14-17-32-11-488.jpg";
    const response = await axios.get(imageURL, { responseType: "arraybuffer" });
    fs.writeFileSync(pathImg, Buffer.from(response.data, "utf-8"));

    const baseImage = await loadImage(pathImg);
    const canvas = createCanvas(baseImage.width, baseImage.height);
    const ctx = canvas.getContext("2d");

    ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#000000";
    ctx.textAlign = "start";
    ctx.font = "bold 35px Arial";

    const lines = await this.wrapText(ctx, text, 350);
    let y = 60;
    for (const line of lines) {
      ctx.fillText(line, 280, y);
      y += 45;
    }

    const imageBuffer = canvas.toBuffer();
    fs.writeFileSync(pathImg, imageBuffer);

    await api.sendMessage(
      { body: "🖋️ Here's your custom board:", attachment: fs.createReadStream(pathImg) },
      threadID,
      () => fs.unlinkSync(pathImg),
      messageID
    );
  } catch (err) {
    console.error(err);
    api.sendMessage("❌ কিছু একটা সমস্যা হয়েছে, আবার চেষ্টা করো!", threadID, messageID);
  }
};