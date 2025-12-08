const PageEmbed = require("../../classes/PageEmbed.js")

module.exports = {
metadata: {
    name: "top",
    description: "A szerver toplista megtekintése.",
    args: [
        { type: "integer", name: "page", description: "Melyik oldalt szeretnéd megtekinteni (negatív szám az utolsó oldalról kezdve)", required: false },
        { type: "user", name: "member", description: "Megkeresi egy bizonyos tag helyét a toplistán (felülírja az oldalt)", required: false },
        { type: "bool", name: "hidden", description: "Elrejti a választ, hogy csak te lásd", required: false }
    ]
},

async run(client, int, tools) {

    let lbLink = `${tools.WEBSITE}/leaderboard/${int.guild.id}`

    let db = await tools.fetchAll()
    if (!db || !db.users || !Object.keys(db.users).length) return tools.warn(`Nincsenek még rangelt tagok ezen a szerveren!`);
    else if (!db.settings.enabled) return tools.warn("*xpDisabled")
    else if (db.settings.leaderboard.disabled) return tools.warn("A toplista jelenleg tiltva van ezen a szerveren!" + (tools.canManageServer(int.member) ? `\nModerátorként még mindig lehet privát módban megtekinteni a toplistát itt: ${lbLink}` : ""))

    let pageNumber = int.options.get("page")?.value || 1
    let pageSize = 10

    let minLeaderboardXP = db.settings.leaderboard.minLevel > 1 ? tools.xpForLevel(db.settings.leaderboard.minLevel, db.settings) : 0
    let rankings = tools.xpObjToArray(db.users)
    rankings = rankings.filter(x => x.xp > minLeaderboardXP && !x.hidden).sort(function(a, b) {return b.xp - a.xp})

    if (db.settings.leaderboard.maxEntries > 0) rankings = rankings.slice(0, db.settings.leaderboard.maxEntries)

    if (!rankings.length) return tools.warn("Nincsenek még tagok a toplistán ezen a szerveren!")

    let highlight = null
    let userSearch = int.options.get("user") || int.options.get("member") // option is "user" if from context menu
    if (userSearch) {
        let foundRanking = rankings.findIndex(x => x.id == userSearch.user.id)
        if (isNaN(foundRanking) || foundRanking < 0) return tools.warn(int.user.id == userSearch.user.id ? "Nem vagy rajta a toplistán!" : "Ez a tag nincsen rajta a toplistán!")
        else pageNumber = Math.floor(foundRanking / pageSize) + 1
        highlight = userSearch.user.id
    }

    let listCol = db.settings.leaderboard.embedColor
    if (listCol == -1) listCol = null

    let embed = tools.createEmbed({
        color: listCol || tools.COLOR,
        author: {name: 'Toplista:' + int.guild.name, iconURL: int.guild.iconURL()}
    })

    let isHidden = db.settings.leaderboard.ephemeral || !!int.options.get("hidden")?.value

    let xpEmbed = new PageEmbed(embed, rankings, {
        page: pageNumber, size: pageSize, owner: int.user.id,  ephemeral: isHidden,
        mapFunction: (x, y, p) => `**${p})** ${x.id == highlight ? "**" : ""}Lv. ${tools.getLevel(x.xp, db.settings)} - <@${x.id}> (${tools.commafy(x.xp)} XP)${x.id == highlight ? "**" : ""}`,
        extraButtons: [ tools.button({style: "Link", label: "Online Toplista", url: lbLink}) ]
    })
    if (!xpEmbed.data.length) return tools.warn("Nincsenek tagok ezen az oldalon!")

    xpEmbed.post(int)

}}