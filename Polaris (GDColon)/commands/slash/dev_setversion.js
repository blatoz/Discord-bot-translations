const fs = require("fs")

module.exports = {
metadata: {
    dev: true,
    name: "setversion",
    description: "(dev) A bot verziójának megváltoztatása",
    args: [
        { type: "string", name: "version", description: "Verzió szám", required: true },
        { type: "bool", name: "change_timestamp", description: "Jelenlegi idő használata a frissítés kiadásához", required: true },
        { type: "integer", name: "custom_timestamp", description: "Egyéni frissítési időbélyeg", required: false },
    ]
},

async run(client, int, tools) {

    let versionNumber = int.options.get("version")?.value
    let updateTimestamp = !!int.options.get("change_timestamp")?.value ? Date.now() : (int.options.get("custom_timestamp")?.value || client.version.updated)

    client.shard.broadcastEval((cl, xd) => {
        cl.version = { version: xd.versionNumber, updated: xd.updateTimestamp }
    }, { context: { versionNumber, updateTimestamp } })

    fs.writeFileSync('./json/auto/version.json', JSON.stringify({ version: versionNumber, updated: updateTimestamp }, null, 2))

    int.reply(`Frissítve lett erre: **v${versionNumber}** (<t:${Math.round(updateTimestamp / 1000)}> / ${updateTimestamp})`)
 
}}