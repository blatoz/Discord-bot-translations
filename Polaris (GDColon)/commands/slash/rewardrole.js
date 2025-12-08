const Discord = require("discord.js")

module.exports = {
metadata: {
    permission: "ManageGuild",
    name: "rewardrole",
    description: "Szint jutalom szerepkör hozzáadása vagy eltávolítása",
    args: [
        { type: "role", name: "role_name", description: "A hozzáadni vagy eltávolítani kívánt szerepkör", required: true },
        { type: "integer", name: "level", description: "A szint, aminél a szerepkört megkapja, vagy 0 az eltávolításhoz", min: 0, max: 1000, required: true },
        { type: "bool", name: "keep", description: "Megtartja ezt a szerepkört, még ha magasabb szintűt is elér" },
        { type: "bool", name: "dont_sync", description: "Néhány speciális esetben hasznos: A szerepkört nem szinkronizálja a szint szerepkörökkel" }
    ]
},

async run(client, int, tools) {

    let db = await tools.fetchSettings()
    if (!tools.canManageServer(int.member, db.settings.manualPerms)) return tools.warn("*notMod")

    let role = int.options.getRole("role_name")
    let level = tools.clamp(Math.round(int.options.get("level")?.value), 0, 1000)

    let isKeep = !!int.options.get("keep")?.value
    let isDontSync = !!int.options.get("dont_sync")?.value    

    let existingIndex = db.settings.rewards.findIndex(x => x.id == role.id)
    let foundExisting = (existingIndex >= 0) ? db.settings.rewards[existingIndex] : null

    let newRoles = db.settings.rewards
    if (foundExisting) newRoles.splice(existingIndex, 1)    // remove by default

    function finish(msg) {
        let viewRewardRoles = tools.row(tools.button({style: "Primary", label: `Összes jutalom megtekintése (${newRoles.length})`, customId: "list_reward_roles"}))

        client.db.update(int.guild.id, { $set: { 'settings.rewards': newRoles, 'info.lastUpdate': Date.now() }}).then(() => {
            return int.reply({ content: msg, components: viewRewardRoles })        
        })
    }
    
    // deleting a reward role
    if (level == 0) {
        if (!foundExisting) return tools.warn("Szint jutalom szerepkörök nem lehetnek hozzáadva szint 0-n! Használja ezt az elérési útot, hogy töröljön meglévő jutalom szerepköröket.")
        return finish(`❌ **Sikeresen törölve a jutalom szerepkört <@&${role.id}> a ${foundExisting.level} szinten.**`, newRoles)
    }

    // no manage roles perm
    if (!int.guild.members.me.permissions.has(Discord.PermissionFlagsBits.ManageRoles)) return tools.warn("*cantManageRoles")

    // can't grant role
    if (!role.editable) return tools.warn(`Nincs jogosultságom a <@&${role.id}> szerepkörnek hozzáadásához!`)

    // set up new role data
    let roleData = { id: role.id, level }
    let extraStrings = []
    if (isKeep) { roleData.keep = true; extraStrings.push("always kept") }
    if (isDontSync) { roleData.noSync = true; extraStrings.push("ignores sync") }

    newRoles.push(roleData)
    let extraStr = (extraStrings.length < 1) ? "" : ` (${extraStrings.join(", ")})`

    // if reward already exists, replace existing role
    if (foundExisting) {
        if (foundExisting.level == level) return tools.warn(`Ez a szerepkör már hozzá van adva szint ${level}-n!`)
        return finish(`📝 **<@&${role.id}> most lesz hozzáadva szint ${level}-n!** (előzőleg ${foundExisting.level})${extraStr}`)
    }

    // otherwise, just add the role
    return finish(`✅ **<@&${role.id}> most lesz hozzáadva szint ${level}-n!**${extraStr}`)
}}