/**
 *
 * @param {import("../lib/DiscordMusicBot")} client
 * @param {import("discord.js").GuildCommandInteraction} interaction
 * @returns
 */
module.exports = async (client, interaction) => {
	return new Promise(async (resolve) => {
		if (!interaction.member.voice.channel) {
			await interaction.reply({
				embeds: [
					client.ErrorEmbed(
						"Hangcsatornában kell lenned hogy használd a parancsokat!",
					),
				],
			});
			return resolve(false);
		}
		if (
			interaction.guild.members.me.voice.channel &&
			interaction.member.voice.channel.id !==
			interaction.guild.members.me.voice.channel.id
		) {
			await interaction.reply({
				embeds: [
					client.ErrorEmbed(
						"Ahhoz, hogy ezt a parancsot használhassa, ugyanazon a hangcsatornán kell lennie, mint én!",
					),
				],
			});
			return resolve(false);
		}
		if (!interaction.member.voice.channel.joinable) {
			await interaction.reply({
				embeds: [
					client.ErrorEmbed(
						"Nincs megfelelő jogosultságom ahhoz, hogy csatlakozzak a hangcsatornádhoz!",
					),
				],
			});
			return resolve(false);
		}
		
		resolve(interaction.member.voice.channel);
	});
};
