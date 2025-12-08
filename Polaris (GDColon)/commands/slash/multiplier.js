module.exports = {
metadata: {
    permission: "ManageGuild",
    name: "multiplier",
    description: "XP szorzók kezelése szerepekhez és csatornákhoz",
    args: [
        { type: "subcommand", name: "role", description: "Szerepkör szorzók kezelése", args: [
            { type: "role", name: "role_name", description: "A szerepkörnek neve", required: true },
            { type: "float", name: "multiplier", description: "Szorzó az XP szerzéshez (0.5, 2, stb.), vagy 0 az XP szerzés letiltásához", min: 0, max: 100, required: true },
            { type: "bool", name: "remove", description: "Eltávolítja ezt a szorzót, ha létezik" }
        ]},

        { type: "subcommand", name: "channel", description: "Csatorna szorzók kezelése", args: [
            { type: "channel", name: "channel_name", description: "A csatorna vagy kategória neve", required: true, acceptAll: true },
            { type: "float", name: "multiplier", description: "Szorzó az XP szerzéshez (0.5, 2, stb.), vagy 0 az XP szerzés letiltásához", min: 0, max: 100, required: true },
            { type: "bool", name: "remove", description: "Eltávolítja ezt a szorzót, ha létezik" }
        ]}
    ]
},

async run(client, int, tools) {

    let db = await tools.fetchSettings()
    if (!tools.canManageServer(int.member, db.settings.manualPerms)) return tools.warn("*notMod")

    let type = int.options.getSubcommand(false)

    let boostVal = int.options.get("multiplier")?.value ?? 1
    
    let role = int.options.getRole("role_name")
    let channel = int.options.getChannel("channel_name")
    let boost = tools.clamp(+boostVal.toFixed(2), 0, 100)
    let remove = !!int.options.get("remove")?.value
    
    if (!channel && !role) return
    let target = (channel || role)
    let tag = role ? `<@&${role.id}>` : `<#${channel.id}>`

    let typeIndex = role ? "roles" : "channels"
    let mults = db.settings.multipliers[typeIndex]
    let existingIndex = mults.findIndex(x => x.id == target.id)
    let foundExisting = (existingIndex >= 0) ? mults[existingIndex] : null

    let newList = db.settings.multipliers
    if (foundExisting) db.settings.multipliers[typeIndex].splice(existingIndex, 1)    // remove by default

    function finish(msg) {
        let viewMultipliers = tools.row([
            tools.button({style: role ? "Primary" : "Secondary", label: `Szerepkör szorzók (${newList.roles.length})`, customId: "list_multipliers~roles"}),
            tools.button({style: role ? "Secondary" : "Primary", label: `Csatorna szorzók (${newList.channels.length})`, customId: "list_multipliers~channels"})
        ])

        client.db.update(int.guild.id, { $set: { [`settings.multipliers.${typeIndex}`]: newList[typeIndex], 'info.lastUpdate': Date.now() }}).then(() => {
            return int.reply({ content: msg, components: viewMultipliers })        
        })
    }

    // deleting a multiplier
    if (remove) {
        if (!foundExisting) return tools.warn(`Ez a ${type} soha nem rendelkezett szorzóval!`)
        return finish(`❌ **Sikeresen törölve ${foundExisting.boost}x szorzó ${tag} számára.**`)
    }

    // set up multiplier data
    let boostData = { id: target.id, boost }
    newList[typeIndex].push(boostData)
    let boostStr = boost == 0 ? "no XP" : `${boost}x XP`

    // if multiplier already exists, replace it
    if (foundExisting) {
        if (foundExisting.boost == boost) return tools.warn(`Ez a ${type} már rendelkezik ${boost}x szorzóval!`)
        return finish(`📝 **${tag} most ${boostStr} szerzi!** (előzőleg ${foundExisting.boost}x)`)
    }
    
    return finish(`✅ **${tag} most ${boostStr} szerzi!**`)

}}