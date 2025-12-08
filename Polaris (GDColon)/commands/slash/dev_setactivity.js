const fs = require("fs")

module.exports = {
metadata: {
    dev: true,
    name: "setactivity",
    description: "(dev) A bot állapotának megváltoztatása",
    args: [
        { type: "string", name: "type", description: "Tevénykenység fajta", required: true, choices: [
            {name: "Egyedi", value: "Custom"},
            {name: "Játékban", value: "Playing"},
            {name: "Nézi", value: "Watching"},
            {name: "Hallgatja", value: "Listening"},
            {name: "*Jelenlegi", value: "current"},
            {name: "*Visszaállítás", value: "reset"},
            {name: "*Törlés", value: "clear"},
        ]},
        { type: "string", name: "name", description: "Egyedi tevénylenység neve", required: true },
        { type: "string", name: "state", description: "Egyedi állapot", required: false },
        { type: "string", name: "url", description: "Stream link", required: false },
        { type: "string", name: "status", description: "Online státusz", required: false, choices: [
            {name: "Online", value: "online"},
            {name: "Tétlen", value: "idle"},
            {name: "Elfoglalt", value: "dnd"},
            {name: "Offline", value: "offline"},
        ]},
    ]
},

async run(client, int, tools) {

    const statusInfo = require("../../json/auto/status.json")  // placed inside run to guarantee it exists

    let type = int.options.get("type")?.value
    let name = int.options.get("name")?.value
    let state = int.options.get("state")?.value
    let status = int.options.get("status")?.value || "online"
    let url = int.options.get("url")?.value || null

    if (!state && type == "Custom") state = name

    if (url) type = "Streaming"

    else if (type == "current") {
        type = statusInfo.type
        name = statusInfo.name
        status = statusInfo.status
    }

    else if (type == "reset") {
        type = statusInfo.default.type
        name = statusInfo.default.name
        status = "online"
    }

    else if (type == "clear") {
        type = ""
        name = ""
    }
    
    int.reply("✅ **Státusz frissítve!**")

    statusInfo.name = name
    statusInfo.state = state || ""
    statusInfo.type = type
    statusInfo.url = url
    statusInfo.status = status
    client.statusData = statusInfo
    fs.writeFileSync('./json/auto/status.json', JSON.stringify(statusInfo, null, 2))

    client.shard.broadcastEval(async (cl, xd) => {
        cl.statusData = xd
        cl.updateStatus()
    }, { context: statusInfo })
 
}}