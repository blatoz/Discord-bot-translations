module.exports = {
metadata: {
    permission: "ManageGuild",
    name: "addxp",
    description: "Xp hozzáadása egy felhasználóhoz.(Kell hozzá Szerver kezelése jogosultság)",
    args: [
        { type: "user", name: "member", description: "Melyik tagot szeretnéd kezelni?", required: true },
        { type: "integer", name: "xp", description: "Mennyi xp-z adsz? (-szám elvesz az xpből.)", min: -1e10, max: 1e10, required: true },
        { type: "string", name: "operation", description: "Hogyan kell értelmezni az XP mennyiségét?", required: false, choices: [
            {name: "Add XP", value: "add_xp"},
            {name: "Set XP to", value: "set_xp"},
            {name: "Add levels", value: "add_level"},
            {name: "Set level to", value: "set_level"},
        ]},
    ]
},

async run(client, int, tools) {

    const member = int.options.get("member")?.member
    const amount = int.options.get("xp")?.value
    const operation = int.options.get("operation")?.value || "add_xp"

    let user = member?.user
    if (!user) return tools.warn("Nem találtam a felhasználót!")

    let db = await tools.fetchSettings(user.id)
    if (!db) return tools.warn("*noData")
    else if (!tools.canManageServer(int.member, db.settings.manualPerms)) return tools.warn("*notMod")
    else if (!db.settings.enabled) return tools.warn("*xpDisabled")

    if (amount === 0 && operation.startsWith("add")) return tools.warn("Érvénytelen XP mennyiség!")
    else if (user.bot) return tools.warn("Nem tudsz adni a Botnak XP, butus!")

    let currentXP = db.users[user.id]
    let xp = currentXP?.xp || 0
    let level = tools.getLevel(xp, db.settings)

    let newXP = xp
    let newLevel = level

    switch (operation) {
        case "add_xp": newXP += amount; break;
        case "set_xp": newXP = amount; break;
        case "add_level": newLevel += amount; break;
        case "set_level": newLevel = amount; break;
    }

    newXP = Math.max(0, newXP) // min 0
    newLevel = tools.clamp(newLevel, 0, db.settings.maxLevel) // between 0 and max level

    if (newXP != xp) newLevel = tools.getLevel(newXP, db.settings)
    else if (newLevel != level) newXP = tools.xpForLevel(newLevel, db.settings)

    let syncMode = db.settings.rewardSyncing.sync
    if (syncMode == "xp" || (syncMode == "level" && newLevel != level) || (newLevel > level)) { 
        let roleCheck = tools.checkLevelRoles(int.guild.roles.cache, member.roles.cache, newLevel, db.settings.rewards)
        tools.syncLevelRoles(member, roleCheck).catch(() => {})
    }
    let xpDiff = newXP - xp

    client.db.update(int.guild.id, { $set: { [`users.${user.id}.xp`]: newXP } }).then(() => {
        int.reply(`${newXP > xp ? "⏫" : "⏬"} ${user.displayName} most **${tools.commafy(newXP)}** XP-je van ${newLevel != level ? ` és az **új szintje ${newLevel}**` : ""}! (Előzőleg ${tools.commafy(xp)}, ${xpDiff >= 0 ? "+" : ""}${tools.commafy(xpDiff)})`)
    }).catch(() => tools.warn("Valami probléma történt a módosítás során XP!"))

}}