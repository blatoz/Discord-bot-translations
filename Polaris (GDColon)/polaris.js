const Discord = require("discord.js")
require('dotenv').config();

const token = process.env.DISCORD_TOKEN
if (!token) return console.log("Nincs Discord token megadva! Írj be egyet a .env fájlba!")

const Shard = new Discord.ShardingManager('./index.js', { token } );
const guildsPerShard = 2000

Discord.fetchRecommendedShardCount(token, {guildsPerShard}).then(shards => {
    let shardCount = Math.floor(shards)
    console.info(shardCount == 1 ? "Elindulás..." : `Előkészítés ${shardCount} shardra...`)
    Shard.spawn({amount: shardCount, timeout: 60000}).catch(console.error)
    Shard.on('shardCreate', shard => {
        shard.on("disconnect", (event) => {
            console.warn(`Shard ${shard.id} Lecsatlakozott!`); console.log(event);
        });
        shard.on("death", (event) => {
            console.warn(`Shard ${shard.id} meghalt!\nKilépési kód: ${event.exitCode}`);
        });
        shard.on("reconnecting", () => {
            console.info(`Shard ${shard.id} újracsatlakozik!`);
        });
            
    })
}).catch(e => {console.log(e.headers || e)})