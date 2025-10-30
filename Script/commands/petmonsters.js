const economy = require("./Economy.js");

module.exports.config = {
  name: "petmonsters",
  version: "2.0",
  hasPermssion: 0,
  credits: "𝐇𝐑𝐈𝐃𝐎𝐘 𝐇𝐎𝐒𝐒𝐄𝐍",
  description: "Adopt, train & battle monsters with Economy sync 🐾",
  commandCategory: "game",
  usages: "[buy/train/battle]",
  cooldowns: 5
};

const monsters = {
  pikachu: { price: 3000, power: 10 },
  bulbasaur: { price: 4000, power: 15 },
  charmander: { price: 5000, power: 20 },
};

module.exports.run = async function ({ api, event, args, Users }) {
  const { threadID, senderID } = event;
  const action = args[0];
  const name = await Users.getNameUser(senderID);

  if (!action)
    return api.sendMessage("🐾 ব্যবহার করুন: petmonsters buy/train/battle", threadID);

  const userData = economy.getUserData(senderID);

  if (action === "buy") {
    const monsterName = args[1]?.toLowerCase();
    if (!monsterName || !monsters[monsterName])
      return api.sendMessage("❗ সঠিক মনস্টারের নাম দিন: pikachu | bulbasaur | charmander", threadID);

    const monster = monsters[monsterName];
    if (economy.getBalance(senderID) < monster.price)
      return api.sendMessage("😢 পর্যাপ্ত কয়েন নেই!", threadID);

    economy.subtractBalance(senderID, monster.price);
    userData.pet = { name: monsterName, power: monster.power };
    economy.saveUserData(senderID, userData);

    return api.sendMessage(`🎉 ${name}, তুমি ${monsterName} কিনেছো ${monster.price} কয়েনে!`, threadID);
  }

  if (action === "train") {
    if (!userData.pet)
      return api.sendMessage("🐾 আগে একটা মনস্টার কিনো!", threadID);

    userData.pet.power += 5;
    economy.saveUserData(senderID, userData);
    return api.sendMessage(`💪 তোমার ${userData.pet.name} এখন আরও শক্তিশালী! Power: ${userData.pet.power}`, threadID);
  }

  if (action === "battle") {
    if (!userData.pet)
      return api.sendMessage("⚔️ আগে একটি মনস্টার কিনো!", threadID);

    const win = Math.random() < 0.5;
    if (win) {
      const reward = 1000;
      economy.addBalance(senderID, reward);
      return api.sendMessage(`🏆 ${userData.pet.name} জিতেছে! তুমি পেয়েছো ${reward} কয়েন 💰`, threadID);
    } else {
      const loss = 500;
      economy.subtractBalance(senderID, loss);
      return api.sendMessage(`😞 ${userData.pet.name} হেরে গেছে... ${loss} কয়েন হারিয়েছো!`, threadID);
    }
  }
};