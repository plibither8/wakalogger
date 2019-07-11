module.exports = {
	github: {
		base_url: 'https://api.github.com/gists',
		username: process.env.GITHUB_USERNAME,
		password: process.env.GITHUB_PASSWORD,
		gist_id: process.env.GIST_ID
	},
	wakatime: {
		base_url: 'https://wakatime.com/api/v1/users/',
		username: process.env.WAKATIME_USERNAME,
		api_key: process.env.WAKATIME_API_KEY
	}
}
