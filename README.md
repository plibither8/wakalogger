# 🕒 WakaLogger

![Build Status](https://github.com/plibither8/wakalogger/workflows/WakaLogger%20Bot/badge.svg)

> Log your daily WakaTime coding activity to a secret Gist.

The script allows you to backup/export/log your daily [WakaTime](https://wakatime.com) coding activity (durations) every day, so that you don't lose any day's data. To automate the process of running the script every day, one can make use of cron jobs offered by CIs - in this case, GitHub Actions.

## Setup

You can either run this script daily, locally, or let Travis handle it for you. To ensure no sensitive data is included in the git repository, environment variables are used for configuration. There are many ways to set these up.

### Secret Gist

You must first create a secret Gist that shall serve as the log file. Don't worry about naming the files, or the content - WakaLogger will take care of that. **Make sure to take note of the Gist ID:** it can be found in the URL.

If the `GIST_ID` variable is not found/undefined, WakaLogger will create a secret Gist for you and tell you the ID. Note it and define the environment variable.

### CI (Travis)

> Note: Even though the following instructions _will_ work, this repository now uses GitHub Actions to perform the cronjobs.

The [`.travis.yml`](.travis.yml) file contains the required commands that Travis will execute each time it *builds* the repository.

1. Fork your own copy of this repository

1. Set up Travis on your forked repository by going to [https://travis-ci.org](https://travis-ci.org)

1. Once set, go to the Travis repository settings

1. Set the following environment variables:

    ```text
    GITHUB_USERNAME
    GITHUB_PASSWORD
    GIST_ID
    WAKATIME_USERNAME
    WAKATIME_API_KEY
    ```

1. Create a cron job (in the repo settings itself): "Branch" shall be `master`, and the ideal frequency should either be "daily" or "weekly"

### Local

1. Clone this repo:

    ```sh
    git clone https://github.com/plibither8/wakalogger
    ```

1. Install packages:

    ```sh
    npm install
    ```

1. Define environment variables in your `.bashrc`/`.zshrc`/etc. file:

    ```sh
    export GITHUB_USERNAME=   # Your GitHub username
    export GITHUB_PASSWORD=   # Your GitHub password in plaintext
    export GIST_ID=           # ID of the secret Gist
    export WAKATIME_USERNAME= # Your WakaTime username
    export WAKATIME_API_KEY=  # Your WakaTime API key
    ```

    *The WakaTime API key can be found here: [https://wakatime.com/settings/api-key](https://wakatime.com/settings/api-key).*

1. Run the script:

    ```sh
    node index
    ```

## License

[MIT](LICENSE)
