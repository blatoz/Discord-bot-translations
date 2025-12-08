const Discord = require('discord.js')
module.exports = {
metadata: {
    name: "sync",
    description: "Szinkronizálja a szint szerepköreit hiányzó hozzáadásával és helytelen eltávolításával.",
    args: [
        { type: "user", name: "member", description: "Melyik tagot szeretnéd szinkronizálni (Szerver kezelése jogosultság szükséges)", required: false }
    ]
},

async run(client, int, tools) {

    let foundUser = int.options.get("member")
    let member = foundUser ? foundUser.member : int.member
    if (!int.guild.members.me.permissions.has(Discord.PermissionFlagsBits.ManageRoles)) return tools.warn("*cantManageRoles")

    let db = await tools.fetchSettings(member.id)
    if (!db) return tools.warn("*noData")
    else if (!db.settings.enabled) return tools.warn("*xpDisabled")

    let isMod = db.settings.manualPerms ? tools.canManageRoles() : tools.canManageServer()
    if (member.id != int.user.id && !isMod) return tools.warn("Nincs jogosultságod más tag szerepköreinek szinkronizálásához!")

    else if (db.settings.noManual && !isMod) return tools.warn("Nincs jogosultságod a szint szerepköreid szinkronizálásához!")
    else if (!db.settings.rewards.length) return tools.warn("Ezen a szerveren nincsenek jutalom szerepkörök!")

    let currentXP = db.users[member.id]
    if (!currentXP || !currentXP.xp) return tools.noXPYet(member.user)

    let xp = currentXP.xp
    let level = tools.getLevel(xp, db.settings)

    let currentRoles = member.roles.cache
    let roleCheck = tools.checkLevelRoles(int.guild.roles.cache, currentRoles, level, db.settings.rewards)
    if (!roleCheck.incorrect.length && !roleCheck.missing.length) return int.reply("✅ A szint szerepköreid már megfelelően szinkronizálva vannak!")

    tools.syncLevelRoles(member, roleCheck).then(() => {
        let replyStr = ["🔄 **Szint szerepkörök sikeresen szinkronizálva!**"]
        if (roleCheck.missing.length) replyStr.push(`Hozzáadva: ${roleCheck.missing.map(x => `<@&${x.id}>`).join(" ")}`)
        if (roleCheck.incorrect.length) replyStr.push(`Eltávolítva: ${roleCheck.incorrect.map(x => `<@&${x.id}>`).join(" ")}`)
        return int.reply(replyStr.join("\n"))
    }).catch(e => int.reply(`Hiba szinkronizálás közben: ${e.message}`))

}}