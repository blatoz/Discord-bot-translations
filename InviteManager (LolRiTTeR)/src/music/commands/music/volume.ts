import { Message } from 'eris';

import { IMClient } from '../../../client';
import { Command, Context } from '../../../framework/commands/Command';
import { NumberResolver } from '../../../framework/resolvers';
import { CommandGroup, MusicCommand } from '../../../types';

export default class extends Command {
	public constructor(client: IMClient) {
		super(client, {
			name: MusicCommand.volume,
			aliases: ['vol'],
			args: [
				{
					name: 'volume',
					resolver: new NumberResolver(client, 0, 1000)
				}
			],
			group: CommandGroup.Music,
			guildOnly: true,
			defaultAdminOnly: false,
			premiumOnly: true
		});
	}

	public async action(message: Message, [volume]: [number], flags: {}, { t, guild }: Context): Promise<any> {
		await this.sendReply(message, 'Bocsi, a `music` modul jelenleg nem elérhető.');
		return;
		const conn = await this.client.music.getMusicConnection(guild);
		if (!conn.isPlaying()) {
			await this.sendReply(message, t('music.notPlaying'));
			return;
		}

		if (volume) {
			conn.setVolume(volume);
			await this.sendReply(message, `A hangerő beállítása ${volume}`);
		} else {
			await this.sendReply(message, `A hangerő jelenleg ${conn.getVolume()}`);
		}
	}
}
