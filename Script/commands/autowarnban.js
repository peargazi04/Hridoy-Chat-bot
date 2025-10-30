const fs = require("fs");
const { loadBans, saveBans } = require("./banlist.js");

const warnFile = __dirname + "/warnings.json";

// ============================
// ⚙️ CONFIGURATION
// ============================
const SPECIAL_IDS = [
  "100048786044500", // 🧠 এখানে তোমার, তোমার বন্ধু বা মালিকদের Facebook ID দাও
  "",
  ""
];

module.exports.config = {
  name: "autowarnban",
  version: "3.0.0",
  hasPermssion: 1,
  credits: "Hridoy + GPT Upgrade",
  description: "Auto warning (2x) then ban on 3rd violation with unban + special ID protection",
  commandCategory: "Admin",
  usages: "/warn @mention [reason] | /unban @mention",
  cooldowns: 3,
};

function loadWarnings() {
  if (!fs.existsSync(warnFile)) return {};
  return JSON.parse(fs.readFileSync(warnFile));
}
function saveWarnings(data) {
  fs.writeFileSync(warnFile, JSON.stringify(data, null, 2));
}

module.exports.run = async function ({ api, event, args }) {
  const warnings = loadWarnings();
  const bans = loadBans();
  const { threadID, mentions } = event;

  // 🧩 Unban Command
  if (args[0]?.toLowerCase() === "unban") {
    if (Object.keys(mentions).length === 0)
      return api.sendMessage("⚠️ কাকে unban করতে চাও সেটা mention করো!", threadID);

    const id = Object.keys(mentions)[0];
    const name = mentions[id].replace("@", "");

    if (!bans[id] || !bans[id].banned)
      return api.sendMessage(`ℹ️ ${name} ব্যান করা নেই!`, threadID);

    bans[id] = { warns: 0, banned: false, reason: null };
    saveBans(bans);
    warnings[id] = { warns: 0 };
    saveWarnings(warnings);

    return api.sendMessage(`✅ ${name} এখন Unban করা হয়েছে 🎉`, threadID);
  }

  // 🧩 Warn Command
  if (Object.keys(mentions).length === 0)
    return api.sendMessage("⚠️ কাকে Warning দিবে সেটা mention করো!", threadID);

  const reason = args.slice(1).join(" ") || "❌ কারণ উল্লেখ করা হয়নি";
  const id = Object.keys(mentions)[0];
  const name = mentions[id].replace("@", "");

  // 🛡️ Special ID Protection
  if (SPECIAL_IDS.includes(id)) {
    return api.sendMessage(
      `🛡️ ${name} একটি Special ID — এই ব্যক্তিকে Warning বা Ban দেওয়া যাবে না 😎`,
      threadID
    );
  }

  if (!warnings[id]) warnings[id] = { warns: 0 };
  if (!bans[id]) bans[id] = { name, banned: false, reason: null };

  if (bans[id].banned)
    return api.sendMessage(`🚫 ${name} ইতিমধ্যে ব্যান করা আছে!`, threadID);

  warnings[id].warns++;

  // ⚠️ 1st Warning
  if (warnings[id].warns === 1) {
    saveWarnings(warnings);
    return api.sendMessage(
      `⚠️ প্রথম Warning!\n👤 ${name}\n📄 কারণ: ${reason}\n❗ Warning Count: 1/3\n\n👉 সাবধান থাকো, ৩ বার warning পেলে ব্যান হবে 🚫`,
      threadID
    );
  }

  // ⚠️ 2nd Warning
  if (warnings[id].warns === 2) {
    saveWarnings(warnings);
    return api.sendMessage(
      `⚠️ দ্বিতীয় Warning!\n👤 ${name}\n📄 কারণ: ${reason}\n❗ Warning Count: 2/3\n\n⚠️ শেষ সুযোগ — আবার করলে ব্যান হয়ে যাবে 🚫`,
      threadID
    );
  }

  // 🚫 3rd Warning = BAN
  if (warnings[id].warns >= 3) {
    bans[id] = { name, banned: true, reason };
    saveBans(bans);
    warnings[id].warns = 0;
    saveWarnings(warnings);
    return api.sendMessage(
      `🚫 ${name} ব্যান করা হয়েছে!\n📄 কারণ: ${reason}\n\n⛔ তুমি ৩ বার Warning পেয়েছো, তাই এখন ব্যান।`,
      threadID
    );
  }
};

// 🔒 HandleEvent — banned user কিছু লিখলে reply দেবে
module.exports.handleEvent = async function ({ api, event }) {
  const bans = loadBans();
  const uid = event.senderID;

  if (bans[uid]?.banned) {
    api.sendMessage("🚫 তুমি ব্যান করা আছো, কিছু বলতে পারবে না!", event.threadID);
  }
};