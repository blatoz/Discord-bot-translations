import {TextInputStyle} from 'discord.js';
import TextInput from './TextInput.js';

export default class ReasonInput extends TextInput {
    constructor() {
        super();
        this.setRequired(false)
            .setLabel('Indok')
            .setCustomId('reason')
            .setStyle(TextInputStyle.Paragraph)
            .setPlaceholder('Nincsen indok megadva.');
    }
}
