//JotaroKujo0525 note, this is a deed that i should've done a long time ago
require('dotenv').config()

const DiscordMusicBot = require("./lib/DiscordMusicBot");
const { exec } = require("child_process");

if (process.env.REPL_ID) {
	console.log("Replit rendszer észlelve, speciális `unhandledRejection` eseményfigyelő indítása.")
	process.on('unhandledRejection', (reason, promise) => {
		promise.catch((err) => {
			if (err.status === 429) {
				console.log("Valami probléma történt a Discord Gateway-hez való csatlakozás során, újraindítás...");
				exec("kill 1");
			}
		});
	});
}

const client = new DiscordMusicBot();

console.log("A bot elindítása előtt feltétlenül töltse ki a config.js fájlt.");

const getClient = () => client;

module.exports = {
	getClient,
};
