const config = require("../../config.json")
const DiscordBuilders = require("@discordjs/builders")
const Discord = require("discord.js")
const { REST } = require("@discordjs/rest")
const { Routes } = require("discord-api-types/v9")

function prepareOption(option, arg) {
    option.setName(arg.name.toLowerCase())
    if (arg.description) option.setDescription(arg.description)
    if (arg.required) option.setRequired(true)
    return option
}

function createSlashArg(data, arg) {
    switch (arg.type) {
        case "subcommand":
            return data.addSubcommand(cmd => {
                cmd.setName(arg.name)
                cmd.setDescription(arg.description)
                if (arg.args?.length) arg.args.forEach(a => { createSlashArg(cmd, a) })
                return cmd
            })
        case "string":
            return data.addStringOption(option => {
                prepareOption(option, arg)
                if (arg.choices) option.setChoices(...arg.choices)
                return option
            })
        case "integer": case "number":
            return data.addIntegerOption(option => {
                prepareOption(option, arg)
                if (arg.choices) option.setChoices(...arg.choices)
                if (!isNaN(arg.min)) option.setMinValue(arg.min)
                if (!isNaN(arg.max)) option.setMaxValue(arg.max)
                return option
            })
        case "float":
            return data.addNumberOption(option => {
                prepareOption(option, arg)
                if (arg.choices) option.setChoices(...arg.choices)
                if (!isNaN(arg.min)) option.setMinValue(arg.min)
                if (!isNaN(arg.max)) option.setMaxValue(arg.max)
                return option
            })
        case "channel":
            return data.addChannelOption(option => {
                prepareOption(option, arg)
                if (arg.types) option.addChannelTypes(arg.types)
                else if (arg.acceptAll) option.addChannelTypes([0, 2, 4, 5, 10, 11, 12, 13, 15, 16]) // lol
                else option.addChannelTypes([Discord.ChannelType.GuildText, Discord.ChannelType.GuildAnnouncement])
                return option
            })
        case "bool": return data.addBooleanOption(option => prepareOption(option, arg))
        case "file": return data.addAttachmentOption(option => prepareOption(option, arg))
        case "user": return data.addUserOption(option => prepareOption(option, arg))
        case "role": return data.addRoleOption(option => prepareOption(option, arg))
    } 
}


module.exports = {
metadata: {
    dev: true,
    name: "deploy",
    description: "(dev) A bot parancsainak telepítése/szinkronizálása.",
    args: [
        { type: "bool", name: "global", description: "A fejlesztői parancsok helyett a nyilvános globális parancsokat tegye közzé.", required: false },
        { type: "string", name: "server_id", description: "Dev parancsok telepítése egy adott szerverre", required: false },
        { type: "bool", name: "undeploy", description: "Törli az összes dev parancsot a szerverről (vagy globálisan, ha true értékre van állítva).", required: false }    
    ]
},

// I made my own slash command builder because discord.js's one is ass
// https://discord.js.org/#/docs/builders/main/class/SlashCommandBuilder
async run(client, int, tools) {

    let isPublic = int && !!int.options.get("global")?.value
    let undeploy = int && !!int.options.get("undeploy")?.value
    let targetServer = (!int || isPublic) ? null : int.options.get("server_id")?.value

    let interactionList = []
    if (!undeploy) client.commands.forEach(cmd => {
        let metadata = cmd.metadata
        if (isPublic && metadata.dev) return
        else if (!isPublic && !metadata.dev) return

        switch (metadata.type) {

            case "user_context": case "message_context": // context menu, user
                let ctx = { name: metadata.name, type: metadata.type == "user_context" ? 2 : 3, dm_permission: !!metadata.dm, contexts: [0] }
                interactionList.push(ctx);
                break;

            case "slash": // slash commands
                let data = new DiscordBuilders.SlashCommandBuilder()
                data.setName(metadata.name.toLowerCase())
                data.setContexts([0])
                if (metadata.dev) data.setDefaultMemberPermissions(0)
                else if (metadata.permission) data.setDefaultMemberPermissions(Discord.PermissionFlagsBits[metadata.permission])
                if (metadata.description) data.setDescription(metadata.description)
                if (metadata.args) metadata.args.forEach(arg => {
                    return createSlashArg(data, arg)
                })
                interactionList.push(data.toJSON())
                break;
        }
    })

    const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

    if (isPublic) {
        const route = Routes.applicationCommands(process.env.DISCORD_ID)
        rest.put(route, { body: interactionList })
        .then(() => {
            if (int) int.reply(`**${!undeploy ? `${interactionList.length} global parancsok regisztrálva!` : "Global parancsok törölve!"}** (Várjon egy kicsit, vagy frissítse a Ctrl+R billentyűkombinációval, hogy lássa a változásokat.)`)
            else console.info("Global parancsok regisztrálva lettek!") 
            client.shard.broadcastEval(cl => { cl.application.commands.fetch(); return }) // cache new slash commands
        }).catch(e => console.error(`Hiba a globális parancsok telepítésekor ${id}: ${e.message}`));
    }

    else {
        let serverIDs = targetServer ? [targetServer] : (int?.guild) ? [int.guild.id] : config.test_server_ids
        if (!serverIDs) return console.warn("A fejlesztői parancsok nem hajthatók végre! A konfigurációban nincs megadva test szerver ID.")
        
        serverIDs.forEach(id => {
            const route = Routes.applicationGuildCommands(process.env.DISCORD_ID, id)
            rest.put(route, { body: interactionList })
            .then(() => {
                let msg = `Fejlesztői parancsok regisztrálva ide: ${id}!`
                if (int) int.reply(undeploy ? "Fejlesztői parancsok törölve!" : id == int.guild.id ? "Fejlesztői parancsok regisztrálva!" : msg)
                else console.info(msg) 
            }).catch(e => console.error(`Hiba a dev parancsok telepítésekor ${id}: ${e.message}`));
        })
    }


}}