import GuildMemberAddEventListener from './GuildMemberAddEventListener.js';
import {time, TimestampStyles} from 'discord.js';
import GuildWrapper from '../../../discord/GuildWrapper.js';
import colors from '../../../util/colors.js';
import KeyValueEmbed from '../../../formatting/embeds/KeyValueEmbed.js';

export default class LogJoinEventListener extends GuildMemberAddEventListener {
    async execute(member) {
        const guild = await (GuildWrapper.fetch(member.guild.id));
        const embed = new KeyValueEmbed()
            .setTitle(`${member.displayName} csatlakozott a szerverre`)
            .setColor(colors.GREEN)
            .setThumbnail(member.displayAvatarURL())
            .addPair('Felhasználó ID', member.user.id)
            .addPair('Fiók Létrehozva', time(member.user.createdAt, TimestampStyles.RelativeTime))
            .setTimestamp()
            .setFooter({text: `Tagok: ${member.guild.memberCount}`});

        await guild.logJoin({
            embeds: [embed]
        });
    }
}
