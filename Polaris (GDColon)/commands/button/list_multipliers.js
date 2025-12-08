const PageEmbed = require("../../classes/PageEmbed.js")
const Discord = require("discord.js")

module.exports = {
metadata: {
    name: "button:list_multipliers",
},

async run(client, int, tools) {
    let db = await tools.fetchSettings()
    if (!db) return tools.warn("*noData")

    if (!tools.canManageServer(int.member, db.settings.manualPerms)) return tools.warn("*notMod")

    let isChannel = int.customId.split("~")[1] == "channels"
    let mType = isChannel ? "channel" : "role"
    let mList = db.settings.multipliers[isChannel ? "channels" : "roles"]

    if (!mList.length) return tools.warn(`Ennek a szervernek nincsen ${mType} szorzója!`)

    let embed = tools.createEmbed({
        title: `${tools.capitalize(mType)} Szorzók (${mList.length})`,
        color: tools.COLOR,
        footer: "Új szorzót adhatsz hozzá vagy eltávolíthatod a /multiplier parancs segítségével"
    })

    let multipliers = mList.sort((a, b) => a.boost - b.boost);

    let categories;
    if (isChannel) {
        categories = await int.guild.channels.fetch().then(x => x.filter(c => c.type == Discord.ChannelType.GuildCategory).map(x => x.id))
    }

    let multiplierEmbed = new PageEmbed(embed, multipliers, {
        size: 20, owner: int.user.id,
        mapFunction: (x) => `**${x.boost}x:** ${isChannel ? (categories.includes(x.id) ? `**<#${x.id}>** (kategória)` : `<#${x.id}>`) : `<@&${x.id}>`}`
    })

    multiplierEmbed.post(int)

}}