var discord = require('discord.js');
var client = new discord.Client();
var fs = require('fs');
var prefix = '-';
var db = require('quick.db');

client.on('ready', async function() {
console.log('Elindulva, bejelentkezve ');
  setInterval(()=>{
  client.user.setActivity(`-help | ${client.guilds.size} szerveren`, {type: "WATCHING"})
    client.user.setStatus(`idle`)
  }, 16000)
});

//logging 
client.on('messageDelete', async message => {
  
  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  
  function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
            if ((new Date().getTime() - start) > milliseconds){
break;   
            }
    }
    
  }
 
  if (message.guild) {
    if (message.author.bot) return;
    var y = db.get('messagedelete_' + message.guild.id)
    if (y !== `enabled`) return;
    var x = db.get('loggingchannel_' + message.guild.id)
    x = client.channels.get(x)
    if (message.channel == x) return;
    var embed = new discord.RichEmbed()
    .setColor('RANDOM')
    .setAuthor('Üzenet Törölve', message.guild.iconURL)
    .addField('Felhasználó', message.author.tag)
    .addField('Üzenet', message.content)
    .addField('Csatorna', message.channel)
    .setTimestamp()
    x.send(embed).catch()
  }
  
});
  
client.on("channelCreate", async function(channel){
  if (!channel.guild) return;
       var y = db.get(`channelcreate_${channel.guild.id}`)
    if (y !== 'enabled') return;
   var x = db.get('loggingchannel_' + channel.guild.id)
  var x = client.channels.get(x)
    var embed = new discord.RichEmbed()
    .setColor('RANDOM')
    .setAuthor('Csatorna Létrehozva', channel.guild.iconURL)
    .addField('Csatorna', channel)
    .addField('Csatorna ID', channel.id + `\n**----------------------**`)
    .setTimestamp()
    x.send(embed).catch()
  

});

client.on("channelDelete", async function(channel){
  if (!channel.guild) return;
       var y = db.get(`channelcreate_${channel.guild.id}`)
    if (y !== 'enabled') return;
   var x = db.get('loggingchannel_' + channel.guild.id)
  var x = client.channels.get(x)

    var embed = new discord.RichEmbed()
    .setColor('RANDOM')
    .setAuthor('Csatorna Törölve', channel.guild.iconURL)
    .addField('Csatorna Név', channel.name)
    .addField('Csatorna ID', channel.id + `\n**----------------------**`)
    .setTimestamp()
    x.send(embed).catch()
  

});
client.on("emojiCreate", async function(emoji){
 
        var y = db.get(`emojicreate_${emoji.guild.id}`)
    if (y !== 'enabled') return;
   var x = db.get('loggingchannel_' + emoji.guild.id)
  var x = client.channels.get(x)

    var embed = new discord.RichEmbed()
    .setColor('RANDOM')
    .setAuthor('Emoji Létrehozva', emoji.guild.iconURL)
    .addField('Emoji Név', emoji.name)
    .addField('Emoji', emoji + `\n**----------------------**`)
    .setTimestamp()
    x.send(embed).catch()
  

});
client.on("emojiDelete", async function(emoji){
     var y = db.get(`emojidelete_${emoji.guild.id}`)
    if (y !== 'enabled') return;
   var x = db.get('loggingchannel_' + emoji.guild.id)
  var x = client.channels.get(x)

    var embed = new discord.RichEmbed()
    .setColor('RANDOM')
    .setAuthor('Emoji Törölve', emoji.guild.iconURL)
    .addField('Emoji Név', emoji.name)
    .addField('Emoji URL', emoji.url+ `\n**----------------------**`)
    .setTimestamp()
    x.send(embed).catch()
  

}); 
client.on("guildBanAdd", async function(guild, user){
   
       var y = db.get(`guildbanadd_${guild.id}`)
    if (y !== 'enabled') return;
   var x = db.get('loggingchannel_' + guild.id)
  var x = client.channels.get(x)

    var embed = new discord.RichEmbed()
    .setColor('RANDOM')
    .setAuthor('Felhasználó Bannolva', guild.iconURL)
    .addField('Bannolt Felhasználó', user.tag)
    .addField('Felhasználó ID', user.id + `\n**----------------------**`)
    .setTimestamp()
    x.send(embed).catch()
  
});
client.on("guildBanRemove", async function(guild, user){
     
       var y = db.get(`guildbanremove_${guild.id}`)
    if (y !== 'enabled') return;
   var x = db.get('loggingchannel_' + guild.id)
  var x = client.channels.get(x)

    var embed = new discord.RichEmbed()
    .setColor('RANDOM')
    .setAuthor("Felhasználó Unbannolva", guild.iconURL)
    .addField('Unbannolt Felhasználó', user.tag)
    .addField('Felhasználó ID', user.id + `\n**----------------------**`)
    .setTimestamp()
    x.send(embed).catch()
});
client.on("guildMemberAdd", async function(member){
   
       var y = db.get(`guildmemberadd_${member.guild.id}`)
    if (y !== 'enabled') return;
   var x = db.get('loggingchannel_' + member.guild.id)
  var x = client.channels.get(x)

    var embed = new discord.RichEmbed()
    .setColor('RANDOM')
    .setAuthor("Felhasználó Csatlakozott", member.guild.iconURL)
    .addField('Felhasználó Név', member.user.tag)
    .addField('Felhasználó ID', member.user.id + `\n**----------------------**`)
    .setTimestamp()
    x.send(embed).catch()
});
client.on("guildMemberRemove", async function(member){
 var y = db.get(`guildmemberremove_${member.guild.id}`)
    if (y !== 'enabled') return;
   var x = db.get('loggingchannel_' + member.guild.id)
  var x = client.channels.get(x)

    var embed = new discord.RichEmbed()
    .setColor('RANDOM')
    .setAuthor("Felhasználó Kilépett", member.guild.iconURL)
    .addField('Felhasználó Név', member.user.tag)
    .addField('Felhasználó ID', member.user.id + `\n**----------------------**`)
    .setTimestamp()
    x.send(embed).catch()
  
});

