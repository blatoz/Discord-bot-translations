import {TextInputStyle} from 'discord.js';
import TextInput from './TextInput.js';

export default class CommentInput extends TextInput {
    constructor() {
        super();
        this.setRequired(false)
            .setLabel('Komment')
            .setCustomId('comment')
            .setStyle(TextInputStyle.Paragraph)
            .setPlaceholder('Nincsen komment megadva');
    }
}
