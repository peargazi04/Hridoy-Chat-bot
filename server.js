// server.js
// 💡 Simple, Clean & Stable Launcher for your bot

const { spawn } = require("child_process");
const express = require("express");
const path = require("path");
const app = express();

const PORT = process.env.PORT || 8080;
const MAIN_FILE = "main.js"; // 👉 তোমার বটের মেইন ফাইলের নাম দাও (যেমন index.js / main.js)

// 🟢 Express KeepAlive Server (for Render / UptimeRobot)
app.get("/", (req, res) => {
  res.send("✅ Bot server is running fine!");
});

app.listen(PORT, () => {
  console.log(`🌐 Server online on port ${PORT}`);
});

// 🔁 Function to start bot process
function startBot() {
  console.log("🚀 Starting the bot...\n");
  const bot = spawn("node", [MAIN_FILE], {
    cwd: __dirname,
    stdio: "inherit",
    shell: true,
  });

  // যদি বট বন্ধ হয়ে যায়, আবার চালু করো
  bot.on("close", (code) => {
    console.log(`⚠️ Bot exited with code ${code}`);
    console.log("🔄 Restarting bot in 5 seconds...\n");
    setTimeout(startBot, 5000);
  });

  // Error catch
  bot.on("error", (err) => {
    console.error("❌ Error while running bot:", err);
    console.log("Restarting in 10 seconds...\n");
    setTimeout(startBot, 10000);
  });
}

// প্রথমে বট চালাও
startBot();
