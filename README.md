# Set up
1. Fork this repo with git: `https://github.com/MrDrummer/obs-discord-bot.git`
2. Assuming you don't already have node.js installed, download and install [NVM For Windows](https://github.com/coreybutler/nvm-windows). This allows easy switching between node.js versions. It must be Node 16 or greater.
3. Open a command prompt, run `nvm install 16.7.0` and then `nvm use 16.7.0`. Validate it switched with `node -v` and it should respond with `16.7.0` (cmd prompt restart may be needed?)
4. Run `npm install -g yarn typescript pm2`
5. Go to `src`, copy `config-template.json` to `config.json`. Edit the values.
6. Navigate to the root of this repo within command prompt and run `yarn`. This will install all packages required to run this bot.
7. `yarn start` will build and then start the bot with pm2. It will restart if it is already running.

# pm2
PM2 is the tool used to keep the bot running even when there is no active connection. Basically treats the bot like a service.

If you need to restart the bot then from a terminal run `pm2 restart bot`, to get logs `pm2 logs bot`. More information can be found on their [wiki](https://pm2.keymetrics.io/docs/usage/process-management/).

You can safely exit the command prompt and the bot will continue to run. Running `pm2 list` will list the processes running. If `bot` isn't listed, then it isn't running (see set up step 6.)

# Server restarts
If the server is restarted for whatever reason, you'll need to go to the location of this repo and follow step 6.

# Bot updates
If there is an update to the bot
1. Run a `git pull` in the repo directory
2. Follow steps 5 & 6.
