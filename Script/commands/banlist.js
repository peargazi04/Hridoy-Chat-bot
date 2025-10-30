const fs = require("fs");
const banFile = __dirname + "/banlist.json";

module.exports.config = {
  name: "banlist",
  version: "1.0.0",
  hasPermssion: 1,
  credits: "Hridoy + GPT Upgrade",
  description: "Shows and manages ban list",
  commandCategory: "Admin",
  usages: "/banlist | /banlist clear",
  cooldowns: 3,
};

function loadBans() {
  if (!fs.existsSync(banFile)) return {};
  return JSON.parse(fs.readFileSync(banFile));
}

function saveBans(data) {
  fs.writeFileSync(banFile, JSON.stringify(data, null, 2));
}

module.exports.run = async ({ api, event, args }) => {
  const data = loadBans();

  if (args[0] === "clear") {
    fs.writeFileSync(banFile, JSON.stringify({}, null, 2));
    return api.sendMessage("✅ সব ব্যান ডেটা মুছে ফেলা হয়েছে!", event.threadID);
  }

  const bannedUsers = Object.entries(data).filter(([id, info]) => info.banned);
  if (bannedUsers.length === 0)
    return api.sendMessage("😄 কোনো ইউজার বর্তমানে ব্যান করা নেই।", event.threadID);

  const list = bannedUsers
    .map(([id, info], i) => `${i + 1}. ${info.name || id} — কারণ: ${info.reason}`)
    .join("\n");

  return api.sendMessage(`🚫 ব্যানকৃত ইউজারদের তালিকা:\n\n${list}`, event.threadID);
};

module.exports.loadBans = loadBans;
module.exports.saveBans = saveBans;