module.exports.config = {
  name: "🌍",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Hridoy Hossen",
  description: "Send best Islamic video when someone types 🌍",
  commandCategory: "noprefix",
  usages: "🌍",
  cooldowns: 5,
  dependencies: {
    "request": "",
    "fs-extra": "",
    "axios": ""
  }
};

module.exports.handleEvent = async ({ api, event }) => {
  const triggers = ["🌍", "🌎", "🌏", "🌐", "world"];
  if (!triggers.some(t => event.body && event.body.toLowerCase().startsWith(t))) return;

  const axios = global.nodemodule["axios"];
  const request = global.nodemodule["request"];
  const fs = global.nodemodule["fs-extra"];

  const link = [
    "https://i.imgur.com/O9JDYv0.mp4"
  ];

  const PREFIX = global.config.PREFIX || "/";
  const BOTNAME = global.config.BOTNAME || "Islamick Chat";
  const timeStart = Date.now();
  const uptime = process.uptime();

  const hours = Math.floor(uptime / 3600);
  const minutes = Math.floor((uptime % 3600) / 60);
  const seconds = Math.floor(uptime % 60);

  const callback = () => api.sendMessage({
    body: `•—»✨[ 𝐏𝐫𝐞𝐟𝐢𝐱 𝐄𝐯𝐞𝐧𝐭 ]✨«—•
•┄┅════❁🌺❁════┅┄•

আল্লাহ যে কতোটা মহান তুমি মহাকাশ দেখলেই বুঝতে পারবে ইনশাআল্লাহ 🌺✨🌏 

•┄┅════❁🌺❁════┅┄•
•—»✨[ 𝙆𝙖𝙜𝙪𝙮𝙖 Ō𝙩𝙨𝙪𝙩𝙨𝙪𝙠𝙞 ]✨«—•
[🐰] → 𝗣𝗿𝗲𝗳𝗶𝘅 : ${PREFIX}
[🫰] 𝐍𝐎𝐏𝐑𝐄𝐅𝐈𝐗 : 🌍
[⌛] 𝐔𝐩𝐭𝐢𝐦𝐞: ${hours}h ${minutes}m ${seconds}s
[🍒] 𝐁𝐨𝐭 𝐍𝐚𝐦𝐞 : ${BOTNAME}
[⚡] 𝐏𝐢𝐧𝐠: ${Date.now() - timeStart}ms`,
    attachment: fs.createReadStream(__dirname + "/cache/islamic.mp4")
  }, event.threadID, () => fs.unlinkSync(__dirname + "/cache/islamic.mp4"), event.messageID);

  return request(encodeURI(link[Math.floor(Math.random() * link.length)])).pipe(fs.createWriteStream(__dirname + "/cache/islamic.mp4")).on("close", callback);
};

module.exports.languages = {
  "en": {
    "on": "🌍 feature enabled.",
    "off": "🌍 feature disabled.",
    "successText": "✅"
  }
};

module.exports.run = async ({ event, api, Threads, getText }) => {
  const { threadID, messageID } = event;
  let data = (await Threads.getData(threadID)).data;
  if (typeof data["🌍"] == "undefined" || data["🌍"] == true) data["🌍"] = false;
  else data["🌍"] = true;
  await Threads.setData(threadID, { data });
  global.data.threadData.set(threadID, data);
  api.sendMessage(`${(data["🌍"] == false) ? getText("off") : getText("on")} ${getText("successText")}`, threadID, messageID);
};