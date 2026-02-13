import TextInput from './TextInput.js';
import {TextInputStyle} from 'discord.js';

export default class DeleteMessageHistoryInput extends TextInput {
    constructor() {
        super();
        this.setRequired(false)
            .setLabel('Üzenet törlése')
            .setCustomId('delete')
            .setStyle(TextInputStyle.Short)
            .setValue('1 hour');
    }
}
