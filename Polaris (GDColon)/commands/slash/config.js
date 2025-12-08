module.exports = {
metadata: {
    permission: "ManageGuild",
    name: "config",
    description: "Kapcsold be az XP-szerzést, vagy látogass el a vezérlőpultra a szerver beállításainak módosításához. (kell hozzá 'Szerver kezelése' jogosultság)",
},

async run(client, int, tools) {

    let db = await tools.fetchSettings()
    let settings = db.settings
    if (!tools.canManageServer(int.member, db.settings.manualPerms)) return tools.warn("*notMod")

    let polarisSettings = [
        `**✨ XP engedélyezve: __${settings.enabled ? "Igen!" : "Nem!"}__**`,
        `**XP per üzenet:** ${settings.gain.min == settings.gain.max ? tools.commafy(settings.gain.min) : `${tools.commafy(settings.gain.min)} - ${tools.commafy(settings.gain.max)}`}`,
        `**XP cooldown:** ${tools.commafy(settings.gain.time)} ${tools.extraS("sec", settings.gain.time)}`,
        `**XP görbe:** ${settings.curve[3]}x³ + ${settings.curve[2]}x² + ${settings.curve[1]}x`,
        `**Szint lépés üzenet:** ${settings.levelUp.enabled && settings.levelUp.message ? (settings.levelUp.embed ? "Engedélyezve (beágyazás)" : "Engedélyezve") : "Letiltva"}`,
        `**Rang kártyák:** ${settings.rankCard.disabled ? "Letitlva" : settings.rankCard.ephemeral ? "Engedélyezve (kényszerű rejtett)" : "Engedélyezve"}`,
        `**Toplista:** ${settings.leaderboard.disabled ? "Letiltva" : `[${settings.leaderboard.private ? "Privát" : "Publikus"}](<${tools.WEBSITE}/leaderboard/${int.guild.id}>)`}`
    ]

    let embed = tools.createEmbed({
        author: { name: + int.guild.name + "beállításai", iconURL: int.guild.iconURL() },
        footer: "Látogasson el az online irányítópultra a szerver beállításainak módosításához.",
        color: tools.COLOR, timestamp: true,
        description: polarisSettings.join("\n")
    })

    let toggleButton = settings.enabled ?
      {style: "Danger", label: "XP letiltása", emoji: "❕", customId: "toggle_xp" }
    : {style: "Success", label: "Xp engedélyezése", emoji: "✨", customId: "toggle_xp" }

    let buttons = tools.button([
        {style: "Success", label: "Beállítások", emoji: "🛠", customID: "settings_list"},
        toggleButton,
        {style: "Link", label: "Online szerkeztés", emoji: "🌎", url: `${tools.WEBSITE}/settings/${int.guild.id}`},
        {style: "Secondary", label: "Adat exportálása", emoji: "⏏️", customId: "export_xp"}
    ])

    let listButtons = tools.button([
        {style: "Primary", label: `Jutalmak (${settings.rewards.length})`, customId: "list_reward_roles"},
        {style: "Primary", label: `Rang szórzók (${settings.multipliers.roles.length})`, customId: "list_multipliers~roles"},
        {style: "Primary", label: `Csatorna szórzók (${settings.multipliers.channels.length})`, customId: "list_multipliers~channels"}
    ])

    return int.reply({embeds: [embed], components: [tools.row(buttons)[0], tools.row(listButtons)[0]]})

}}