client.on("messageDeleteBulk", async function(messages){
  
  var y = db.get(`messagebulkdelete_${messages.random().guild.id}`)
    if (y !== 'enabled') return;
   var x = db.get('loggingchannel_' + messages.random().guild.id)
  var x = client.channels.get(x)
if (messages.random().channel == x) return;
  
await messages.array().reverse().forEach(m => {
  var x = m.createdAt.toString().split(' ')
fs.appendFile('messagebulkdelete.txt', `[${m.author.tag}], [#${m.channel.name}]: ["${m.content}"], létrehozva [${x[0]} ${x[1]} ${x[2]} ${x[3]} ${x[4]}]\n\n`, function (err) {
  if (err) throw err;
  console.log('Egy messagebulkdelete.txt mentve!');
});
  });
  
    var embed = new discord.RichEmbed()
    .setColor('RANDOM')
    .setAuthor("Tömöges Üzenet Törölve", messages.random().guild.iconURL)
    .addField('Csatorna', messages.random().channel)
    .addField('Üzenetek Száma', messages.array().length+ `\n**----------------------**`)
    .setTimestamp()
    await x.send(embed).catch()
  await x.send(`Itt található a törölt üzenetek naplófájlja.Itt található a törölt üzenetek naplófájlja.: \n`).catch()
  await x.send(({files: [{attachment:'messagebulkdelete.txt'}]})).catch()
  
  fs.unlink('messagebulkdelete.txt', function (err) {
  if (err) throw err;
  console.log('Fájl törölve!');
});
  
});

client.on("roleCreate", async function(role){
     var y = db.get(`rolecreate_${role.guild.id}`)
    if (y !== 'enabled') return;
   var x = db.get('loggingchannel_' + role.guild.id)
  var x = client.channels.get(x)

 
    var embed = new discord.RichEmbed()
    .setColor('RANDOM')
    .setAuthor("Rang Létrehozva", role.guild.iconURL)
    .addField('Rang Neve', role.name)
    .addField('Rang ID', role.id + `\n**----------------------**`)
    .setTimestamp()
    x.send(embed).catch()
  
});
client.on("roleDelete", async function(role){
  
  var y = db.get(`roledelete_${role.guild.id}`)
    if (y !== 'enabled') return;
   var x = db.get('loggingchannel_' + role.guild.id)
  var x = client.channels.get(x)

    var embed = new discord.RichEmbed()
    .setColor('RANDOM')
    .setAuthor("Rang Törölve", role.guild.iconURL)
    .addField('Rang Neve', role.name)
    .addField('Rang ID', role.id + `\n**----------------------**`)
    .setTimestamp()
    
    x.send(embed).catch()
  
});

