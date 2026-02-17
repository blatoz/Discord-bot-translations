import EmbedWrapper from './EmbedWrapper.js';
import colors from '../../util/colors.js';
import {AttachmentBuilder, escapeMarkdown} from 'discord.js';
import {EMBED_DESCRIPTION_LIMIT} from '../../util/apiLimits.js';
import got from 'got';

export default class MessageDeleteEmbed extends EmbedWrapper {
    #files = [];

    constructor(message) {
        super();
        this.setColor(colors.RED);
        if (message.system) {
            this.setAuthor({
                name: `Egy rendszer üzenet törölve lett itt #${message.channel.name}`
            });
        }
        else {
            /** @type {import('discord.js').GuildMember|import('discord.js').User} */
            const author = message.member ?? message.author;
            this.setAuthor({
                name: `Üzenet ${escapeMarkdown(author.displayName)} által küldve törölve lett itt #${message.channel.name}`,
                iconURL: author.displayAvatarURL()
            }).setFooter({text:
                    `Üzenet ID: ${message.id}\n` +
                    `Csatorna ID: ${message.channel.id}\n` +
                    `Felhasználó ID: ${message.author.id}`
            });

            if (message.content.length) {
                this.setDescription(message.content.substring(0, EMBED_DESCRIPTION_LIMIT));
            }
        }

        for (/** @type {import('discord.js').Attachment} */ const attachment of message.attachments.values()) {
            this.#files.push(new AttachmentBuilder(got.stream(attachment.url))
                .setDescription(attachment.description)
                .setName(attachment.name)
                .setSpoiler(true));
        }
    }

    toMessage(ephemeral = true) {
        const message = super.toMessage(ephemeral);
        message.files = this.#files;
        return message;
    }
}
