module.exports = {
metadata: {
    permission: "ManageGuild",
    name: "clear",
    description: "Törölje egy tag cooldownját. (Szerver kezelése jogosultság szükséges)",
    args: [
        { type: "user", name: "member", description: "Melyik tagnak szeretnéd törölni", required: true }
    ]
},

async run(client, int, tools) {

    const user = int.options.get("member")?.user

    let db = await tools.fetchSettings(user.id)
    if (!db) return tools.warn("*noData")
    else if (!tools.canManageServer(int.member, db.settings.manualPerms)) return tools.warn("*notMod")
    else if (!db.settings.enabled) return tools.warn("*xpDisabled")

    if (user.bot) return tools.warn("Botoknak, nincsen cooldownja!")

    let current = db.users[user.id]
    let cooldown = current?.cooldown
    if (!cooldown || cooldown <= Date.now()) return tools.warn("A tagnak nincsen aktív cooldownja!")

    client.db.update(int.guild.id, { $set: { [`users.${user.id}.cooldown`]: 0 } }).then(() => {
        int.reply(`🔄 **${tools.pluralS(user.displayName)} cooldownja visszaállítva!** (előzőleg ${tools.timestamp(cooldown - Date.now())})`)
    }).catch(() => tools.warn("Hiba történt a cooldown visszaállításakor!"))

}}