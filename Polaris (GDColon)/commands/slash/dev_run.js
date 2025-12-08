const util = require("util")

module.exports = {
metadata: {
    dev: true,
    name: "run",
    description: "(dev) JS kód értékelése, 100% biztonságosan.",
    args: [
        { type: "string", name: "code", description: "Néhány JS kód a nagyon biztonságos értékeléshez", required: true }
    ]
},

async run(client, int, tools) {

    let code = int.options.get("code").value
    let db = await client.db.fetch(int.guild.id)

    return Promise.resolve().then(() => {
      return eval(code)
    })
    .then(x => {
        if (typeof x !== "string") x = util.inspect(x)
        int.reply(x || "** **").catch((e) => {
            int.reply("✅").catch(() => {})
        });
    })
    .catch(e => { int.reply(`**Hiba:** ${e.message}`); console.warn(e) })

}}