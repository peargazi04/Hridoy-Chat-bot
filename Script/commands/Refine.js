const axios = require('axios');
const dipto = "https://www.noobs-api.rf.gd/dipto";

module.exports.config = {
  name: "refine",
  version: "7.0",
  hasPermssion: 1,
  credits: "Hridoy Hossen",
  description: "AI-based image editing — reply with a prompt to modify the image.",
  commandCategory: "AI",
  usages: "[prompt] (reply to an image)",
  cooldowns: 5,
};

async function handleEdit(api, event, args, waitMsgID = null) {
  const replyAttachment = event.messageReply?.attachments?.[0];
  const url = replyAttachment?.url;
  const prompt = args.join(" ") || "Enhance this image";

  if (!url || !replyAttachment.type?.startsWith("photo")) {
    if (waitMsgID) api.unsendMessage(waitMsgID);
    return api.sendMessage("❌ Please reply to a valid image!", event.threadID, event.messageID);
  }

  try {
    const apiUrl = `${dipto}/edit?url=${encodeURIComponent(url)}&prompt=${encodeURIComponent(prompt)}`;
    const response = await axios.get(apiUrl, {
      responseType: 'stream',
      validateStatus: () => true
    });

    // যদি রেসপন্স image হয়
    if (response.headers['content-type']?.startsWith('image/')) {
      if (waitMsgID) api.unsendMessage(waitMsgID);
      return api.sendMessage(
        { body: `✨ Refined result for: "${prompt}"`, attachment: response.data },
        event.threadID,
        event.messageID
      );
    }

    // যদি রেসপন্স JSON হয়
    let rawData = '';
    for await (const chunk of response.data) rawData += chunk.toString();

    try {
      const json = JSON.parse(rawData);
      if (json?.response) {
        if (waitMsgID) api.unsendMessage(waitMsgID);
        return api.sendMessage(json.response, event.threadID, event.messageID);
      }
    } catch {
      // ignore invalid JSON
    }

    if (waitMsgID) api.unsendMessage(waitMsgID);
    return api.sendMessage("⚠️ No valid response received from API.", event.threadID, event.messageID);

  } catch (err) {
    console.error("🔴 Refine error:", err.message);
    if (waitMsgID) api.unsendMessage(waitMsgID);
    return api.sendMessage("❌ Something went wrong while refining. Try again later.", event.threadID, event.messageID);
  }
}

module.exports.run = async ({ api, event, args }) => {
  if (!event.messageReply) {
    return api.sendMessage("📷 Please reply to an image with your editing prompt!", event.threadID, event.messageID);
  }

  api.sendMessage("⏳ Processing your image, please wait...", event.threadID, async (err, info) => {
    if (err) return;
    await handleEdit(api, event, args, info.messageID);
  }, event.messageID);
};