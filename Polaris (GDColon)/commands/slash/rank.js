const multiplierModes = require("../../json/multiplier_modes.json")

module.exports = {
metadata: {
    name: "rank",
    description: "Saját szinted, XP-d és cooldown megtekintése.",
    args: [
        { type: "user", name: "member", description: "Melyik tagot szeretnéd megnézni", required: false },
        { type: "bool", name: "hidden", description: "Elrejti a parancs üzenetet csak hogy te tud megnézni", required: false }
    ]
},

async run(client, int, tools) {

    // fetch member
    let member = int.member
    let foundUser = int.options.get("user") || int.options.get("member") // option is "user" if from context menu
    if (foundUser) member = foundUser.member
    if (!member) return tools.warn("Ez a felhasználó nem található!")

    // fetch server xp settings
    let db = await tools.fetchSettings(member.id)
    if (!db) return tools.warn("*noData")
    else if (!db.settings.enabled) return tools.warn("*xpDisabled")

    let currentXP = db.users[member.id]

    if (db.settings.rankCard.disabled) return tools.warn("Rang kártyák le vannak tiltva a szerveren!")
    
    // if user has no xp, stop here
    if (!currentXP || !currentXP.xp) return tools.noXPYet(foundUser ? foundUser.user : int.user)

    let xp = currentXP.xp

    let levelData = tools.getLevel(xp, db.settings, true)       // get user's level
    let maxLevel = levelData.level >= db.settings.maxLevel      // check if level is maxxed

    let remaining = levelData.xpRequired - xp
    let levelPercent = maxLevel ? 100 : (xp - levelData.previousLevel) / (levelData.xpRequired - levelData.previousLevel) * 100

    let multiplierData = tools.getMultiplier(member, db.settings)
    let multiplier = multiplierData.multiplier

    let barSize = 33    // how many characters the xp bar is
    let barRepeat = Math.round(levelPercent / (100 / barSize)) // .round() so bar can sometimes display as completely full and completely empty
    let progressBar = `${"▓".repeat(barRepeat)}${"░".repeat(barSize - barRepeat)} (${!maxLevel ? Number(levelPercent.toFixed(2)) + "%" : "MAX"})`

    let estimatedMin = Math.ceil(remaining / (db.settings.gain.min * (multiplier || multiplierData.role)))
    let estimatedMax = Math.ceil(remaining / (db.settings.gain.max * (multiplier || multiplierData.role)))

    // estimated number of messages to level up
    let estimatedRange = (estimatedMax == estimatedMin) ? `${tools.commafy(estimatedMax)} ${tools.extraS("üzenet", estimatedMax)}` : `${tools.commafy(estimatedMax)}-${tools.commafy(estimatedMin)} üzenetek`

    // xp required to level up
    let nextLevelXP = (db.settings.rankCard.relativeLevel ? `${tools.commafy(xp - levelData.previousLevel)}/${tools.commafy(levelData.xpRequired - levelData.previousLevel)}` : `${tools.commafy(levelData.xpRequired)}`) + ` (${tools.commafy(remaining)} több)`

    let cardCol = db.settings.rankCard.embedColor
    if (cardCol == -1) cardCol = null

    let memberAvatar = member.displayAvatarURL()
    let memberColor = cardCol || member.displayColor || await member.user.fetch().then(x => x.accentColor)

    let embed = tools.createEmbed({
        author: { name: member.user.displayName, iconURL: memberAvatar },
        color: memberColor,
        footer: maxLevel ? progressBar : ((estimatedMin == Infinity || estimatedMin < 0) ? "Nincs több XP-t amit tovább tudni!" : `${progressBar}\n${estimatedRange} még hátra!`),
        fields: [
            { name: "✨ XP", value: `${tools.commafy(xp)} (lv. ${levelData.level})`, inline: true },
            { name: "⏩ Következő szint", value: !maxLevel ? nextLevelXP : "Max szint! Woah!", inline: true },
        ]
    })

    if (!db.settings.rankCard.hideCooldown) {
        let foundCooldown = currentXP.cooldown || 0
        let cooldown = foundCooldown > Date.now() ? tools.timestamp(foundCooldown - Date.now()) : "Nincsen!"
        embed.addFields([{ name: "🕓 Cooldown", value: cooldown, inline: true }])
    }

    let hideMult = db.settings.hideMultipliers

    let multRoles = multiplierData.roleList
    let multiplierInfo = []
    if ((!hideMult || multiplierData.role == 0) && multRoles.length) {
        let xpStr = multiplierData.role > 0 ? `${multiplierData.role}x XP` : "Nem szerezhet XP-t!"
        let roleMultiplierStr = multRoles.length == 1 ? `${int.guild.id != multRoles[0].id ? `<@&${multRoles[0].id}>` : "Mindenki"} - ${xpStr}` : `**${multRoles.length} szerepkör** - ${xpStr}`
        multiplierInfo.push(roleMultiplierStr)
    }

    let multChannels = multiplierData.channelList
    if ((!hideMult || multiplierData.channel == 0) && multChannels.length && multiplierData.role > 0 && (multiplierData.role != 1 || multiplierData.channel != 1)) {
        let chXPStr = multChannels[0].boost > 0 ? `${multiplierData.channel}x XP` : "Nem szerezhet XP-t"
        let chMultiplierStr = `<#${multChannels[0].id}> - ${chXPStr}` // leaving room for multiple channels, via categories or vcs or something
        multiplierInfo.push(chMultiplierStr)
        if (multRoles.length) multiplierInfo.push(`**Összes szorzó: ${multiplier}x XP** (${multiplierModes.channelStacking[multiplierData.channelStacking].toLowerCase()})`)
    }

    if (multiplierInfo.length) embed.addFields([{ name: "🌟 Szorzók", value: multiplierInfo.join("\n") }])

    else if (!db.settings.rewardSyncing.noManual && !db.settings.rewardSyncing.noWarning) {
        let syncCheck = tools.checkLevelRoles(int.guild.roles.cache, member.roles.cache, levelData.level, db.settings.rewards)
        if (syncCheck.incorrect.length || syncCheck.missing.length) embed.addFields([{ name: "⚠ Jegyzet", value: `A szint szerepköreid nincsenek megfelelően szinkronizálva! Írd be a ${tools.commandTag("sync")} parancsot a javításhoz.` }])
    }

    let isHidden = db.settings.rankCard.ephemeral || !!int.options.get("hidden")?.value
    return int.reply({embeds: [embed], ephemeral: isHidden})

}}