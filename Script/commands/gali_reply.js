const fs = require("fs");
module.exports.config = {
	name: "gali",
    version: "1.0.1",
	hasPermssion: 0,
	credits: "𝐂𝐘𝐁𝐄𝐑 ☢️_𖣘 -𝐁𝐎𝐓 ⚠️ 𝑻𝑬𝑨𝑴_ ☢️", 
	description: "no prefix",
	commandCategory: "no prefix",
	usages: "abal",
    cooldowns: 5, 
};

module.exports.handleEvent = function({ api, event, client, __GLOBAL }) {
	var { threadID, messageID } = event;
	if (event.body.indexOf("Hridoy Bokachoda")==0 || event.body.indexOf("hridoy magi")==0 || event.body.indexOf("chod")==0 || event.body.indexOf("hridoy mc")==0 || event.body.indexOf("bc")==0 || event.body.indexOf("Hridoy re chudi")==0 || event.body.indexOf("madarchod hridoy")==0 || event.body.indexOf("Hridoy Abal")==0 || event.body.indexOf("Hridoy Boakachoda")==0 || event.body.indexOf("Hridoy madarchod")==0 || event.body.indexOf("Hridoy re chudi")==0 || event.body.indexOf("Kakashi Bokachoda")==0) {
		var msg = {
				body: "তোর মতো বোকাচোদা রে আমার বস হৃদয় চু*দা বাদ দিছে🤣\nহৃদয় এখন আর hetars চুষে না🥱😈",
			}
			api.sendMessage(msg, threadID, messageID);
		}
	}
	module.exports.run = function({ api, event, client, __GLOBAL }) {

  }