client.on('message', async message => {
  
   const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  if (message.content.indexOf(prefix) !== 0) return;
  function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
            if ((new Date().getTime() - start) > milliseconds){
break;   
            }
    }
    
  }
  
    if (command === "help") {
    if (!message.guild) return message.channel.send(`Használd ezt a parancsot egy szerveren, ne a dm-ben!`)
      if (!message.member.hasPermission(`MANAGE_CHANNELS`) || !message.member.hasPermission(`MANAGE_GUILD`)) return message.channel.send(`Sajnálom, ehhez csatornák kezelése / Szever kezelése jogosultságra van szükséged!`)
    var embed = new discord.RichEmbed()
    .setAuthor(`help`, message.guild.iconURL)
    
    .setTitle(`${message.guild.name} Konfigurációja\n----------------------`)
    .setColor('RANDOM')
    var y = await db.get(`allenabled_${message.guild.id}`)
    if (y == 'enabled') {
      embed.addField('Naplózás üzenet törlésnél [1]', "engedélyezve")
      embed.addField('Naplózás létrehozott rangokra [2]', "engedélyezve")
      embed.addField('Naplózás törölt rangokra [3]', "engedélyezve")
      embed.addField('Naplózás tömögesen törölt üzenetkre [4]', "engedélyezve")
      embed.addField('Naplózás tagok kilépése/kirúgása [5]', "engedélyezve")
      embed.addField('Naplózás tagok belépések [6]', "engedélyezve")
      embed.addField('Naplózás felhasználó kitiltása [7]', "engedélyezve")
      embed.addField('Naplózás felhasználó kitiltás feoldása [8]', "engedélyezve")
      embed.addField('Naplózás emoji létrehozáshoz [9]', "engedélyezve")
      embed.addField('Naplózás emoji törléshez [10]', "engedélyezve")
      embed.addField('Naplózás csatorna létrehozáshoz [11]', "engedélyezve")
      embed.addField('Naplózás csatorna törlésénél [12]', "engedélyezve")
     embed.addField(`----------------------`, `Parancsok: \n\`${prefix}enable [number]\` - Log modul engedélyezése\n\`${prefix}enable all\` - Összes log modul engedélyezése \n \`${prefix}disable [number]\` - Log module letiltása \n\`${prefix}disable all\` - Összes log module letiltása\n \`${prefix}reset\` - Frissíti a botok teljes cache-ét a szerveren; minden alapértelmezett beállításra áll, naplózási csatorna nélkül`)
   var x = await db.get('loggingchannel_' + message.guild.id)
    if (x == null) embed.addField(`A jelenlegi naplózási csatorna értéke ${y}. Egy másik csatorna beállításához írja be a következő parancsot::`, `\`${prefix}setchannel #csatorna\``)
    if (x !== null) {
      var y = client.channels.get(x)
     embed.addField(`----------------------`, `A jelenlegi naplózási csatorna értéke ${y}. Egy másik csatorna beállításához írja be a következő parancsot: **${prefix}setchannel #csatorna**`)
    }
      embed.setFooter(`Bármilyen javaslat a botra vagy a beállítási folyamatra vonatkozóan? Írj rám privátban:\n`+ `${client.users.get('406923333154897930').tag} `)
    } else if (y == "disabled") {
        embed.addField('Naplózás üzenet törlésnél [1]', "letiltva")
      embed.addField('Naplózás létrehozott rangokra [2]', "letiltva")
      embed.addField('Naplózás törölt rangokra [3]', "letiltva")
      embed.addField('Naplózás tömögesen törölt üzenetkre [4]', "letiltva")
      embed.addField('Naplózás tagok kilépése/kirúgása [5]', "letiltva")
      embed.addField('Naplózás tagok belépések [6]', "letiltva")
      embed.addField('Naplózás felhasználó kitiltása [7]', "letiltva")
      embed.addField('Naplózás felhasználó kitiltás feoldása [8]', "letiltva")
      embed.addField('Naplózás emoji létrehozáshoz [9]', "letiltva")
      embed.addField('Naplózás emoji törléshez [10]', "letiltva")
      embed.addField('Naplózás csatorna létrehozáshoz [11]', "letiltva")
      embed.addField('Naplózás csatorna törlésénél [12]', "letiltva")
    embed.addField(`----------------------`, `Parancsok: \n\`${prefix}enable [number]\` - Log modul engedélyezése\n\`${prefix}enable all\` - Összes log modul engedélyezése \n \`${prefix}disable [number]\` - Log module letiltása \n\`${prefix}disable all\` - Összes log module letiltása\n \`${prefix}reset\` - Frissíti a botok teljes cache-ét a szerveren; minden alapértelmezett beállításra áll, naplózási csatorna nélkül`)
    var x = await db.get('loggingchannel_' + message.guild.id)
    if (x == null) embed.addField(`A jelenlegi naplózási csatorna értéke ${y}. Egy másik csatorna beállításához írja be a következő parancsot:`, `\`${prefix}setchannel #csatorna\``)
    if (x !== null) {
      var y = client.channels.get(x)
      embed.addField(`----------------------`, `A jelenlegi naplózási csatorna értéke ${y}. Egy másik csatorna beállításához írja be a következő parancsot: **${prefix}setchannel #csatorna**`)
    }
    }
      else {
      
    var x = await db.get('messagedelete_' + message.guild.id)
    if (x == null || x == "disabled") {embed.addField('logging deleted messages [1]', "letiltva")} else {embed.addField('logging deleted messages [1]', "engedélyezve")}
    var x = await db.get('rolecreate_' + message.guild.id)
    if (x == null || x == "disabled") {embed.addField('logging created roles [2]', "letiltva")} else {embed.addField('logging created roles [2]', "engedélyezve")}
    var x = await db.get('roledelete_' + message.guild.id)
    if (x == null || x == "disabled") {embed.addField('logging deleted roles [3]', "letiltva")} else {embed.addField('logging deleted roles [3]', "engedélyezve")}
    var x = await db.get('messagebulkdelete_' + message.guild.id)
    if (x == null || x == "disabled") {embed.addField('logging bulk message deletes [4]', "letiltva")} else {embed.addField('logging bulk message deletes [4]', "engedélyezve")}
    var x = await db.get('guildmemberremove_' + message.guild.id)
    if (x == null || x == "disabled") {embed.addField('logging member leaves/user kicks [5]', "letiltva")} else {embed.addField('logging member leaves/user kicks [5]', "engedélyezve")}
    var x = await db.get('guildmemberadd_' + message.guild.id)
    if (x == null || x == "disabled") {embed.addField('logging member joins [6]', "letiltva")} else {embed.addField('logging member joins [6]', "engedélyezve")}
    var x = await db.get('guildbanadd_' + message.guild.id)
    if (x == null || x == "disabled") {embed.addField('logging guild bans [7]', "letiltva")} else {embed.addField('logging guild bans [7]', "engedélyezve")}
    var x = await db.get('guildbanremove_' + message.guild.id)
    if (x == null || x == "disabled") {embed.addField('logging guild unbans [8]', "letiltva")} else {embed.addField('logging guild unbans [8]', "engedélyezve")}
    var x = await db.get('emojicreate_' + message.guild.id)
    if (x == null || x == "disabled") {embed.addField('logging emoji creations [9]', "letiltva")} else {embed.addField('logging emoji creations [9]', "engedélyezve")}
    var x = await db.get('emojidelete_' + message.guild.id)
    if (x == null || x == "disabled") {embed.addField('logging emoji deletions [10]', "letiltva")} else {embed.addField('logging emoji deletions [10]', "engedélyezve")}
    var x = await db.get('channelcreate_' + message.guild.id)
    if (x == null || x == "disabled") {embed.addField('logging channel creations [11]', "letiltva")} else {embed.addField('logging channel creations [11]', "engedélyezve")}
    var x = await db.get('channeldelete_' + message.guild.id)
    if (x == null || x == "disabled") {embed.addField('logging channel deletions [12]', "letiltva")} else {embed.addField('logging channel deletions [12]', "engedélyezve")}
    embed.addField(`----------------------`, `commands: \n\`${prefix}enable [number]\` - enable the logging for a module\n\`${prefix}enable all\` - enable all logging modules \n \`${prefix}disable [number]\` - disable a logging module \n\`${prefix}disable all\` - disable all logging modules\n \`${prefix}reset\` - refreshes the bots entire cache for the server; everything set to default, with no logging channel`)
    var x = await db.get('loggingchannel_' + message.guild.id)
    if (x == null) embed.addField(`Nincsen jelenleg beállítva log csatorna használd ezt parancsot:`, `\`${prefix}setchannel #csatorna\``)
    if (x !== null) {
      var y = client.channels.get(x)
      embed.addField(`----------------------`, `A jelenlegi naplózási csatorna értéke ${y}. Egy másik csatorna beállításához írja be a következő parancsot: **${prefix}setchannel #channel**`)
    }
    }
      embed.setFooter(`Bármilyen javaslat a botra vagy a beállítási folyamatra vonatkozóan? Írj rám privátban:\n`+ `${client.users.get('406923333154897930').tag}`)
      embed.addField(`----------------------\n`, `[Bot meghívása](Saját bot linked.)`)
    message.channel.send(embed)
    
  }
  
  if (command == "reset") {
    if (!message.guild) return message.reply('A parancsot légyszi szerveren használd')
     if (!message.member.hasPermission(`MANAGE_CHANNELS`) || !message.member.hasPermission(`MANAGE_GUILD`)) return message.channel.send(`Bocsi, neked Csatornák kezelése vagy Szerver Kezelése jogosultságra van szükséged ehhez!`)
     await db.delete(`loggingchannel_${message.guild.id}`)
     await db.delete(`allenabled_${message.guild.id}`)
    await db.delete(`messagedelete_${message.guild.id}`)
     await db.delete('rolecreate_' + message.guild.id)
     await db.delete('roledelete_' + message.guild.id)
    await db.delete('messagebulkdelete_' + message.guild.id)
    await db.delete('guildmemberremove_' + message.guild.id)
    await db.delete('guildmemberadd_' + message.guild.id)
    await db.delete('guildbanadd_' + message.guild.id)
    await db.delete('guildbanremove_' + message.guild.id)
    await db.delete('emojicreate_' + message.guild.id)
    await db.delete('emojidelete_' + message.guild.id)
     await db.delete('channelcreate_' + message.guild.id)
     await db.delete('channeldelete_' + message.guild.id)
  message.channel.send(`Kész, a cache törölve lett a szerverről. Írd be \`${prefix}help\` hogy újra beállítsd.`)
  }

  if (command == "disable") {
    
    if (!message.guild) return message.reply('A parancsot légyszi szerveren használd')
     if (!message.member.hasPermission(`MANAGE_CHANNELS`) || !message.member.hasPermission(`MANAGE_GUILD`)) return message.channel.send(`Bocsi, neked Csatornák kezelése vagy Szerver Kezelése jogosultságra van szükséged ehhez!`)
     if (!args[0]) return message.channel.send(`Meg kell adnod egy számot. Írd be \`${prefix}help\` további segítségért.`)
    var x = await db.get('loggingchannel_' + message.guild.id)
    if (x == null || x == 'none') {
    return message.channel.send(`Nem állítottál be log csatornát. Írd be \`${prefix}help\` további segítségért.`)
    }
    if (args[0] > 12 || args[0] < 1) return message.reply(`Írd be \`${prefix}help\` és keresse meg azt a számot, amelyik eseménynél szeretné letiltani a naplózást.`)
    switch(args[0]) {
      case "1": 
        await db.set(`messagedelete_${message.guild.id}`, 'disabled')
        message.channel.send(`ok, az üzenet törlés le van tiltvas`)
      await db.delete(`allenabled_${message.guild.id}`)
        break;
      case "2": 
        await db.set(`rolecreate_${message.guild.id}`, 'disabled')
          message.channel.send(`ok, a rang létrehozás le van tiltva`)
       await db.delete(`allenabled_${message.guild.id}`)
        break;
        case "3": 
         await db.set(`roledelete_${message.guild.id}`, 'disabled')
          message.channel.send(`ok, a rang törlés le van tiltva`)
        await db.delete(`allenabled_${message.guild.id}`)
        break;
        case "4": 
        await db.set(`messagebulkdelete_${message.guild.id}`, 'disabled')
          message.channel.send(`ok, a tömegesen törölt üzenetek le van tiltva`)
        await db.delete(`allenabled_${message.guild.id}`)
        break;
        case "5": 
        await db.set(`guildmemberremove_${message.guild.id}`, 'disabled')
          message.channel.send(`ok, letiltotta a naplózó tagok kilépését/felhasználók kirúgúsát`)
     await db.delete(`allenabled_${message.guild.id}`)
        break;
        case "6": 
        await db.set(`guildmemberadd_${message.guild.id}`, 'disabled')
          message.channel.send(`ok, a tagok belépése le van tiltva`)
       await db.delete(`allenabled_${message.guild.id}`)
        break;
        case "7": 
        await db.set(`guildbanadd_${message.guild.id}`, 'disabled')
          message.channel.send(`ok, a felhasználó kitiltás le van tiltva`)
     await db.delete(`allenabled_${message.guild.id}`)
        break;
        case "8": 
        await db.set(`guildbanremove_${message.guild.id}`, 'disabled')
          message.channel.send(`ok, a kitiltás feoldása le van tiltva`)
        await db.delete(`allenabled_${message.guild.id}`)
        break;
      case "9":
        await db.set(`emojicreate_${message.guild.id}`, 'disabled')
          message.channel.send(`ok, a emoji létrehozás le van tiltva`)
        await db.delete(`allenabled_${message.guild.id}`)
        break;
        case "10": 
        await db.set(`emojidelete_${message.guild.id}`, 'disabled')
          message.channel.send(`ok, az emoji törlés le van tiltva`)
        await db.delete(`allenabled_${message.guild.id}`)
        break;
        case "11": 
        await db.set(`channelcreate_${message.guild.id}`, 'disabled')
          message.channel.send(`ok, a csatorna létrehozás le van tiltva`)
        await db.delete(`allenabled_${message.guild.id}`)
        break;
        case "12": 
        await db.set(`channeldelete_${message.guild.id}`, 'disabled')
          message.channel.send(`ok, a csatorna törlés le van tiltva`)
       await db.delete(`allenabled_${message.guild.id}`)
        break;
      case "all":
        await db.set(`allenabled_${message.guild.id}`, 'disabled')
        await db.set(`messagedelete_${message.guild.id}`, 'disabled')
        await db.set('rolecreate_' + message.guild.id, 'disabled')
     await db.set('roledelete_' + message.guild.id, 'disabled')
    await db.set('messagebulkdelete_' + message.guild.id, 'disabled')
    await db.set('guildmemberremove_' + message.guild.id, 'disabled')
    await db.set('guildmemberadd_' + message.guild.id, 'disabled')
    await db.set('guildbanadd_' + message.guild.id, 'disabled')
    await db.set('guildbanremove_' + message.guild.id, 'disabled')
    await db.set('emojicreate_' + message.guild.id, 'disabled')
    await db.set('emojidelete_' + message.guild.id, 'disabled')
     await db.set('channelcreate_' + message.guild.id, 'disabled')
     await db.set('channeldelete_' + message.guild.id, 'disabled')
        message.channel.send(`ok az összes esemény le van tiltva a szerveren`)
    }
  }
  
  if (command == "enable") {
    if (!message.guild) return message.reply('A parancsot légyszi szerveren használd.')
     if (!message.member.hasPermission(`MANAGE_CHANNELS`) || !message.member.hasPermission(`MANAGE_GUILD`)) return message.channel.send(`Bocsi, neked Csatornák kezelése vagy Szerver Kezelése jogosultságra van szükséged ehhez!`)
        if (!args[0]) return message.channel.send(`Meg kell adnod egy számot. Írd be \`${prefix}help\` további segítségért.`)
    var x = await db.get('loggingchannel_' + message.guild.id)
    if (x == null || x == 'none') {
    return message.channel.send(`Nem állítottál be log rendszert a szerveren, Írd be \`${prefix}help\` további segítségért.`)
    }
    if (args[0] > 12 || args[0] < 1) return message.reply(`Írd be \`${prefix}help\` és keresse meg azt a számot, amelyik eseménynél szeretné engedélyezni a naplózást.`)
    switch(args[0]) {
      case "1": 
        await db.set(`messagedelete_${message.guild.id}`, 'enabled')
     message.channel.send(`ok, engedélyezte a törölt üzenetek naplózását`)
        await db.delete(`allenabled_${message.guild.id}`)
        break;
      case "2": 
        await db.set(`rolecreate_${message.guild.id}`, 'enabled')
          message.channel.send(`ok, engedélyezte a létrehozott rangok naplózását`)
       await db.delete(`allenabled_${message.guild.id}`)
        break;
        case "3": 
         await db.set(`roledelete_${message.guild.id}`, 'enabled')
          message.channel.send(`ok, engedélyezte a törölt rangok naplózását`)
      await db.delete(`allenabled_${message.guild.id}`)
        break;
        case "4": 
        await db.set(`messagebulkdelete_${message.guild.id}`, 'enabled')
          message.channel.send(`ok, engedélyezte a tömegesen törölt üzenetek naplózását`)
     await db.delete(`allenabled_${message.guild.id}`)
        break;
        case "5": 
        await db.set(`guildmemberremove_${message.guild.id}`, 'enabled')
          message.channel.send(`ok, engedélyezve a tagok kilépése/felhasználók kirúgása naplózása`)
       await db.delete(`allenabled_${message.guild.id}`)
        break;
        case "6": 
        await db.set(`guildmemberadd_${message.guild.id}`, 'enabled')
          message.channel.send(`ok, engedélyezte a naplózást az új tagok számára`)
       await db.delete(`allenabled_${message.guild.id}`)
        break;
        case "7": 
        await db.set(`guildbanadd_${message.guild.id}`, 'enabled')
          message.channel.send(`ok, engedélyezte a kitiltott felhasználók naplózását`)
        await db.delete(`allenabled_${message.guild.id}`)
        break;
        case "8": 
        await db.set(`guildbanremove_${message.guild.id}`, 'enabled')
          message.channel.send(`ok, engedélyezte a kitiltott felhasználók feoldása naplózását`)
       await db.delete(`allenabled_${message.guild.id}`)
        break;
      case "9":
        await db.set(`emojicreate_${message.guild.id}`, 'enabled')
          message.channel.send(`ok, engedélyezte az emoji létrehozási naplózását`)
      await db.delete(`allenabled_${message.guild.id}`)
        break;
        case "10": 
        await db.set(`emojidelete_${message.guild.id}`, 'enabled')
          message.channel.send(`ok, engedélyezte az emoji törölési naplózását`)
        await db.delete(`allenabled_${message.guild.id}`)
        break;
        case "11": 
        await db.set(`channelcreate_${message.guild.id}`, 'enabled')
          message.channel.send(`ok, engedélyezte a csatornák létrehozásának naplózását`)
      await db.delete(`allenabled_${message.guild.id}`)
        break;
        case "12": 
        await db.set(`channeldelete_${message.guild.id}`, 'enabled')
          message.channel.send(`ok, engedélyezte a csatornák törlésének naplózását`)
        await db.delete(`allenabled_${message.guild.id}`)
        break;
      case "all":
        await db.set(`allenabled_${message.guild.id}`, 'enabled')
        
           await db.set('rolecreate_' + message.guild.id, 'enabled')
         await db.set(`messagedelete_${message.guild.id}`, 'enabled')
     await db.set('roledelete_' + message.guild.id, 'enabled')
    await db.set('messagebulkdelete_' + message.guild.id, 'enabled')
    await db.set('guildmemberremove_' + message.guild.id, 'enabled')
    await db.set('guildmemberadd_' + message.guild.id, 'enabled')
    await db.set('guildbanadd_' + message.guild.id, 'enabled')
    await db.set('guildbanremove_' + message.guild.id, 'enabled')
    await db.set('emojicreate_' + message.guild.id, 'enabled')
    await db.set('emojidelete_' + message.guild.id, 'enabled')
     await db.set('channelcreate_' + message.guild.id, 'enabled')
     await db.set('channeldelete_' + message.guild.id, 'enabled')
        message.channel.send(`ok engedélyezte a naplózást minden eseményre ezzen a szerveren`)
    }
  }
  
  if (command == "setchannel") {
    if (!message.guild) return message.reply('A parancsot légyszi szerveren használd!')
     if (!message.member.hasPermission(`MANAGE_CHANNELS`) || !message.member.hasPermission(`MANAGE_GUILD`)) return message.channel.send(`Bocsi, neked Csatornák kezelése vagy Szerver Kezelése jogosultságra van szükséged ehhez!`)
     if (!args[0] || args[1]) return message.reply(`Kérlek adj meg egy csatornát, pl.: \`${prefix}setchannel #csatorna\``)
    
     x = message.mentions.channels.first()
    if (!x) return message.channel.send(`Kérlek adj meg egy csatornát, pl.: \`${prefix}setchannel #csatorna\``)
     await db.set(`loggingchannel_${message.guild.id}`, x.id)
      message.channel.send(`ok, logging channel for this guild set to ${x}`)
  }
  
});

client.on('error', e=> {console.log(e)})
client.login(`BOT-TOKEN`).catch(e=>console.log(e));
