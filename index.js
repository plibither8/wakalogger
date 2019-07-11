const CONFIG = require('./config');
const fetch = require('node-fetch');

const GITHUB_CONFIG = CONFIG.github;
const WAKATIME_CONFIG = CONFIG.wakatime;

function getFetchOptions(method, authString, requestBody = {}) {
	const base64AuthString = Buffer.from(authString).toString('base64');

	return {
		method,
		mode: 'cors',
		cache: 'no-cache',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': 'Basic ' + base64AuthString
		},
		body: JSON.stringify(requestBody)
	}
}

async function getGistId() {
	if (GITHUB_CONFIG.gist_id) {
		return GITHUB_CONFIG.gist_id;
	}

	const gistOptions = {
		description: 'WakaLogger logs',
		public: false,
		files: {
			'wakalogger.json': {
				content: '{}'
			}
		}
	};

	const newGistData = await fetch(
		GITHUB_CONFIG.base_url,
		getFetchOptions(
			'POST',
			`${GITHUB_CONFIG.username}:${GITHUB_CONFIG.password}`,
			gistOptions
		)
	).then(res => res.json());

	const gistId = newGistData.id;

	console.info(`
Environment variable "GIST_ID" was not defined.
A new Gist has been created with the ID "${gistId}".
Save this as "GIST_ID" environment variable.
`);

	return gistId;
}

async function getDateDurations(date) {
	
}

function nextDate(date) {
	const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

	let [year, month, day] = date.split('-').map(str => Number(str));
	const leapYear = ((year % 4 === 0) && (year % 100 !== 0)) || year % 400 === 0;

	if (day < daysInMonth[month - 1] || month === 2 && leapYear && day === 28) {
		day++;
	} else if (month < 12) {
		day = 1;
		month++;
	} else {
		day = month = 1;
		year++;
	}

	return [year, month, day].map(num => num.toString().padStart(2, '0')).join('-');
}

(async () => {
	let id = await getGistId();
	console.log(id)
})()

// gists.all().then(res => res.pages.length).then(console.log)