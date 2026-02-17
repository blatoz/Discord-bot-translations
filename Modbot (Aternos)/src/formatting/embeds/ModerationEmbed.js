import {time, TimestampStyles, userMention} from 'discord.js';
import {resolveColor} from '../../util/colors.js';
import {formatTime} from '../../util/timeutils.js';
import KeyValueEmbed from './KeyValueEmbed.js';

/**
 * @import {Moderation} from '../models/Moderation.js';
 */

export default class ModerationEmbed extends KeyValueEmbed {

    /**
     * @param {Moderation} moderation
     * @param {import('discord.js').GuildMember|import('discord.js').User} user
     */
    constructor(moderation, user) {
        super();
        this.setTitle(`Moderáció #${moderation.id} | ${moderation.action.toUpperCase()} | ${user.displayName}`)
            .setColor(resolveColor(moderation.action))
            .setFooter({text: `${user.displayName} - ${moderation.userid}`, iconURL: user.displayAvatarURL()})
            .addPair('Felhasználó ID', moderation.userid)
            .addPair('Létrehozva ekkor',  time(moderation.created, TimestampStyles.LongDate));

        if (moderation.action === 'strike') {
            this.addPair('Strike-ok', moderation.value);
        } else if (moderation.action === 'pardon') {
            this.addPair('Visszavont Strike-ok', -moderation.value);
        }

        if (moderation.expireTime) {
            this.addPair('Lejárat', formatTime(moderation.expireTime - moderation.created));
            this.addPair('Lejár', time(moderation.expireTime, TimestampStyles.LongDate));
        }

        if (moderation.moderator) {
            this.addPair('Moderátor', userMention(moderation.moderator));
        }

        this.addPair('Indok', moderation.reason);
        this.addPairIf(moderation.comment, 'Komment', moderation.comment);
    }
}
