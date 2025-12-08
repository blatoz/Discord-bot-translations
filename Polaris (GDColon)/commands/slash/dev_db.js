const util = require("util")

module.exports = {
metadata: {
    dev: true,
    name: "db",
    description: "(dev) Adatbázisok megtekintése vagy módosítása.",
    args: [
        { type: "string", name: "property", description: "Ingatlan neve (pl. settings.enabled)", required: false },
        { type: "string", name: "new_value", description: "Új érték az ingatlannak (JSON fájlban)", required: false },
        { type: "string", name: "guild_id", description: "Szerver ID használni (alapértelmezés szerint az aktuális szerver)", required: false }
    ]
},

async run(client, int, tools) {

    const propertyName = int.options.get("property")
    const newValue = int.options.get("new_value")
    const providedGuild = int.options.get("guild_id")

    let guildID = providedGuild?.value || int.guild.id
    let db = await client.db.fetch(guildID)
    if (!db) return int.reply("Nincsen adat!")

    let cleanDB = { _id: db._id, settings: db.settings || {}, users: db.users || {} }

    if (!propertyName) {
        let uniqueMembers = Object.keys(cleanDB.users).length
        if (uniqueMembers > 16) cleanDB.users = `(${uniqueMembers} bejegyzés)`
        return int.reply(util.inspect(cleanDB))
    }

    else if (!newValue) {
        Promise.resolve().then(() => eval(`db.${propertyName.value}`)) // lmao
        .then(x => int.reply(tools.limitLength(util.inspect(x), 1900)))
        .catch(e => int.reply(`**Hiba:** ${e.message}`))
    }

    else {
        let val = newValue.value
        try { val = JSON.parse(newValue.value) }
        catch(e) { newValue.value }

        let confirmMsg = { content: `Kattints hogy frissísd **${propertyName.value}** erre: [${typeof val}] ${tools.limitLength(JSON.stringify(val), 256)}` }
        tools.createConfirmationButtons({
            message: confirmMsg, buttons: "Frissítés!", secs: 30, timeoutMessage: "Frissítés megszakítva.",
            onClick: function(confirmed, msg, b) {
               if (!confirmed) return msg.reply("Frissítés megszakítva.")
               else {
                    client.db.update(guildID, { $set: { [propertyName.value]: val } }).exec().then(() => {
                        msg.reply(`✅ Sikeresen frissítve **${propertyName.value}**!`)
                    }).catch(e => msg.reply("Frissítés sikertelen! " + e.message))
               }
            }
        })
    }

 
}}