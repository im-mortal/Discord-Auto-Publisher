module.exports = async bot => {
	const { config, logger } = bot;
	function presence() {
		bot.user
			.setPresence({
				activity: {
					name: `${bot.guilds.cache.size} server${ bot.guilds.cache.size == 1 ? '' : 's' }`,
					type: 'WATCHING',
				},
				status: 'online',
			})
			.catch((err) => {
				logger.log(err, 'error');
				return;
			});
	}

	presence();
	setInterval(() => {
		presence();
	}, config.presenceInterval * 60 * 1000);

	let totalMembers = 0;

	logger.log('Checking for blacklisted guilds...', 'log');
	bot.guilds.cache.forEach(guild => {
		const { name, id, memberCount: members } = guild;
		if (config.serversBlacklist.includes(id)) {
			logger.log(`Blacklisted guild: "${name}" (${id}). Leaving...`, 'log');
			guild.leave();
		}
		else {
			totalMembers += members;
		}
	});
	logger.log(`Connected! Publishing on ${bot.guilds.cache.size} server${ bot.guilds.cache.size == 1 ? '' : 's' } with ${totalMembers.toLocaleString('en-US')} total member${ totalMembers.toLocaleString('en-US') == 1 ? '' : 's' }.`, 'ready');
};
