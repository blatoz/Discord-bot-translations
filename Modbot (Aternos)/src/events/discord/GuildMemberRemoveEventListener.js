import EventListener from '../EventListener.js';
import {time, TimestampStyles} from 'discord.js';
import GuildWrapper from '../../discord/GuildWrapper.js';
import colors from '../../util/colors.js';
import KeyValueEmbed from '../../formatting/embeds/KeyValueEmbed.js';

export default class GuildMemberRemoveEventListener extends EventListener {
    get name() {
        return 'guildMemberRemove';
    }

    /**
     * @param {import('discord.js').GuildMember} member
     * @returns {Promise<unknown>}
     */
    async execute(member) {
        const embed = new KeyValueEmbed()
            .setTitle(`${member.displayName} elhagyta a szervert`)
            .setColor(colors.RED)
            .setThumbnail(member.displayAvatarURL())
            .addPair('Felhasználó ID', member.user.id)
            .addPair('Fiók Létrehozva', time(member.user.createdAt, TimestampStyles.RelativeTime))
            .setTimestamp()
            .setFooter({text: `Tagok: ${member.guild.memberCount}`});

        if (member.joinedTimestamp) {
            embed.addPair('Csatlakozott', time(member.joinedAt, TimestampStyles.RelativeTime));
        }

        const guild = await GuildWrapper.fetch(member.guild.id);
        await guild.logJoin({embeds: [embed]});
    }

}
