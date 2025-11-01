const axios = require("axios");
const fs = require("fs");
const Canvas = require("canvas");

module.exports.config = {
  name: "wanted",
  version: "2.0.0",
  hasPermssion: 0,
  credits: "Hridoy Khan + GPT Hellfire",
  description: "Make a funny Wanted poster for tagged or random user 😎",
  commandCategory: "fun",
  usages: "/wanted [@mention]",
  cooldowns: 5,
};

module.exports.run = async function ({ api, event, Users }) {
  try {
    const { threadID, messageID, mentions, participantIDs } = event;
    const template = "https://i.imgur.com/pbC3EwN.jpeg"; // Wanted poster background

    // Mention না দিলে random একজন বাছাই করবে
    let targetID;
    if (Object.keys(mentions).length > 0) {
      targetID = Object.keys(mentions)[0];
    } else {
      const randomIndex = Math.floor(Math.random() * participantIDs.length);
      targetID = participantIDs[randomIndex];
    }

    // Profile picture আনবে
    const avatarUrl = await Users.getAvatarUrl(targetID);
    const bg = await Canvas.loadImage(template);
    const avatar = await Canvas.loadImage(avatarUrl);

    const canvas = Canvas.createCanvas(bg.width, bg.height);
    const ctx = canvas.getContext("2d");

    // Poster draw
    ctx.drawImage(bg, 0, 0, bg.width, bg.height);

    // Avatar positioning (poster অনুযায়ী ঠিক করা)
    const x = 190;
    const y = 430;
    const w = 460;
    const h = 460;

    ctx.drawImage(avatar, x, y, w, h);

    // Output save
    const path = __dirname + "/wanted.png";
    fs.writeFileSync(path, canvas.toBuffer());

    // Funny reasons
    const reasons = [
      "🍔 খাবার দেখলেই হারিয়ে যায় — বিশেষ করে ফ্রি খাবার!",
      "😂 গ্রুপে সবাইকে ট্যাগ করে পালিয়ে যায়!",
      "💤 দিনে ১৮ ঘণ্টা ঘুমায়, তারপরও বলে ‘আমি ক্লান্ত’।",
      "📱 চার্জ ১% থাকলেও TikTok দেখা বন্ধ করে না!",
      "🔥 মেয়েদের ইনবক্সে ‘Hi’ পাঠিয়ে গ্রেফতার!",
      "🐍 বন্ধুর গার্লফ্রেন্ডকে ভাই বলে DM করে!",
      "🤡 প্রতিদিন নতুন crush বানায়, পুরনো ভুলে যায়!",
      "🍟 দোকানে গিয়ে বলে ‘বাকি রাখেন ভাই, কাল দেব’।",
      "😈 সবাইকে বলে ‘আমি innocent’, কিন্তু evidence আছে!",
      "🎭 মুখে বলে শান্ত ছেলে, কিন্তু keyboard warrior!",
      "💀 নিজের meme-এ নিজে react দেয় — ৩টা 😆 emoji সহ!",
      "🐒 Mirror-এর সামনে pose দিতে গিয়ে selfie তে ভয় পায়!",
      "🕵️ রাতে ৩টায় মেসেজ দেয়: ‘ঘুমাওনি?’ – এবং নিজেই reply দেয়!",
      "💸 নিজের জন্মদিনে নিজের জন্য wish দেয়!",
      "📷 সেলফি তুলতে গিয়ে ফোন ফেলে ভেঙে ফেলে!",
      "🧠 Brain update পায়নি ২০১২ সাল থেকে!",
      "🪞 নিজের shadow-এর সাথে argue করে হারে!",
      "🚨 Emoji abuse-এর অপরাধে Wanted!",
      "🧃 Juice দোকানে বলে – ‘ভাই ২ টাকা কম দেন’।",
      "🐔 WiFi না থাকলে নিজেই router হতে চায়!",
      "🎬 Drama create করতে পারলে Netflix hire করত!",
      "🐍 বন্ধুর প্রেমে ‘advice’ দেয়, শেষে নিজের crush নেয়!",
      "🦸 নিজেকে superhero ভাবে, কিন্তু power নাই!",
      "😂 গ্রুপে শুধু ‘Hmm’ পাঠায়, কিছুই বোঝে না!",
      "🥴 শেষ দেখা গেছে – meme factory-র ভেতর!",
      "📞 কল ধরার সময় বলে ‘ভাই, চার্জ শেষ’, কিন্তু PUBG চালায়!",
      "🍕 Pizza না পেলে কাঁদে, burger পেলে গান গায়!",
      "🦟 মশার কামড় খেয়েও বলে ‘bite me more’!",
      "💻 পিসি চালু করে প্রথমে Chrome না, Facebook খোলে!",
      "🐢 তোর ইন্টারনেট স্পিড দেখে snail হেসে দিল!",
      "🚀 পরীক্ষায় ২ নাম্বার কমে গিয়ে থানায় report করেছে!",
      "🎤 গানের গলা এমন — autotune-ও বলেছে ‘আমি পারব না ভাই’!",
      "📚 বই খুলে প্রথমেই গন্ধ নেয়, পড়া শুরু হয় না!",
      "💔 প্রেমে পড়ে ‘status update’ দিয়ে পালিয়ে গেছে!",
      "🔋 ফোনের ব্যাটারি ১% — কিন্তু attitude ১০০%",
      "🤳 নিজের story তে নিজে react দেয়!",
      "🧦 দুইটা মোজা পরে স্কুলে যায়, একটা mismatched!",
      "🎮 গেম হারলে বলে ‘lag দিচ্ছে ভাই’!",
      "🌧️ বৃষ্টি দেখলেই caption দেয়: ‘old memories 😭’",
      "🚬 চা খেয়ে smoke effect দেয় mouth দিয়ে!",
      "🐕 কুকুরকে দেখলেই বলে – ‘ওই আমার বন্ধুর মতো!’",
      "💀 নিজের joke-এ নিজেই হেসে পড়ে যায়!",
      "🍿 সিনেমা দেখে crying emoji react দেয়!",
      "📱 ফোনে ৩টা wallpaper, কিন্তু সব নিজেরই selfie!",
      "🎯 কখনো target miss না করে, কারণ target-ই নেয় না!",
      "🚴 দৌড় প্রতিযোগিতায় হেঁটে অংশ নেয়!",
      "🦷 হাসলে WiFi disconnect হয়ে যায়!",
      "💼 CV-তে skill লিখেছে: ‘fast typing on Messenger’!",
      "🎓 স্কুলে প্রেজেন্টেশন দেয়: ‘Why I hate Mondays’",
      "🥶 Ice cream খেয়ে ঠান্ডা লাগে, তারপর status দেয়: RIP throat!",
      "😜 অযথা cool হওয়ার চেষ্টা করতে গিয়ে meme হয়ে যায়!",
      "🧃 দুধের প্যাকেটে লিখেছে – *WANTED for drinking directly!*",
    ];

    // Random reason + reward
    const reason = reasons[Math.floor(Math.random() * reasons.length)];
    const reward = Math.floor(Math.random() * 90000) + 10000; // ১০K–১০০K

    const message = `🧾 *WANTED NOTICE*\n\n💀 Crime: ${reason}\n💰 Reward: ${reward.toLocaleString()} কয়েন\n\n🚨 Report immediately if seen!`;

    return api.sendMessage(
      { body: message, attachment: fs.createReadStream(path) },
      threadID,
      () => fs.unlinkSync(path),
      messageID
    );
  } catch (err) {
    console.error(err);
    return api.sendMessage("❌ কিছু ভুল হয়েছে!", event.threadID);
  }
};