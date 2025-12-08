const { dependencies } = require('../../package.json');
const config = require("../../config.json")

module.exports = {
metadata: {
    name: "botstatus",
    description: "View some details about the bot"
},

async run(client, int, tools) {

    let versionNumber = client.version.version != Math.round(client.version.version) ? client.version.version : client.version.version.toFixed(1)

    let stats = await client.shard.broadcastEval(cl => ({ guilds: cl.guilds.cache.size, users: cl.users.cache.size }))
    let totalServers = stats.reduce((a, b) => a + b.guilds, 0)

    let botStatus = [
        `**Hivatalos készítője:** **[Colon](https://gdcolon.com)** 🦊⛩️`,
        `**Fordító:** **Daniyt_th (daniyt_th)**`,
        `**Discord Szerver:** [Támogatás](https://discord.gg/8c6sAqmE9V)`,
        `**Verzió:** v${versionNumber} - frissítve <t:${Math.round(client.version.updated / 1000)}:R>`,
        `**Shard:** ${client.shard.id}/${client.shard.count - 1}`,
        `**Uptime:** ${tools.timestamp(client.uptime)}`,
        `**Szerverek:** ${tools.commafy(totalServers)}${client.shard.count == 1 ? "" : ` (shardon: ${tools.commafy(client.guilds.cache.size)})`}`,
        `**Memória használat:** ${Number((process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2))} MB`
    ]

    let embed = tools.createEmbed({
        author: { name: client.user.displayName, iconURL: client.user.avatarURL() },
        color: tools.COLOR, timestamp: true, footer: "Pingelés...",
        description: botStatus.join("\n")
    })

    let infoButtons = [{style: "Link", label: "Weboldal", url: `${tools.WEBSITE}`}]
    if (config.changelogURL) infoButtons.push({style: "Link", label: "Változtatás napló", url: config.changelogURL})
    if (config.supportURL) infoButtons.push({style: "Link", label: "Támogatás", url: config.supportURL})

    int.reply({embeds: [embed], components: tools.row(tools.button(infoButtons)), fetchReply: true}).then(msg => {
        embed.setFooter({ text: `Ping: ${tools.commafy(msg.createdTimestamp - int.createdAt)}ms`})
        int.editReply({ embeds: [embed], components: msg.components })
    })

}}