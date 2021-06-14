module.exports = {
	future: {
		webpack5: true,
	},
	webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
		// Important: return the modified config
		if (isServer) {
			config.module.rules.push({
				test: /\.(graphql|gql)$/,
				exclude: /node_modules/,
				loader: "graphql-tag/loader",
			});
		}
		return config;
	},
};
