import {TextInputStyle} from 'discord.js';
import TextInput from './TextInput.js';

export default class CountInput extends TextInput {
    constructor() {
        super();
        this.setRequired(false)
            .setLabel('Mennyiség')
            .setCustomId('count')
            .setStyle(TextInputStyle.Short)
            .setPlaceholder('1');
    }
}
