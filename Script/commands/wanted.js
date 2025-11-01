const axios = require("axios");
const fs = require("fs");
const Canvas = require("canvas");
const path = require("path");

module.exports.config = {
  name: "wanted",
  version: "2.1.0",
  hasPermssion: 0,
  credits: "Hridoy Khan + GPT",
  description: "Make a funny wanted poster for tagged or random user 😎",
  commandCategory: "fun",
  usages: "/wanted [@mention]",
  cooldowns: 5,
};

module.exports.run = async function ({ api, event, Users }) {
  try {
    const { threadID, messageID, mentions, participantIDs } = event;

    // ✅ Template Paths
    const onlineTemplate = "https://i.imgur.com/pbC3EwN.jpeg"; // online
    const localTemplate = path.join(__dirname, "../cache/wanted.jpg"); // local backup

    // ✅ Target selection
    let targetID;
    if (Object.keys(mentions).length > 0) {
      targetID = Object.keys(mentions)[0];
    } else {
      const randomIndex = Math.floor(Math.random() * participantIDs.length);
      targetID = participantIDs[randomIndex];
    }

    // 👤 Get avatar
    const avatarUrl = await Users.getAvatarUrl(targetID);

    // 🖼️ Load template (try online first)
    let bg;
    try {
      bg = await Canvas.loadImage(onlineTemplate);
    } catch {
      if (fs.existsSync(localTemplate)) {
        bg = await Canvas.loadImage(localTemplate);
      } else {
        return api.sendMessage("❌ Template image not found!", threadID);
      }
    }

    const avatar = await Canvas.loadImage(avatarUrl);
    const canvas = Canvas.createCanvas(bg.width, bg.height);
    const ctx = canvas.getContext("2d");

    // Draw template
    ctx.drawImage(bg, 0, 0, bg.width, bg.height);

    // 🎯 Profile placement (exact center of wanted frame)
    const x = 165;
    const y = 365;
    const w = 420;
    const h = 420;
    ctx.drawImage(avatar, x, y, w, h);

    // Save output
    const output = path.join(__dirname, "../cache/wanted_output.png");
    fs.writeFileSync(output, canvas.toBuffer());

    // 😹 Funny reasons (random pick)
    const reasons = [
      "💀 Crime: বেশি স্টাইল দেখানো আর কম কাজ করা!",
      "😂 Crime: অন্যের crush কে নিজের ভাবা!",
      "🔥 Crime: দিনরাত memes পাঠানো without reason!",
      "😈 Crime: প্রেমে বারবার ধরা খাওয়া!",
      "🤡 Crime: Group এ fake deep quote দেওয়া!",
      "🥴 Crime: প্রতিদিন ‘Hi baby’ পাঠানো!",
      "📱 Crime: ১০০টা গ্রুপে ‘gm’ দেওয়া!",
      "🐍 Crime: অন্যের কথা carry করা, snake confirmed!",
      "💸 Crime: লোন নিয়ে আর ফেরত না দেওয়া!",
      "🥵 Crime: সবাইকে 'ভাই জান' বলা!",
      "🦸 Crime: নিজেরই hero ভাবা without script!",
      "😤 Crime: Admin এর সাথে attitude মারা!",
      "👻 Crime: Ghost হয়ে ৩ দিন পর reply দেওয়া!",
      "🍔 Crime: অন্যের খাবার খেয়ে deny করা!",
      "🕵️ Crime: Crush এর DP zoom করে দেখা!",
      "🤣 Crime: অন্যের পোস্টে ‘ভাই জানু’ react দেওয়া!",
      "📞 Crime: কল দিয়ে চুপ থাকা ১০ মিনিট!",
      "🧠 Crime: brain.exe not responding since 2020!",
      "🐸 Crime: Meme বোঝে না তবু react দেয়!",
      "🎭 Crime: Fake ID দিয়ে প্রেম করা!",
      "🌚 Crime: Group এ random ‘Hi’ লেখা!",
      "🪞 Crime: প্রতিদিন mirror এর সামনে confession!",
      "🦄 Crime: Too much attitude with zero talent!",
      "🧛 Crime: রাত ৩টায় status দেয় ‘আমি ভালো নেই’!",
      "😹 Crime: Too funny to be free! Lock him up!"
    ];

    const msg = `🚨 *Wanted Notice Issued!* 🚨\n\n${reasons[Math.floor(Math.random() * reasons.length)]}`;

    // Send final
    return api.sendMessage(
      { body: msg, attachment: fs.createReadStream(output) },
      threadID,
      () => fs.unlinkSync(output),
      messageID
    );

  } catch (err) {
    console.error(err);
    return api.sendMessage("❌ কিছু একটা গন্ডগোল হয়েছে ভাই!", event.threadID);
  }
};
