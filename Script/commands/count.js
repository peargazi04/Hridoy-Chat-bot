const limit = 20; // Number of members per page

module.exports.config = {
  name: "count",
  version: "1.8.1",
  hasPermssion: 0,
  credits: "Hridoy Khan",
  description: "Check group message interactions or ranking",
  commandCategory: "group",
  usages: "[all | tag | reply]",
  cooldowns: 5
};

module.exports.run = async function ({ args, Users, Threads, api, event, Currencies }) {
  const mention = Object.keys(event.mentions);
  const { threadID, senderID, type } = event;
  const threadInfo = (await Threads.getData(threadID)).threadInfo;
  const listUserID = threadInfo.participantIDs;
  const exp = [];

  // Fetch all users and their exp
  for (const idUser of listUserID) {
    const userData = await Users.getData(idUser);
    const countMess = await Currencies.getData(idUser);
    exp.push({
      name: userData?.name || "Unknown",
      exp: countMess?.exp || 0,
      uid: idUser
    });
  }

  // Sort by exp descending
  exp.sort((a, b) => b.exp - a.exp);

  // =============== CASE 1: "all" command ===============
  if (args[0] === "all") {
    let page = parseInt(args[1]) || 1;
    const numPage = Math.ceil(exp.length / limit);
    if (page < 1) page = 1;
    if (page > numPage) page = numPage;

    let msg = `🏆 Group Message Leaderboard 🏆\n\n`;
    for (let i = limit * (page - 1); i < limit * page && i < exp.length; i++) {
      const user = exp[i];
      msg += `${i + 1}. ${user.name} — ${user.exp} messages\n`;
    }

    msg += `\n📄 Page ${page}/${numPage}\n💡 Use "${global.config.PREFIX}count all [page]" to see more.`;
    return api.sendMessage(msg, threadID);
  }

  // =============== CASE 2: tag someone ===============
  let targetID = senderID;
  if (mention.length > 0) targetID = mention[0];
  if (type === "message_reply") targetID = event.messageReply.senderID;

  // Find rank
  const rank = exp.findIndex(u => u.uid === targetID) + 1;
  const infoUser = exp[rank - 1];
  const targetName = (await Users.getData(targetID))?.name || "Unknown";

  if (targetID === senderID && mention.length === 0 && type !== "message_reply") {
    return api.sendMessage(`🏅 You are ranked ${rank} with ${infoUser.exp} messages.`, threadID);
  } else {
    return api.sendMessage(`🏅 ${targetName} is ranked ${rank} with ${infoUser.exp} messages.`, threadID);
  }
};