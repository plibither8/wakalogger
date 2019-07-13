const fetch = require('node-fetch');

/**
 * CONFIGURATION:
 * 
 * GitHub:
 * - Using password since GH Token is not being
 *   accepted by Basic Authentication
 */
const GITHUB = {
	base_url: 'https://api.github.com/gists',
	username: process.env.GITHUB_USERNAME,
	password: process.env.GITHUB_PASSWORD,
	gist_id: process.env.GIST_ID
};
const WAKATIME = {
	base_url: 'https://wakatime.com/api/v1/users',
	username: process.env.WAKATIME_USERNAME,
	api_key: process.env.WAKATIME_API_KEY
};

// MAIN:
/**
 * Get durations data for each project on the supplied date
 * @param {String} date - Date in the format yyyy-mm-dd
 * @returns {Object} Date duration data from the API
 */
async function getDateDurationsData(date) {
	const durationData = await fetch(
		`${WAKATIME.base_url}/${WAKATIME.username}/durations?date=${date}`,
		getFetchRequest('GET', WAKATIME.api_key)
	).then(res => res.json());

	return durationData.data;
}


// UTILS:
/**
 * Create `fetch` request object with suitable options
 * @param {String} method - Request method (GET, POST, etc.)
 * @param {String} authString - String to be base64 encoded for Basic Authentication
 * @param {Object} requestBody - (Optional) Options to be sent via POST method
 * 
 * @returns {Object} Request object
 */
function getFetchRequest(method, authString, requestBody) {
	const base64AuthString = Buffer.from(authString).toString('base64'); // base64 encoding
	// Options have been referenced from MDN
	const request = {
		method,
		mode: 'cors',
		cache: 'no-cache',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': 'Basic ' + base64AuthString
		}
	};

	// If a request body has been supplied (when method is POST)
	// then add that to request object
	if (requestBody) request.body = requestBody;

	return request;
}

/**
 * Return Gist ID which will record the logs
 * If gist_id is not defined in the env. vars.
 * the program will create a new private Gist and
 * return its ID
 * @returns {String} - Gist ID
 */
async function getGistId() {
	// If gist_id is there in the environment vars
	if (GITHUB.gist_id) {
		return GITHUB.gist_id;
	}

	// If it is not found, create a Gist and print the ID of it
	const gistOptions = {
		description: 'WakaLogger logs',
		public: false,
		files: {
			'wakalogger.json': {
				content: '{}' // Can't be left empty
			}
		}
	};

	const newGistData = await fetch(
		GITHUB.base_url,
		getFetchRequest(
			'POST', // method
			`${GITHUB.username}:${GITHUB.password}`, // auth string
			gistOptions // body
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

/**
 * Calculate and return the next date in the given format
 * @param {String} date - Date in the format yyyy-mm-dd
 * @returns {String} - next date in yyyy-mm-dd
 */
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
	// let id = await getGistId();
	console.log(await getDateDurations('2019-07-05'))
})();