const PageEmbed = require("../../classes/PageEmbed.js")

module.exports = {
metadata: {
    name: "button:list_reward_roles",
},

async run(client, int, tools) {
    let db = await tools.fetchSettings()
    if (!db) return tools.warn("*noData")

    if (!tools.canManageServer(int.member, db.settings.manualPerms)) return tools.warn("*notMod")

    if (!db.settings.rewards.length) return tools.warn("Ennek a szervernek nincsen jutalom szerepe!")

    let embed = tools.createEmbed({
        title: `Jutalom szerepek (${db.settings.rewards.length})`,
        color: tools.COLOR,
        footer: "Új jutalom szerepet hozzáadhatsz vagy eltávolíthatod a /rewardrole parancs segítségével"
    })

    let rewards = db.settings.rewards.sort((a, b) => a.level - b.level);

    let rewardEmbed = new PageEmbed(embed, rewards, {
        size: 20, owner: int.user.id,
        mapFunction: (x) => `**Szint ${x.level}** - <@&${x.id}>${x.keep ? " (tartás)" : ""}${x.noSync ? " (szinkronizálás nélkül)" : ""}`
    })

    rewardEmbed.post(int)

}}