import {TextInputStyle} from 'discord.js';
import TextInput from './TextInput.js';

export default class DurationInput extends TextInput {
    constructor() {
        super();
        this.setRequired(false)
            .setLabel('Időtartam')
            .setCustomId('duration')
            .setStyle(TextInputStyle.Short);
    }
}
